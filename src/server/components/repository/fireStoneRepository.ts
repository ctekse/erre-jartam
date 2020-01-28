import { Firestore, FieldValue, GeoPoint, DocumentReference } from '@google-cloud/firestore';
import { IRepository, RouteCollection, RouteData, RouteCoordinates } from './repositoryFactory';
import * as path from "path";
import { Feature, Geometry, Position, FeatureCollection, GeoJsonProperties } from 'geojson';

export class FirestoreRepository implements IRepository {
    private firestore: Firestore = null;

    private routeTypeDocRefs: {[name: string]: DocumentReference; } = {};

    constructor() {

        let settings = null;
        if (process.env.NODE_ENV !== "production") {
            settings = {
                keyFilename: path.join(__dirname, '..', '..', '..', '..', 'ErreJartam-SAK.json')
            };
        }

        this.firestore = new Firestore(settings);

        // let docRefs = await this.firestore.collection('routeTypes').listDocuments();

    }

    public async getById(id: string): Promise<RouteCollection> {
        let docRef = this.firestore.doc('/routes/' + id);
        let doc = await docRef.get();

        let routes: FeatureCollection = <FeatureCollection>{
            type: "FeatureCollection",
            features: []
        };

        const routesQuery = await docRef.collection('routes').get();
        const routeDocs = routesQuery.docs;
        for (const route of routeDocs) {
            let routeTypeRef = route.get('routeType');
            let geometryType = route.get('geometryType');

            routes.features.push(<Feature>{
                id: route.id,
                properties: <GeoJsonProperties>{
                    name: route.get('name'),
                    distance: route.get('distance'),
                    routeType: routeTypeRef.id
                },
                geometry: <Geometry>{
                    type: geometryType,
                    coordinates: this.geoPointsToCoordinates(geometryType, route.get('coordinates'))
                }
            });
        }

        return new RouteCollection( {
            id: doc.id,
            name: doc.get('name'),
            routes: routes
        });
    }

    public async filter(searchTerm: string): Promise<RouteCollection[]> {
        throw new Error('Method not implemented.');
    }

    public async save(id: string, features: Feature[]): Promise<Feature[]> {
        let collection = this.firestore
            .doc('/routes/' + id)
            .collection('routes');

        let docRefs = await this.firestore.collection('routeTypes').listDocuments();

        for (let index = 0; index < features.length; index++) {
            const feature = features[index];

            let docData: any = {};
            for (const property in feature.properties) {
                docData[property] = feature.properties[property];
            }
            docData.geometryType = feature.geometry.type;
            docData.coordinates = this.coordinatesToGeoPoints(feature.geometry);
            docData.routeType = docRefs[0];

            let newDocRef = await collection.add(docData);
            feature.id = newDocRef.id;
        }

        return features;
    }

    private coordinatesToGeoPoints(geometry: Geometry): GeoPoint[] {
        let geoPoints: GeoPoint[] = [];

        switch(geometry.type) {
            case 'Point':
                return [ this.positionToGeoPoint(geometry.coordinates) ];
            case 'LineString':
            case 'MultiPoint':
                return geometry.coordinates.map( value => {
                    return this.positionToGeoPoint(value);
                });
        }

        return geoPoints;
    }

    private geoPointsToCoordinates(geometryType: string, geoPoints: GeoPoint[]): Position | Position[] {
        switch (geometryType) {
            case 'Point':
                return this.geoPointToPosition(geoPoints[0]);
            case 'LineString':
            case 'MultiPoint':
                return geoPoints.map(value => {
                    return this.geoPointToPosition(value);
                });
        }
    }

    private positionToGeoPoint(position: Position): GeoPoint {
        return new GeoPoint(position[1], position[0]);
    }
    private geoPointToPosition(geoPoint: GeoPoint): Position {
        return [geoPoint.longitude, geoPoint.latitude];
    }
}
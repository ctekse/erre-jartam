import { Firestore, FieldValue } from '@google-cloud/firestore';
import { IRepository, RouteCollection, RouteData, RouteCoordinates } from './repository';
import * as path from "path";

class Repository implements IRepository {
    private firestore: Firestore = null;

    constructor() {

        let settings = null;
        if (process.env.NODE_ENV !== "production") {
            settings = {
                keyFilename: path.join(__dirname, 'ErreJartam-SAK.json')
            };
        }

        this.firestore = new Firestore(settings);
    }

    public async getById(id: string): Promise<RouteCollection> {
        let docRef = this.firestore.doc('/routes/' + id);
        let doc = await docRef.get();

        let routes: RouteData[] = [];

        const routesQuery = await docRef.collection('routes').get();
        const routeDocs = routesQuery.docs;
        for (const route of routeDocs) {
            let routeTypeRef = await route.get('type').get();
            let lineString = route.get('linestring');

            let coordinates: RouteCoordinates[] = [];
            for (const geoPoint of lineString) {
                coordinates.push(new RouteCoordinates({
                    lat: geoPoint._latitude,
                    lng: geoPoint._longitude
                }));
            }

            routes.push(new RouteData({
                name: route.get('name'),
                distance: route.get('distance'),
                type: routeTypeRef.id,
                coordinates: coordinates
            }));
        }

        return new RouteCollection( {
            id: doc.id,
            name: doc.get('name'),
            routes: routes
        });
    }

    public filter(searchTerm: string): RouteCollection[] {
        throw new Error('Method not implemented.');
    }
}

export const repository = new Repository();
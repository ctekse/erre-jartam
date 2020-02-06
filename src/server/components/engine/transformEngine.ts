import * as toGeoJson from "@tmcw/togeojson";
import { DOMParser } from "xmldom";
import { GeoJSON, Geometry, FeatureCollection, Feature } from 'geojson';
import { RouteModel, StylePairModel } from '../../../common/types';
import { RouteDTO } from '../repository/repositoryFactory';

class TransformEngine {
    /**
    * Converts the uploaded file to GeoJson
    */
    public fromBuffer(buffer: Buffer): GeoJSON {
        let kmlDocument = new DOMParser().parseFromString(buffer.toString('UTF8'), "text/xml");
        return toGeoJson.kml(kmlDocument);
    }

    public toCuratedFeatureArray(geojson: GeoJSON): Feature[] {
        switch(geojson.type) {
            case 'FeatureCollection': return this.featureCollectionToFeatureArray(geojson);
            case 'Feature': return this.featureToFeatureArray(geojson);
            default: return this.geometryToFeatureArray(geojson);
        }
    }

    public dtoToModel(routeDto: RouteDTO): RouteModel {
        let model: RouteModel = {
            id: routeDto.id,
            name: routeDto.name,
            routes: routeDto.routes,
            defaultStyle: { // TODO: defaultStyle!
                normal: {
                    strokeColor: '#f00',
                    strokeOpacity: 0.5,
                    strokeWeight: 2
                },
                hover: {
                    strokeOpacity: 1,
                    strokeWeight: 3
                }
            }
        };

        return model;
    }

    private featureToFeatureArray(feature: Feature): Feature[] {
        return [this.curateFeature(feature)];
    }

    private featureCollectionToFeatureArray(featureCollection: FeatureCollection): Feature[] {
        return featureCollection.features.map(element => {
            return this.curateFeature(element);
        });
    }

    private geometryToFeatureArray(geometry: Geometry): Feature[] {
        return [ <Feature>{
            geometry: geometry
        }];
    }

    private curateFeature(feature: Feature): Feature {
        // first check if this Geometry type is supported, return null otherwise
        // TODO: remove all the unsupported Geometries

        // than: cleanup the unused properties:
        for (const property in feature.properties) {
            if(property !== 'name' && property !== 'Distance') {
                delete feature.properties[property];
            }
            if (property === 'Distance') {
                feature.properties.distance = feature.properties.Distance;
                delete feature.properties.Distance;
            }
        }
        return feature;
    }
}
export const transformEngine = new TransformEngine();
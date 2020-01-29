import * as toGeoJson from "@tmcw/togeojson";
import { DOMParser } from "xmldom";
import { GeoJSON, Geometry, FeatureCollection, Feature } from 'geojson';

class TransformEngine {
    /**
    * Converts the uploaded file to GeoJson
    */
    public FromBuffer(buffer: Buffer): GeoJSON {
        let kmlDocument = new DOMParser().parseFromString(buffer.toString('UTF8'), "text/xml");
        return toGeoJson.kml(kmlDocument);
    }

    public ToCuratedFeatureArray(geojson: GeoJSON): Feature[] {
        switch(geojson.type) {
            case 'FeatureCollection': return this.FeatureCollectionToFeatureArray(geojson);
            case 'Feature': return this.FeatureToFeatureArray(geojson);
            default: return this.GeometryToFeatureArray(geojson);
        }
    }

    private FeatureToFeatureArray(feature: Feature): Feature[] {
        return [this.CurateFeature(feature)];
    }

    private FeatureCollectionToFeatureArray(featureCollection: FeatureCollection): Feature[] {
        return featureCollection.features.map(element => {
            return this.CurateFeature(element);
        });
    }

    private GeometryToFeatureArray(geometry: Geometry): Feature[] {
        return [ <Feature>{
            geometry: geometry
        }];
    }

    private CurateFeature(feature: Feature): Feature {
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
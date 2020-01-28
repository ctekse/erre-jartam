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

    public ToFeatureArray(geojson: GeoJSON): Feature[] {
        switch(geojson.type) {
            case 'FeatureCollection': return this.FeatureCollectionToFeatureArray(geojson);
            case 'Feature': return this.FeatureToFeatureArray(geojson);
            default: return this.GeometryToFeatureArray(geojson);
        }
    }

    // public ToClientData(

    private FeatureToFeatureArray(feature: Feature): Feature[] {
        return [this.CleanupFeatureProperties(feature)];
    }

    private FeatureCollectionToFeatureArray(featureCollection: FeatureCollection): Feature[] {
        return featureCollection.features.map(element => {
            return this.CleanupFeatureProperties(element);
        });
    }

    private GeometryToFeatureArray(geometry: Geometry): Feature[] {
        return [ <Feature>{
            geometry: geometry
        }];
    }

    private CleanupFeatureProperties(feature: Feature): Feature {
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
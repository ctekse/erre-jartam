import { Feature } from 'geojson';
import { StyleModel, StylePairModel } from '../../common/types';

export class ClientScriptHelpers {
    static getStyle(feature: Feature, hover: boolean, defaultStyle: StyleModel | StylePairModel): StyleModel {
        let style = defaultStyle;
        if (feature.geometry.type === "LineString") {
        } else if (feature.geometry.type === "Point") {
        }

        if ('hover' in style) {
            return hover ? style.hover : style.normal;
        } else {
            return style;
        }
    }

    static createMapObj(feature: Feature, latLngBounds: google.maps.LatLngBounds, map: google.maps.Map, defaultStyle: StyleModel | StylePairModel): google.maps.Marker | google.maps.Polyline {
        let style = ClientScriptHelpers.getStyle(feature, false, defaultStyle);
        if (feature.geometry.type === "LineString") {
            return new google.maps.Polyline({
                path: feature.geometry.coordinates.map(value => {
                    let latLng = new google.maps.LatLng(value[1], value[0]);
                    latLngBounds.extend(latLng);
                    return latLng;
                }),
                geodesic: true,
                map: map,
                strokeColor: style.strokeColor,
                strokeOpacity: style.strokeOpacity,
                strokeWeight: style.strokeWeight
            });
        } else if (feature.geometry.type === "Point") {
            return new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
            });
        } else {
        }
    }

}
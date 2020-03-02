import { Feature, Position } from 'geojson';
import { StyleModel, StyleMap } from '../../common/types';

export class ClientScriptHelpers {
    static getStyle(feature: Feature, hover: boolean, defaultStyle: StyleMap ): StyleModel {
        let style = defaultStyle[feature.properties.category] || defaultStyle['default'];
        if (feature.geometry.type === "LineString") {
        } else if (feature.geometry.type === "Point") {
        }

        if (style.hover && hover) {
            return style.hover;
        } else {
            return style;
        }
    }

    static createMapObj(feature: Feature, map: google.maps.Map, defaultStyle: StyleMap): google.maps.Marker | google.maps.Polyline {
        let style = ClientScriptHelpers.getStyle(feature, false, defaultStyle);
        if (feature.geometry.type === "LineString") {
            return new google.maps.Polyline({
                path: this.positionToLatLngArray(feature.geometry.coordinates),
                geodesic: true,
                map: map,
                strokeColor: style.strokeColor,
                strokeOpacity: style.strokeOpacity,
                strokeWeight: style.strokeWeight
            });
        } else if (feature.geometry.type === "Point") {
            return new google.maps.Marker({
                map: map,
                position: this.positionToLatLng(feature.geometry.coordinates)
            });
        } else {
        }
    }

    static latLngToPositionArray(latLngArray: google.maps.MVCArray<google.maps.LatLng>): Position[] {
        let retArray: Position[] = [];
        latLngArray.forEach((elem, i) => {
            retArray.push(this.latLngToPosition(elem));
        });
        return retArray;
    }

    static positionToLatLngArray(positionArray: Position[]): google.maps.MVCArray<google.maps.LatLng> {
        let retArray = new google.maps.MVCArray<google.maps.LatLng>([]);
        positionArray.forEach((value) => {
            retArray.push(this.positionToLatLng(value));
        });
        return retArray;
    }

    static latLngToPosition(latLng: google.maps.LatLng): Position {
        return [latLng.lng(), latLng.lat()];
    }

    static positionToLatLng(position: Position): google.maps.LatLng {
        return new google.maps.LatLng(position[1], position[0]);
    }
}
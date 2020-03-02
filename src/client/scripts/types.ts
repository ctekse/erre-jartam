import { Feature } from 'geojson';

export interface FeatureEx extends Feature {
    mapObject: google.maps.Marker | google.maps.Polyline;
    mapEventListeners: google.maps.MapsEventListener[];
}

export class FeatureEx implements FeatureEx {
}

export interface RouteTypeEditor {
    editRoute(routeData: FeatureEx, routeSaveCallback: (n: Feature) => void): void;
}

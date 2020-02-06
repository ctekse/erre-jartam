import { Feature, FeatureCollection } from 'geojson';

export class RouteModel {
    public id: string;
    public name: string;
    public routes: Feature[];
    public defaultStyle: StyleModel | StylePairModel;
}

export class StyleModel {
    public strokeColor?: string;
    public strokeOpacity?: number;
    public strokeWeight?: number;
    public markerUrl?: string;
}

export class StylePairModel {
    public normal: StyleModel;
    public hover: StyleModel;
}
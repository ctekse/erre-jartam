import { Feature, FeatureCollection } from 'geojson';

export class RouteModel {
    public id: string;
    public name: string;
    public routes: Feature[];
    public styles: StyleMap;
}

export class StyleModel {
    public strokeColor?: string;
    public strokeOpacity?: number;
    public strokeWeight?: number;
    public markerUrl?: string;
    public hover?: StyleModel;
}

// export type StyleMap = Map<string, StyleModel>;

export type StyleMap = { [name: string]: StyleModel; };

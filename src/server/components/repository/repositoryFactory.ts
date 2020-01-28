import { FirestoreRepository } from "./fireStoneRepository";
import { Feature, FeatureCollection } from 'geojson';

export interface IRepository {
    getById(id: string): Promise<RouteCollection>;
    filter(searchTerm: string): Promise<RouteCollection[]>;
    save(id: string, routeObject: Feature[]): Promise<Feature[]>;
}

export class RouteCollection {
    public id: string;
    public name: string;
    public routes: FeatureCollection;

    public constructor(init?: Partial<RouteCollection>) {
        Object.assign(this, init);
    }
}

export class RouteData {
    name: string;
    distance: number;
    type: number;
    coordinates: RouteCoordinates[];

    public constructor(init?: Partial<RouteData>) {
        Object.assign(this, init);
    }
}

export class RouteCoordinates {
    lat: number;
    lng: number;

    public constructor(init?: Partial<RouteCoordinates>) {
        Object.assign(this, init);
    }
}

export const repository: IRepository = new FirestoreRepository();
import { FirestoreRepository } from "./fireStoneRepository";
import { Feature, FeatureCollection } from 'geojson';

export interface IRepository {
    getById(id: string): Promise<RouteDTO>;
    filter(searchTerm: string): Promise<RouteDTO[]>;
    save(id: string, routeObject: Feature[]): Promise<Feature[]>;
    delete(id: string): Promise<boolean>;
}

export class RouteDTO {
    public id: string;
    public name: string;
    public routes: Feature[];

    public constructor(init?: Partial<RouteDTO>) {
        Object.assign(this, init);
    }
}

export const repository: IRepository = new FirestoreRepository();
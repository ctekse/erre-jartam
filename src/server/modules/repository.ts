export interface IRepository {
    getById(id: string): Promise<RouteCollection>;
    filter(searchTerm: string): RouteCollection[];
}

export class RouteCollection {
    public id: string;
    public name: string;
    public routes: RouteData[];

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
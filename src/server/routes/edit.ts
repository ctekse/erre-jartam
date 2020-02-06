import { Request, Response, NextFunction, Router } from "express";
import { repository } from "../components/repository/repositoryFactory";
import * as multer from "multer";
import { transformEngine } from "../components/engine/transformEngine";

let upload = multer();
let router = Router();

router.post('/:id/createFromKml', upload.single('kmlInput'), async (req: Request, res: Response, next: NextFunction) => {
    if(!req.file || !req.file.buffer) {
        res.sendStatus(400);
    }

    let geoJsonObj = transformEngine.fromBuffer(req.file.buffer);
    let featureArray = transformEngine.toCuratedFeatureArray(geoJsonObj);

    // let routesCollection = await repository.getById(req.params.id);

    // TODO, maybe put it as a middleware?
    // permissions.checkPermission(routesCollection, req.user);

    let savedFeatures = await repository.save(req.params.id, featureArray);
    res.json(savedFeatures);
});

router.get('/:id/data', async (req: Request, res: Response, next: NextFunction) => {
    let routesDto = await repository.getById(req.params.id);

    // TODO, maybe put it as a middleware?
    // permissions.checkPermission(routesDto, req.user);

    let model = transformEngine.dtoToModel(routesDto);
    res.json(model);
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let routesCollection = await repository.getById(req.params.id);

    // TODO, maybe put it as a middleware?
    // permissions.checkPermission(routesCollection, req.user);

    let result = await repository.delete(req.params.id);
    res.sendStatus(200);
});

router.use('/:id?', async (req: Request, res: Response, next: NextFunction) => {

    let routesData = await repository.getById(req.params.id);

    // TODO, maybe put it as a middleware?
    // permissions.checkPermission(routesCollection, req.user);

    let routeList = routesData.routes.map(element => {
        return {
            id: element.id,
            name: element.properties.name
        };
    });

    res.render('edit', {
        googleMapsKey: process.env.GOOGLE_MAPS_KEY,
        user: {
            name: 'Tekse',
            image: ''
        },
        routes: routeList,
        searchDisplay: routeList.length > 10,
        routeId: routesData.id,
        layout: false
    });
});

router.use('/', (req: Request, res: Response, next: NextFunction) => {

    // TODO: redirect to default route

    res.render('edit', {
        googleMapsKey: process.env.GOOGLE_MAPS_KEY,
        layout: false
    });
});

export default router;
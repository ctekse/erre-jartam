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

    let geoJsonObj = transformEngine.FromBuffer(req.file.buffer);
    let featureArray = transformEngine.ToFeatureArray(geoJsonObj);

    // let routesCollection = await repository.getById(req.params.id);
    // TODO, maybe put it as a middleware?
    // permissions.checkPermission(routesCollection, req.user);
    let savedFeatures = await repository.save(req.params.id, featureArray);
    res.json(savedFeatures);
});

router.use('/:id?', (req: Request, res: Response, next: NextFunction) => {

    res.render('edit', {
        layout: false
    });
});

router.use('/', (req: Request, res: Response, next: NextFunction) => {


    res.render('edit', {
        layout: false
    });
});

export default router;
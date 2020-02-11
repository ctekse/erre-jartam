import { Request, Response, NextFunction, Router } from "express";
import { repository } from "../components/repository/repositoryFactory";
import { transformEngine } from "../components/engine/transformEngine";

let router = Router();

router.post('/:id', async (req: Request, res: Response, next: NextFunction) => {
    let routesData = await repository.getById(req.params.id);
    // let hasPermission = await permission.isOwnData(routesData);
    // TODO:
    // if(hasPermission){
        let model = transformEngine.dtoToModel(routesData);
        res.json(model);
    // } else {
    //     res.sendStatus(403);
    // }
});

router.use('/:id?' , (req: Request, res: Response, next: NextFunction) => {
    res.render('index', {
        googleMapsKey: process.env.GOOGLE_MAPS_KEY,
        layout: false
    });
});

export default router;
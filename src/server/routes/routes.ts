import { Request, Response, NextFunction, Router } from "express";
import { repository } from "../modules/fireStoneRepository";

let router = Router();

let routesPath = '/routes/';

let routesViewModel = {
    baseUrl: routesPath,
    errorMsg: <string>null,
    layout: false
};

router.post(routesPath + ':id', async (req: Request, res: Response, next: NextFunction) => {
    res.json({ok: 'OK'});

    // let routesData = await repository.getById(req.params.id);
    // // tslint:disable-next-line: whitespace
    // if( routesData ) {
    //     res.render('index', {
    //         baseUrl: routesPath,
    //         errorMsg: 'Route found!',
    //         layout: false
    //     });    } else {
    //     res.render('index');
    // }
});

router.use(['/', routesPath] , (req: Request, res: Response, next: NextFunction) => {
    res.render('index', {
        baseUrl: routesPath,
        googleMapsKey: process.env.GOOGLE_MAPS_KEY,
        layout: false
    });
});

export default router;
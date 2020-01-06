import { Request, Response, NextFunction, Router } from "express";

let router = Router();

router.use('/routes/:id', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Routes: /routes - " + req.params.id);
});

router.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Routes: /");
});

export default router;
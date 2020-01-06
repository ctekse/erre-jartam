import { Request, Response, NextFunction, Router } from "express";

let router = Router();

router.use('/:id', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Edit: / - " + req.params.id);
});

router.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Edit: /");
});

export default router;
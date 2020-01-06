import { Request, Response, NextFunction, Router } from "express";

let router = Router();

router.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("Account: /");
});

export default router;
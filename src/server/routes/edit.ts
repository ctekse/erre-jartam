import { Request, Response, NextFunction, Router } from "express";

let router = Router();

router.use('/:id?', (req: Request, res: Response, next: NextFunction) => {
    res.render('edit', {
        layout: false
    });
});

export default router;
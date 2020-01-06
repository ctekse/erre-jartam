import * as express from "express";
import * as winston from "winston";
import {json} from "body-parser";
import * as morgan from "morgan";
import {Express, Request, Response} from "express";
import routesHandler from "./routes/routes";
import accountHandler from "./routes/account";
import editHandler from "./routes/edit";

const PORT: number = 1337;

export class Server {

    public static start() {

        // if (process.env.NODE_ENV !== "production") {
        //     winston.add(new winston.transports.Console({
        //         format: winston.format.combine(
        //             winston.format.colorize(),
        //             winston.format.simple()
        //         )
        //     }));
        // }

        let app: Express = express();

        // app.set("etag", false);

        // Decode payload as json with body-parser
        app.use(json());

        // Apply morgan request logger
        app.use(morgan("combined"));

        // Set headers for CORS requests
        // TODO: Adjust these settings to your security concerns!
        app.use((req: Request, res: Response, next: any) => {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,authorization");
            next();
        });

        app.use('/edit', editHandler);
        app.use('/account', accountHandler);
        app.use('/', routesHandler);

        app.listen(PORT, () => winston.log("info", "--> Server successfully started at port %d", PORT));
    }
}

Server.start();

import { NextFunction, Request, Response } from "express";
import { Application } from "./../entities/application.entity";

export async function LoadAppMiddleware(req: Request, res: Response, next: NextFunction) {
    const appId = req.params.appId;
    const app = await Application.findOne(appId, {
        relations: ['privileges', 'roles'],
    });
    if (app) {
        // @ts-ignore
        req.headers['app'] = app;
    }

    next();
}
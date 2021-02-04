import { NextFunction, Request, Response } from "express";
import { Application } from "./../entities/application.entity";

export async function LoadAppMiddleware(req: Request, res: Response, next: NextFunction) {
    const appId = req.params.appId;
    const orgId = req.params.id;
    if (orgId && appId) {
        const app = await Application.findOneOrFail({
            relations: ['privileges', 'roles'],
            where: {
                id: appId,
                organization: {
                    id: orgId,
                }
            }
        });

        if (app) {
            // @ts-ignore
            req.headers['app'] = app;
        }
    }
    
    next();
}
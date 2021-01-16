import { NextFunction, Request, Response } from "express";
import { Organization } from "src/entities/organization.entity";

export async function LoadOrgMiddleware(req: Request, res: Response, next: NextFunction) {
    const orgId = req.params.id;
    const org = await Organization.findOne(orgId, {
        relations: ['privileges', 'roles', 'applications'],
    });
    if (org) {
        // @ts-ignore
        req.headers['org'] = org;
    }

    next();
}
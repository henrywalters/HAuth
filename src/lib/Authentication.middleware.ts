import { Injectable, NestMiddleware, Req } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { auth } from "google-auth-library";
import { AppToken } from "src/entities/appToken.entity";
import { RequestLog } from "src/entities/requestLog.entity";
import { User } from "src/entities/user.entity";
import { UserSession } from "src/entities/userSession.entity";
import { Authentication, TokenType } from "src/lib/Authentication";

export interface AuthHeader {
    holder: string;
    token: string;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    private getAuthHeader(req: Request): AuthHeader | undefined {
        const header = req.header("Authorization");
        if (!header) return void 0;
        const parts = header.split(" ");
        if (parts.length !== 2) {
            console.warn("Invalid auth header");
        }
        return {
            holder: parts[0],
            token: parts[1],
        }
    }

    private async processBearerToken(req: Request, token: string) {
        try {
            const decoded = await Authentication.validateToken(token);

            if (decoded.type == TokenType.ACCESS_TOKEN) {

                const session = await UserSession.getCurrentSession(decoded.user);

                if (session) {
                    // @ts-ignore
                    req.headers["session"] = session;
                    // @ts-ignore
                    req.headers['user'] = decoded.user;
                }

                // @ts-ignore
                await RequestLog.setUserOfLog(req.headers['request'].id, decoded.user);
            }
            
        } catch (e) {
            // Add failed logging here
            console.log(e);
            // @ts-ignore
            await RequestLog.block(req.headers['request'].id, e.message);
        }
    }

    private async processAppToken(req: Request, token: string) {
        try {
            const appToken = await AppToken.findOneOrFail({
                where: {
                    token,
                },
                relations: ['application'],
            });

            console.log(appToken);

            if (appToken) {
                // @ts-ignore
                req.headers["apptoken"] = appToken;
            }
        } catch (e) {
            console.log(e);
            // @ts-ignore
            await RequestLog.block(req.headers['request'].id, e.message);
        }
    }

    public async use(req: Request, res: Response, next: NextFunction) {
        console.log(req.headers);
        // @ts-ignore
        const authHeader = this.getAuthHeader(req);
        if (authHeader) {
            if (authHeader.holder === 'Bearer') {
                await this.processBearerToken(req, authHeader.token);
            }

            if (authHeader.holder === 'App') {
                await this.processAppToken(req, authHeader.token);
            }
        }
        next();
    }
}
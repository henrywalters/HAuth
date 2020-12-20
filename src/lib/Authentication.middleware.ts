import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { auth } from "google-auth-library";
import { User } from "src/entities/user.entity";
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

    public async use(req: Request, res: Response, next: NextFunction) {
        // @ts-ignore
        const authHeader = this.getAuthHeader(req);

        console.log(authHeader);

        if (authHeader) {
            try {
                const decoded = await Authentication.validateToken(authHeader.token);

                console.log(decoded)
                if (decoded.type == TokenType.ACCESS_TOKEN) {
                    // @ts-ignore
                    req.headers['user'] = decoded.user;
                }
                
            } catch (e) {
                // Add failed logging here
                console.log(e);
            }
        }
        next();
    }
}
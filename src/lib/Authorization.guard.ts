import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from 'rxjs';
import { Privilege } from "src/entities/privilege.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class Authorize implements CanActivate {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.user) return false;

        return true;
    }
}

@Injectable()
export class AuthorizeFor implements CanActivate {
    private privilege: string[];

    constructor(privileges: string[]) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.user) return false;

        

        return true;
    }
}
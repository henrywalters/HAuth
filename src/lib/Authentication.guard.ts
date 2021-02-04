import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from 'rxjs';
import { Privilege } from "src/entities/privilege.entity";
import { RequestLog } from "src/entities/requestLog.entity";
import { User } from "src/entities/user.entity";


// Authenticate checks whether a user or app token is attached to request by Authentication middleware
@Injectable()
export class Authenticate implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.user && !request.headers.apptoken) {
            // @ts-ignore;
            await RequestLog.block(request.headers['request'].id, 'User or app token not found on request');
            return false;
        }

        return true;
    }
}

// Authenticate checks whether a user is attached to request by Authentication middleware
@Injectable()
export class AuthenticateUser implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.user) {
            // @ts-ignore;
            await RequestLog.block(request.headers['request'].id, 'User not found on request');
            return false;
        }

        return true;
    }
}

// Authenticate checks whether an app token is attached to request by Authentication middleware
@Injectable()
export class AuthenticateAppToken implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.headers.apptoken) {
            // @ts-ignore;
            await RequestLog.block(request.headers['request'].id, 'App token not found on request');
            return false;
        }

        return true;
    }
}
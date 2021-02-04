import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Privilege } from "src/entities/privilege.entity";
import { User } from "src/entities/user.entity";
import {RequestLog} from "src/entities/requestLog.entity";

@Injectable()
export class AuthorizeForOrg implements CanActivate {

    private readonly privilegeNames: string[];

    constructor(...privilegeNames: string[]) {
        this.privilegeNames = privilegeNames;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        console.log(`Authorizing Privileges ${this.privilegeNames.join(', ')}`);

        const request = context.switchToHttp().getRequest();

        const orgId = request.params.id;

        if (!orgId) {
            console.warn("id parameter expected to call AuthorizeForOrg");
            return false;
        }

        if (!request.headers.user) return false;

        const missing = [];

        for (const privilegeName of this.privilegeNames) {

            const privilege = await Privilege.find({
                where: {
                    organization: {
                        id: orgId,
                    },
                    name: privilegeName,
                }
            })

            console.log(privilege);

            if (!privilege) {
                console.warn(`Privilege ${privilegeName} does not exist`);
                // @ts-ignore
                await RequestLog.block(request.headers['request'].id, `Privilege ${privilegeName} does not exist`)
                throw new HttpException(`Privilege ${privilegeName} does not exist.`, 500);
            }

            if (!(request.headers.user as User).hasPrivilege(privilege[0])) {
                missing.push(privilegeName);
            }
        }

        if (missing.length > 0) {
            // @ts-ignore
            await RequestLog.block(request.headers['request'].id, `Lacking required privileges: ${missing.join(', ')}.`)
            throw new HttpException(`Lacking required privileges: ${missing.join(', ')}.`, 403);
        }

        return true;
    }
}
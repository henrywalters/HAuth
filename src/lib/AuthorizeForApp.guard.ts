import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Privilege } from "src/entities/privilege.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class AuthorizeForApp implements CanActivate {

    constructor(private readonly privilegeName: string) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        console.log(`Authorizing Privilege ${this.privilegeName}`);

        const request = context.switchToHttp().getRequest();

        const appId = request.params.appId;

        if (!appId) {
            console.warn("id parameter expected to call AuthorizeForApp");
            return false;
        }

        if (!request.headers.user) return false;

        const privilege = await Privilege.findOne({
            where: {
                application: {
                    id: appId,
                },
                name: this.privilegeName,
            }
        })

        if (!privilege) {
            console.warn(`Privilege ${this.privilegeName} does not exist`);
            throw new HttpException(`Privilege ${this.privilegeName} does not exist.`, 500);
        }

        if (!(request.headers.user as User).hasPrivilege(privilege)) {
            throw new HttpException(`Lacking ${this.privilegeName} privilege.`, 403);
        }

        return true;
    }
}
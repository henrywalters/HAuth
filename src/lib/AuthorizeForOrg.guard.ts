import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Privilege } from "src/entities/privilege.entity";
import { User } from "src/entities/user.entity";

@Injectable()
export class AuthorizeForOrg implements CanActivate {

    constructor(private readonly privilegeName: string) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        console.log(`Authorizing Privilege ${this.privilegeName}`);

        const request = context.switchToHttp().getRequest();

        const orgId = request.params.id;

        if (!orgId) {
            console.warn("id parameter expected to call AuthorizeForOrg");
            return false;
        }

        if (!request.headers.user) return false;

        const privilege = await Privilege.findOne({
            where: {
                organization: {
                    id: orgId,
                },
                name: this.privilegeName,
            }
        })

        console.log(privilege);

        if (!privilege) {
            console.warn(`Privilege ${this.privilegeName} does not exist`);
            return false;
        }

        return (request.headers.user as User).hasPrivilege(privilege);
    }
}
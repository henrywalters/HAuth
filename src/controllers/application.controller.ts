import { Body, Controller, Post } from "@nestjs/common";
import { ApplicationDto } from "src/dtos/application.dto";
import { Application } from "src/entities/application.entity";
import { Client, ClientType } from "src/entities/client.entity";
import { Privilege } from "src/entities/privilege.entity";
import { Role } from "src/entities/role.entity";
import Crypto from "./../utilities/crypto";

@Controller("v1/application")
export class ApplicationController {
    @Post()
    public async createApp(@Body() req: ApplicationDto) {
        const app = new Application();
        app.name = req.name;
        
        // Initialize base application privileges

        const write = await Privilege.createPrivilege("Super User Write");
        const read = await Privilege.createPrivilege("Super User Read");

        const role = await Role.createRole("Super User", [read, write]);

        app.privileges = [read, write];
        app.roles = [role];

        await app.save();

        const client = new Client();
        client.type = ClientType.SERVER;
        client.name = "Super User API";
        client.roles = [role];
        
        const clientKey = (await Crypto.randomBuffer(48)).toString('hex');
        const clientSecret = await Crypto.randomBuffer(128);

        client.key = clientKey;
        client.secret = Crypto.getEncoded(Crypto.hash(clientSecret));

        await client.save();

        return {
            key: clientKey,
            secret: Crypto.getEncoded(clientSecret),
        }
    }
}
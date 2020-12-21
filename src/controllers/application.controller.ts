import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApplicationDto } from "src/dtos/application.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { Client } from "src/entities/client.entity";
import { Organization } from "src/entities/organization.entity";
import { Privilege } from "src/entities/privilege.entity";
import { Role } from "src/entities/role.entity";
import { Authorize } from "src/lib/Authorization.guard";
import Crypto from "./../utilities/crypto";

@Controller("v1/application")
export class ApplicationController {
    @Post()
    @UseGuards(Authorize)
    public async createApp(@Body() req: ApplicationDto) {
        const app = new Application();
        app.name = req.name;
        app.organization = await Organization.findOneOrFail(req.organizationId);
        app.roles = [];
        app.privileges = [];

        await app.save();

        return ResponseDto.Success(app);
    }
}
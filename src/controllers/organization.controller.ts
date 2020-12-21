import { Body, Controller, Headers, Post, UseGuards } from "@nestjs/common";
import { OrganizationDto } from "src/dtos/organization.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Organization } from "src/entities/organization.entity";
import { User } from "src/entities/user.entity";
import { Authorize } from "src/lib/Authorization.guard";

@Controller("v1/organization")
export class OrganizationController {
    @Post()
    @UseGuards(Authorize)
    public async createOrganization(@Headers("user") user: User, @Body() req: OrganizationDto) {
        const org = new Organization();
        org.name = req.name;
        org.domain = req.domain;
        org.restrictUsersToDomain = req.restrictUsersToDomain;
        org.owner = user;
        await org.save();
        return ResponseDto.Success(org);
    }
}
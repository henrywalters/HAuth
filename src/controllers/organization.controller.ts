import { Body, Controller, Get, Headers, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ApplicationDto } from "src/dtos/application.dto";
import { AddUserDto, OrganizationDto } from "src/dtos/organization.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { Organization } from "src/entities/organization.entity";
import { User } from "src/entities/user.entity";
import { Authorize } from "src/lib/Authorization.guard";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller("v1/organization")
export class OrganizationController {
    @Post()
    @UseGuards(Authorize)
    public async createOrganization(@Headers("user") user: User, @Body() req: OrganizationDto) {
        return ResponseDto.Success(await Organization.createFromDTO(user, req));
    }

    @Get(":id")
    @UseGuards(new AuthorizeForOrg('VIEW_INFO'))
    public async getOrganization(@Headers("org") org: Organization) {
        return ResponseDto.Success(org);
    }

    @Put(":id")
    @UseGuards(new AuthorizeForOrg('EDIT_INFO'))
    public async updateOrganization(@Headers("org") org: Organization, @Body() req: OrganizationDto) {
        return ResponseDto.Success(await org.updateFromDTO(req));
    }

    @Get()
    @UseGuards(Authorize)
    public async getOwnedOrganizations(@Headers("user") user: User) {
        console.log(user);
        return ResponseDto.Success(await Organization.find({
            where: {
                owner: user,
            }
        }))
    }

    @Get(":id/user")
    @UseGuards(new AuthorizeForOrg('VIEW_USER'))
    public async getUsers(@Headers("org") org: Organization) {
        return ResponseDto.Success(await org.getUsers());
    }

    @Post(":id/user")
    @UseGuards(new AuthorizeForOrg('CREATE_USER'))
    public async addUser(@Headers("org") org: Organization, @Body() req: AddUserDto) {
        try {
            return await ResponseDto.Success(org.addUser(req.email));
        } catch (e) {
            return await ResponseDto.Error(e.message);
        }
    }
    
    @Post(':id/application')
    @UseGuards(new AuthorizeForOrg('ADD_APPLICATION'))
    public async createApp(@Body() req: ApplicationDto, @Param("id") id: string) {
        const app = new Application();
        app.name = req.name;
        app.organization = await Organization.findOneOrFail(id);
        app.roles = [];
        app.privileges = [];

        await app.save();

        return ResponseDto.Success(app);
    }
}
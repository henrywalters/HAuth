import { Body, Controller, Delete, Get, Head, Headers, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApplicationDto } from "src/dtos/application.dto";
import { AddUserDto, OrganizationDto } from "src/dtos/organization.dto";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { Organization } from "src/entities/organization.entity";
import { User } from "src/entities/user.entity";
import { Authorize } from "src/lib/Authorization.guard";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller("v1/organization")
@ApiBearerAuth()
export class OrganizationController {
    @Post()
    @UseGuards(Authorize)
    @ApiOperation({summary: 'Create a new organization'})
    public async createOrganization(@Headers("user") user: User, @Body() req: OrganizationDto) {
        return ResponseDto.Success(await Organization.createFromDTO(user, req));
    }

    @Get(":id")
    @UseGuards(new AuthorizeForOrg('VIEW_INFO'))
    @ApiOperation({summary: 'Get an organization and its details'})
    public async getOrganization(@Headers("org") org: Organization) {
        return ResponseDto.Success(org);
    }

    @Put(":id")
    @UseGuards(new AuthorizeForOrg('EDIT_INFO'))
    @ApiOperation({summary: 'Update an organization'})
    public async updateOrganization(@Headers("org") org: Organization, @Body() req: OrganizationDto) {
        return ResponseDto.Success(await org.updateFromDTO(req));
    }

    @Get()
    @UseGuards(Authorize)
    @ApiOperation({summary: 'Get organizations that you are the owner of'})
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
    @ApiOperation({summary: 'View users in organization'})
    public async getUsers(@Headers("org") org: Organization) {
        return ResponseDto.Success(await org.getUsers());
    }

    @Post(":id/user")
    @UseGuards(new AuthorizeForOrg('ADD_USER'))
    @ApiOperation({summary: 'Add user to organization'})
    public async addUser(@Headers("org") org: Organization, @Body() req: AddUserDto) {
        try {
            return await ResponseDto.Success(await org.addUser(req.email));
        } catch (e) {
            return await ResponseDto.Error(e.message);
        }
    }

    @Delete(':id/user')
    @UseGuards(new AuthorizeForOrg('REMOVE_USER'))
    @ApiOperation({summary: 'Remove user from organization'})
    public async removeUser(@Headers('org') org: Organization, @Body() req: AddUserDto) {
        try {
            return await ResponseDto.Success(await org.removeUser(req.email));
        } catch (e) {
            return await ResponseDto.Error(e.message);
        }
    }

    @Get(":id/privilege")
    @UseGuards(new AuthorizeForOrg('VIEW_PRIVILEGE'))
    @ApiOperation({summary: 'View organization privileges'})
    public async viewPrivileges(@Headers("org") org: Organization) {
        return ResponseDto.Success(await org.getPrivileges());
    }

    @Post(":id/privilege")
    @UseGuards(new AuthorizeForOrg('ADD_PRIVILEGE'))
    @ApiOperation({summary: 'Create a new privilege for the organization'})
    public async createPrivilege(@Headers("org") org: Organization, @Body() req: PrivilegeDto) {
        try {
            return ResponseDto.Success(await org.addPrivilege(req));
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }
    
    @Post(':id/application')
    @UseGuards(new AuthorizeForOrg('ADD_APPLICATION'))
    @ApiOperation({summary: 'Create an application within an organization'})
    public async createApp(@Headers("org") org: Organization, @Body() req: ApplicationDto) {
        return ResponseDto.Success(await Application.createFromDTO(org, req));
    }

    @Get(":id/application")
    @UseGuards(new AuthorizeForOrg('VIEW_APPLICATION'))
    @ApiOperation({summary: 'View applications within an organization'})
    public async getApps(@Headers("org") org: Organization) {
        return ResponseDto.Success(await org.getApplications());
    }

    @Get(":id/application/:appId")
    @UseGuards(new AuthorizeForOrg('VIEW_APPLICATION'))
    @ApiOperation({summary: 'View an applications details'})
    public async getApp(@Param("appId") appId: string) {
        return ResponseDto.Success(await Application.findOneOrFail(appId));
    }

    @Delete(":id/application/:appId")
    @UseGuards(new AuthorizeForOrg('REMOVE_APPLICATION'))
    @ApiOperation({summary: 'Remove application from organization'})
    public async removeApp(@Headers("org") org: Organization, @Param("appId") appId: string) {
        return ResponseDto.Success(await org.removeApplication(appId));
    }
}
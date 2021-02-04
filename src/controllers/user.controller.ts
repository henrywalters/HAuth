import { Controller, Get, UseGuards, Headers, Body, Delete, Post, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AssignPrivilegesAndRolesRequest } from "src/dtos/authorization.dto";
import { AddUserDto } from "src/dtos/organization.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { Organization } from "src/entities/organization.entity";
import { Authorization } from "src/lib/Authorization";
import { AuthorizeForApp } from "src/lib/AuthorizeForApp.guard";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller("v1/organization/:id/user")
@ApiBearerAuth()
export class UserController {

    constructor(private readonly auth: Authorization) {}

    @Get()
    @UseGuards(new AuthorizeForOrg('VIEW_USER'))
    @ApiOperation({summary: 'View users in organization'})
    public async getUsers(@Headers("org") org: Organization) {
        return ResponseDto.Success(await org.getUsers());
    }

    @Post()
    @UseGuards(new AuthorizeForOrg('ADD_USER'))
    @ApiOperation({summary: 'Add user to organization'})
    public async addUser(@Headers("org") org: Organization, @Body() req: AddUserDto) {
        try {
            return await ResponseDto.Success(await org.addUser(req.email));
        } catch (e) {
            return await ResponseDto.Error(e.message);
        }
    }

    @Delete(":userId")
    @UseGuards(new AuthorizeForOrg('REMOVE_USER'))
    @ApiOperation({summary: 'Remove user from organization'})
    public async removeUser(@Headers('org') org: Organization, @Param("userId") id: string) {
        try {
            return await ResponseDto.Success(await org.removeUser(id));
        } catch (e) {
            return await ResponseDto.Error(e.message);
        }
    }

    @Get(":userId")
    @UseGuards(new AuthorizeForOrg('VIEW_USER_PRIVILEGE', 'VIEW_USER_ROLE'))
    @ApiOperation({summary: 'View a users organizational privileges and roles'})
    public async getPrivilegesAndRoles(@Headers("org") org: Organization, @Param("userId") id: string) {
        try {
            const auth = await this.auth.getAuthorizedUser(org, id);
            return ResponseDto.Success({
                privileges: auth.privileges,
                roles: auth.roles,
            });
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Post(":userId")
    @UseGuards(new AuthorizeForOrg('ASSIGN_USER_PRIVILEGE', 'ASSIGN_USER_ROLE'))
    @ApiOperation({summary: 'Assign a set of privileges and roles to a user'})
    public async assignPrivilegesAndRoles(@Headers('org') org: Organization, @Param('userId') id: string, @Body() req: AssignPrivilegesAndRolesRequest) {
        try {
            await this.auth.assignUserPrivileges(org, id, req.privilegeIds);
            await this.auth.assignUserRoles(org, id, req.roleIds);
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Post(":userId/application/:appId")
    @UseGuards(new AuthorizeForOrg('ASSIGN_USER_APPLICATION_PRIVILEGE', 'ASSIGN_USER_APPLICATION_ROLE'))
    @ApiOperation({summary: 'Assign a set of application roles and privileges to a user'})
    public async assignAppPrivilegesAndRoles(@Headers('app') app: Application, @Param('userId') id: string, @Body() req: AssignPrivilegesAndRolesRequest) {
        try {
            await this.auth.assignUserPrivileges(app, id, req.privilegeIds);
            await this.auth.assignUserRoles(app, id, req.roleIds);
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Get(":userId/application/:appId")
    @UseGuards(new AuthorizeForOrg('VIEW_USER_APPLICATION_PRIVILEGE', 'VIEW_USER_APPLICATION_ROLE'))
    @ApiOperation({summary: 'View a users application privileges and roles'})
    public async getAppPrivilegesAndRoles(@Headers("app") app: Application, @Param("userId") id: string) {
        try {
            const auth = await this.auth.getAuthorizedUser(app, id);
            return ResponseDto.Success({
                privileges: auth.applicationPrivileges,
                roles: auth.applicationRoles,
            });
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

}
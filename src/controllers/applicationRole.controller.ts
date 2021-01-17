import { Controller, Get, UseGuards, Headers, Param, Res, Put, Head, Body, Delete, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ResponseDto } from "src/dtos/response.dto";
import { RoleDto } from "src/dtos/role.dto";
import { Application } from "src/entities/application.entity";
import { Organization } from "src/entities/organization.entity";
import { Role } from "src/entities/role.entity";
import { Authorization } from "src/lib/Authorization";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller('v1/organization/:id/application/:appId/role')
@ApiBearerAuth()
export class ApplicationRoleController {

    constructor(private readonly auth: Authorization) {}

    @Get()
    @UseGuards(new AuthorizeForOrg('VIEW_APPLICATION_ROLE'))
    @ApiOperation({summary: 'View organization roles'})
    public async getRoles(@Headers("app") app: Application) {
        return ResponseDto.Success(await this.auth.getRoles(app));
    }

    @Post()
    @UseGuards(new AuthorizeForOrg('ADD_APPLICATION_ROLE'))
    @ApiOperation({summary: 'Create a new role'})
    public async createRole(@Headers("app") app: Application, @Body() req: RoleDto) {
        return await this.auth.createRole(app, req);
    }

    @Get(":roleId")
    @UseGuards(new AuthorizeForOrg('VIEW_APPLICATION_ROLE'))
    @ApiOperation({summary: 'View role details'})
    public async getRole(@Headers("app") app: Application, @Param("roleId") roleId: string) {
        return ResponseDto.Success(await this.auth.getRole(app, roleId));
    }

    @Put(":roleId")
    @UseGuards(new AuthorizeForOrg('EDIT_APPLICATION_ROLE'))
    @ApiOperation({summary: 'Edit organizational role'})
    public async editRole(@Headers("app") app: Application, @Param("roleId") roleId: string, @Body() req: RoleDto) {
        try {
            return ResponseDto.Success(await this.auth.updateRole(app, roleId, req));
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Delete(":roleId")
    @UseGuards(new AuthorizeForOrg('REMOVE_APPLICATION_ROLE'))
    @ApiOperation({summary: 'Remove an organizational role'})
    public async removeRole(@Headers("app") app: Application, @Param("roleId") roleId: string) {
        await this.auth.removeRole(app, roleId);
        return ResponseDto.Success(void 0);
    }
}
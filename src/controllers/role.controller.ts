import { Controller, Get, UseGuards, Headers, Param, Res, Put, Head, Body, Delete, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ResponseDto } from "src/dtos/response.dto";
import { RoleDto } from "src/dtos/role.dto";
import { Organization } from "src/entities/organization.entity";
import { Role } from "src/entities/role.entity";
import { Authorization } from "src/lib/Authorization";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller('v1/organization/:id/role')
@ApiBearerAuth()
export class RoleController {

    constructor(private readonly auth: Authorization) {}

    @Get()
    @UseGuards(new AuthorizeForOrg('VIEW_ROLE'))
    @ApiOperation({summary: 'View organization roles'})
    public async getRoles(@Headers("org") org: Organization) {
        return ResponseDto.Success(await this.auth.getRoles(org));
    }

    @Post()
    @UseGuards(new AuthorizeForOrg('ADD_ROLE'))
    @ApiOperation({summary: 'Create a new role'})
    public async createRole(@Headers("org") org: Organization, @Body() req: RoleDto) {
        return await this.auth.createRole(org, req);
    }

    @Get(":roleId")
    @UseGuards(new AuthorizeForOrg('VIEW_ROLE'))
    @ApiOperation({summary: 'View role details'})
    public async getRole(@Headers("org") org: Organization, @Param("roleId") roleId: string) {
        return ResponseDto.Success(await this.auth.getRole(org, roleId));
    }

    @Put(":roleId")
    @UseGuards(new AuthorizeForOrg('EDIT_ROLE'))
    @ApiOperation({summary: 'Edit organizational role'})
    public async editRole(@Headers("org") org: Organization, @Param("roleId") roleId: string, @Body() req: RoleDto) {
        try {
            return ResponseDto.Success(await this.auth.updateRole(org, roleId, req));
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Delete(":roleId")
    @UseGuards(new AuthorizeForOrg('REMOVE_ROLE'))
    @ApiOperation({summary: 'Remove an organizational role'})
    public async removeRole(@Headers("org") org: Organization, @Param("roleId") roleId: string) {
        await this.auth.removeRole(org, roleId);
        return ResponseDto.Success(void 0);
    }
}
import { Controller, Get, UseGuards, Headers, Param, Res, Put, Head, Body, Delete, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ResponseDto } from "src/dtos/response.dto";
import { RoleDto } from "src/dtos/role.dto";
import { Organization } from "src/entities/organization.entity";
import { Role } from "src/entities/role.entity";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller('v1/organization/:id/role')
@ApiBearerAuth()
export class RoleController {
    @Get()
    @UseGuards(new AuthorizeForOrg('VIEW_ROLE'))
    @ApiOperation({summary: 'View organization roles'})
    public async getRoles(@Headers("org") org: Organization) {
        return ResponseDto.Success(await org.getRoles());
    }

    @Post()
    @UseGuards(new AuthorizeForOrg('ADD_ROLE'))
    @ApiOperation({summary: 'Create a new role'})
    public async createRole(@Headers("org") org: Organization, @Body() req: RoleDto) {
        return await org.createRole(req);
    }

    @Get(":roleId")
    @UseGuards(new AuthorizeForOrg('VIEW_ROLE'))
    @ApiOperation({summary: 'View role details'})
    public async getRole(@Headers("org") org: Organization, @Param("roleId") roleId: string) {
        return ResponseDto.Success(await org.getRole(roleId));
    }

    @Put(":roleId")
    @UseGuards(new AuthorizeForOrg('EDIT_ROLE'))
    @ApiOperation({summary: 'Edit organizational role'})
    public async editRole(@Headers("org") org: Organization, @Param("roleId") roleId: string, @Body() req: RoleDto) {
        try {
            const role = await org.getRole(roleId);
            return await role.updateFromDto(req);
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Delete(":roleId")
    @UseGuards(new AuthorizeForOrg('REMOVE_ROLE'))
    @ApiOperation({summary: 'Remove an organizational role'})
    public async removeRole(@Headers("org") org: Organization, @Param("roleId") roleId: string) {
        await org.removeRole(roleId);
        return ResponseDto.Success(void 0);
    }
}
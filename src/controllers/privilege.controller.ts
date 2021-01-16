import { Controller, Delete, Get, Post, Put, UseGuards, Headers, Param, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Organization } from "src/entities/organization.entity";
import { Authorization } from "src/lib/Authorization";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller("v1/organization/:id/privilege")
@ApiBearerAuth()
export class PrivilegeController {
    
    constructor(private readonly auth: Authorization) {}

    @Get()
    @UseGuards(new AuthorizeForOrg('VIEW_PRIVILEGE'))
    @ApiOperation({summary: 'View organization privileges'})
    public async viewPrivileges(@Headers("org") org: Organization) {
        return ResponseDto.Success(await this.auth.getPrivileges(org));
    }

    @Post()
    @UseGuards(new AuthorizeForOrg('ADD_PRIVILEGE'))
    @ApiOperation({summary: 'Create a new privilege for the organization'})
    public async createPrivilege(@Headers("org") org: Organization, @Body() req: PrivilegeDto) {
        try {
            
            return await this.auth.addPrivilege(org, req);
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Put(":privilegeId")
    @UseGuards(new AuthorizeForOrg('EDIT_PRIVILEGE'))
    @ApiOperation({summary: 'Edit a privilege'})
    public async updatePrivilege(@Headers("org") org: Organization, @Param("privilegeId") privilegeId: string, @Body() req: PrivilegeDto) {
        try {
            return ResponseDto.Success(await this.auth.updatePrivilege(org, privilegeId, req));
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Delete(":privilegeId")
    @UseGuards(new AuthorizeForOrg('REMOVE_PRIVILEGE'))
    @ApiOperation({summary: 'Remove a privilege'})
    public async removePrivilege(@Headers("org") org: Organization, @Param("privilegeId") privilegeId: string) {
        await this.auth.removePrivilege(org, privilegeId);
        return ResponseDto.Success(void 0);
    }
}
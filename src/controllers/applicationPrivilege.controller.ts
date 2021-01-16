import { Controller, Delete, Get, Post, Put, UseGuards, Headers, Param, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { Organization } from "src/entities/organization.entity";
import { Authorization } from "src/lib/Authorization";
import { AuthorizeForApp } from "src/lib/AuthorizeForApp.guard";

@Controller("v1/organization/:id/application/:appId/privilege")
@ApiBearerAuth()
export class ApplicationPrivilegeController {
    
    constructor(private readonly auth: Authorization) {}

    @Get()
    @UseGuards(new AuthorizeForApp('VIEW_APPLICATION_PRIVILEGE'))
    @ApiOperation({summary: 'View organization privileges'})
    public async viewPrivileges(@Headers("app") app: Application) {
        return ResponseDto.Success(await this.auth.getPrivileges(app));
    }

    @Post()
    @UseGuards(new AuthorizeForApp('ADD_APPLICATION_PRIVILEGE'))
    @ApiOperation({summary: 'Create a new privilege for the organization'})
    public async createPrivilege(@Headers("app") app: Application, @Body() req: PrivilegeDto) {
        try {
            
            return await this.auth.addPrivilege(app, req);
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Put(":privilegeId")
    @UseGuards(new AuthorizeForApp('EDIT_APPLICATION_PRIVILEGE'))
    @ApiOperation({summary: 'Edit a privilege'})
    public async updatePrivilege(@Headers("app") app: Application, @Param("privilegeId") privilegeId: string, @Body() req: PrivilegeDto) {
        try {
            return ResponseDto.Success(await this.auth.updatePrivilege(app, privilegeId, req));
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Delete(":privilegeId")
    @UseGuards(new AuthorizeForApp('REMOVE_APPLICATION_PRIVILEGE'))
    @ApiOperation({summary: 'Remove a privilege'})
    public async removePrivilege(@Headers("app") app: Application, @Param("privilegeId") privilegeId: string) {
        await this.auth.removePrivilege(app, privilegeId);
        return ResponseDto.Success(void 0);
    }
}
import { Body, Controller, Post, UseGuards, Headers, Get, Delete, Param} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApplicationDto } from "src/dtos/application.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { Organization } from "src/entities/organization.entity";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";


@Controller("v1/organization/:id/application")
@ApiBearerAuth()
export class ApplicationController {
    @Post()
    @UseGuards(new AuthorizeForOrg('ADD_APPLICATION'))
    @ApiOperation({summary: 'Create an application within an organization'})
    public async createApp(@Headers("org") org: Organization, @Body() req: ApplicationDto) {
        return ResponseDto.Success(await Application.createFromDTO(org, req));
    }

    @Get()
    @UseGuards(new AuthorizeForOrg('VIEW_APPLICATION'))
    @ApiOperation({summary: 'View applications within an organization'})
    public async getApps(@Headers("org") org: Organization) {
        return ResponseDto.Success(await org.getApplications());
    }

    @Get(":appId")
    @UseGuards(new AuthorizeForOrg('VIEW_APPLICATION'))
    @ApiOperation({summary: 'View an applications details'})
    public async getApp(@Param("appId") appId: string) {
        return ResponseDto.Success(await Application.findOneOrFail(appId));
    }

    @Delete(":appId")
    @UseGuards(new AuthorizeForOrg('REMOVE_APPLICATION'))
    @ApiOperation({summary: 'Remove application from organization'})
    public async removeApp(@Headers("org") org: Organization, @Param("appId") appId: string) {
        return ResponseDto.Success(await org.removeApplication(appId));
    }
}
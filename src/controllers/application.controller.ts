import { Body, Controller, Post, UseGuards, Headers, Get, Delete, Param, Put, Res} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApplicationDto } from "src/dtos/application.dto";
import { AuthorizationRequest } from "src/dtos/authorization.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { AppToken } from "src/entities/appToken.entity";
import { Organization } from "src/entities/organization.entity";
import { RequestLog } from "src/entities/requestLog.entity";
import { User } from "src/entities/user.entity";
import { Authenticate, AuthenticateAppToken } from "src/lib/Authentication.guard";
import { Authorization } from "src/lib/Authorization";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";


@Controller("v1/organization/:id/application")
@ApiBearerAuth()
export class ApplicationController {

    constructor(private readonly auth: Authorization) {}

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
    public async getApp(@Headers("app") app: Application) {
        return ResponseDto.Success(app);
    }

    @Get(":appId/name")
    @ApiOperation({summary: 'View an applications name'})
    public async getAppName(@Headers("app") app: Application) {
        console.log(app);
        return ResponseDto.Success(app.name);
    }

    @Put(":appId")
    @UseGuards(new AuthorizeForOrg('EDIT_APPLICATION'))
    @ApiOperation({summary: 'Update an appliations details'})
    public async updateApp(@Headers("app") app: Application, @Body() req: ApplicationDto) {
        try {
            await app.updateFromDTO(req);
            return ResponseDto.Success(app);
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Delete(":appId")
    @UseGuards(new AuthorizeForOrg('REMOVE_APPLICATION'))
    @ApiOperation({summary: 'Remove application from organization'})
    public async removeApp(@Headers("org") org: Organization, @Param("appId") appId: string) {
        try {
            return ResponseDto.Success(await org.removeApplication(appId));
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Post(':appId/authenticate')
    @UseGuards(AuthenticateAppToken)
    @ApiOperation({summary: 'Authenticate an app token for an application'})
    public async authenticateAppToken(@Headers("app") app: Application, @Headers('apptoken') appToken: AppToken, @Headers('reqiest') requestLog: RequestLog) {
        if (appToken.application.id === app.id) {
            return ResponseDto.Success(void 0);
        } else {
            await RequestLog.block(requestLog.id, `Attempted to access application id: ${app.id} with token that was assigend to application id: ${appToken.application.id}`);
            return ResponseDto.Error("Failed to authenticate");
        }
    }

    @Post(":appId/authorize")
    @UseGuards(Authenticate)
    @ApiOperation({summary: 'Perform an authorization check for the authenticated user'})
    public async performAuthCheck(@Headers("user") user: User, @Headers("app") app: Application, @Body() req?: AuthorizationRequest) {

        if (!req.privilege && !req.privileges) {
            return ResponseDto.Error('privilege or privileges parameter is required');
        }

        console.log(req.privileges);

        return ResponseDto.Success(await this.auth.authorize(app, user, req.privileges ? req.privileges : [req.privilege]));
    } 
}
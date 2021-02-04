import { Body, Controller, Delete, Get, Head, Headers, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AuthorizationRequest } from "src/dtos/authorization.dto";
import { AddUserDto, OrganizationDto } from "src/dtos/organization.dto";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Organization } from "src/entities/organization.entity";
import { User } from "src/entities/user.entity";
import { Authorization } from "src/lib/Authorization";
import { AuthenticateUser } from "src/lib/Authentication.guard";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller("v1/organization")
@ApiBearerAuth()
export class OrganizationController {

    constructor(private readonly auth: Authorization) {}

    @Post()
    @UseGuards(AuthenticateUser)
    @ApiOperation({summary: 'Create a new organization'})
    public async createOrganization(@Headers("user") user: User, @Body() req: OrganizationDto) {
        return ResponseDto.Success(await Organization.createFromDTO(user, req));
    }

    @Get(":id/name")
    @ApiOperation({summary: 'Get an organization name and no details'})
    public async getOrganizationName(@Headers("org") org: Organization) {
        return ResponseDto.Success(org.name);
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
    @UseGuards(AuthenticateUser)
    @ApiOperation({summary: 'Get organizations that you are the owner of or belong to'})
    public async getOwnedOrganizations(@Headers("user") user: User) {
        return ResponseDto.Success(await user.getAssociatedOrganizations());
    }

    @Post(":id/authorize")
    @UseGuards(AuthenticateUser)
    @ApiOperation({summary: 'Perform an authorization check for the authenticated user'})
    public async performAuthCheck(@Headers("user") user: User, @Headers("org") org: Organization, @Body() req?: AuthorizationRequest) {

        if (!req.privilege && !req.privileges) {
            return ResponseDto.Error('privilege or privileges parameter is required');
        }

        return ResponseDto.Success(await this.auth.authorize(org, user, req.privileges ? req.privileges : [req.privilege]));
    } 
}
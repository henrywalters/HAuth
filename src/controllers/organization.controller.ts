import { Body, Controller, Delete, Get, Head, Headers, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AddUserDto, OrganizationDto } from "src/dtos/organization.dto";
import { PrivilegeDto } from "src/dtos/privilege.dto";
import { ResponseDto } from "src/dtos/response.dto";
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

    
    
    
}
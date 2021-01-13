import { Controller, Get, UseGuards, Headers, Body, Delete, Post, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AddUserDto } from "src/dtos/organization.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Organization } from "src/entities/organization.entity";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";

@Controller("v1/organization/:id/user")
@ApiBearerAuth()
export class UserController {
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
}
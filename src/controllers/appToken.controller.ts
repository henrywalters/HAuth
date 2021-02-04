import { Body, Controller, Post, UseGuards, Headers, Get, Delete, Param, Put, Res} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApplicationDto } from "src/dtos/application.dto";
import { AppTokenDto } from "src/dtos/appToken.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { AppToken } from "src/entities/appToken.entity";
import { Organization } from "src/entities/organization.entity";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";


@Controller("v1/organization/:id/application/:appId/token")
@ApiBearerAuth()
export class AppTokenController {
    @Post()
    @UseGuards(new AuthorizeForOrg('ADD_APPLICATION_TOKEN'))
    @ApiOperation({summary: 'Create an app token'})
    public async createApp(@Headers("app") app: Application, @Body() req: AppTokenDto) {
        const token = await app.createAppToken(req);
        return ResponseDto.Success(token);
    }

    @Get()
    @UseGuards(new AuthorizeForOrg('VIEW_APPLICATION_TOKEN'))
    @ApiOperation({summary: 'View app tokens for an application'})
    public async getApps(@Headers("app") app: Application) {
        return ResponseDto.Success(await app.getTokens());
    }

    @Put(":tokenId")
    @UseGuards(new AuthorizeForOrg('EDIT_APPLICATION_TOKEN'))
    @ApiOperation({summary: 'Update an app tokens details'})
    public async updateApp(@Headers("app") app: Application, @Body() req: AppTokenDto, @Param('tokenId') tokenId: string) {
        try {
            const token = await app.getToken(tokenId);
            await token.updateFromDTO(req);
            return ResponseDto.Success(token);
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }

    @Delete(":tokenId")
    @UseGuards(new AuthorizeForOrg('REMOVE_APPLICATION_TOKEN'))
    @ApiOperation({summary: 'Remove application from organization'})
    public async removeApp(@Headers("app") app: Application, @Param('tokenId') tokenId: string) {
        try {
            const token = await app.getToken(tokenId);
            await token.remove();
            return ResponseDto.Success(void 0);
        } catch (e) {
            return ResponseDto.Error(e.message);
        }
    }
}
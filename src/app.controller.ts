import { Body, Controller, Get, Headers, Post, Query, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RefreshDto, StandardLoginDto, StandardRegisterDto } from './dtos/authentication.dto';
import { ResponseDto } from './dtos/response.dto';
import { User } from './entities/user.entity';
import { Authentication, TokenType } from './lib/Authentication';
import { Authorize } from './lib/Authorization.guard';
import Language from './lib/Language';
import Crypto from "./utilities/crypto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authentication: Authentication) {}

  @Get("login")
  @Render('index')
  getLogin() {
    return { clientId: process.env.GOOGLE_CLIENT_ID };
  }

  @Get("version")
  getVersion() {
    return {
      version: "0.0.1",
    }
  }

  @Get('self')
  @UseGuards(Authorize)
  public async getSelf(@Headers("user") user: User) {
    return ResponseDto.Success(user);
  }

  @Post('login')
  public async postLogin(@Body() req: StandardLoginDto) {
    const res = await this.authentication.verifyStandardUser(req);
    if (!res.success) return res;
    return ResponseDto.Success({
      'accessToken': await Authentication.generateAccessToken(res.result),
      'refreshToken': await Authentication.generateRefreshToken(res.result),
    })
  }

  @Post('refresh')
  public async postRefresh(@Body() req: RefreshDto) {
    try {
      const decoded = await Authentication.validateToken(req.refreshToken);
      if (decoded.type !== TokenType.REFRESH_TOKEN) {
        console.warn("Tried to refresh token with access token");
        throw new Error();
      }
      return ResponseDto.Success({
        'accessToken': await Authentication.generateAccessToken(decoded.user),
        'refreshToken': await Authentication.generateRefreshToken(decoded.user),
      });
    } catch (e) {
      return ResponseDto.Error(Language.FAILED_REFRESH);
    }
  }

  @Post('register')
  public async postRegister(@Body() req: StandardRegisterDto) {
    return await this.authentication.createStandardUser(req);
  }
}

import { Body, Controller, Get, Headers, Post, Query, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service';
import { GoogleLoginDto, RefreshDto, StandardLoginDto, StandardRegisterDto } from './dtos/authentication.dto';
import { ResponseDto } from './dtos/response.dto';
import { AppToken } from './entities/appToken.entity';
import { User } from './entities/user.entity';
import { UserSession } from './entities/userSession.entity';
import { Authentication, TokenType } from './lib/Authentication';
import { Authenticate, AuthenticateUser } from './lib/Authentication.guard';
import Language from './lib/Language';

@Controller("v1")
export class AppController {
  constructor(private readonly appService: AppService, private readonly authentication: Authentication) {}

  @Get("login")
  @Render('login')
  @ApiOperation({summary: 'Access the universal login-page'})
  getLogin() {
    return { clientId: process.env.GOOGLE_CLIENT_ID };
  }

  @Get("register")
  @Render('register')
  @ApiOperation({summary: 'Access the universal register page'})
  getRegister() {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID,
    }
  }

  @Get("version")
  @ApiOperation({summary: 'Return the current API version'})
  getVersion() {
    return {
      version: "1.0.0",
    }
  }

  @Get('self')
  @UseGuards(Authenticate)
  @ApiOperation({summary: 'Return the details of the current authenticated user'})
  public async getSelf(@Headers("user") user: User, @Headers('apptoken') appToken: AppToken, @Headers() req: Request) {
    console.log("Getting self");
    return ResponseDto.Success(user ? user.cleaned() : appToken.cleaned());
  }

  @Post('login')
  @ApiOperation({summary: 'Login using the standard email / password method. Returns an access token & refresh token'})
  public async postLogin(@Body() req: StandardLoginDto) {
    const res = await this.authentication.verifyStandardUser(req);
    if (!res.success) return res;
    await UserSession.createUserSession(res.result);
    return ResponseDto.Success(await Authentication.generateTokenSet(res.result));
  }

  @Post('logout')
  @UseGuards(AuthenticateUser)
  @ApiOperation({summary: 'Logout of the current user and destroy their session. Requires a new login accross devices'})
  public async logout(@Headers("user") user: User) {
    const session = await UserSession.getCurrentSession(user);
    if (session) {
      await session.endSession();
    }
  }

  @Post('login-google')
  @ApiOperation({summary: 'Login using google identity token'})
  public async postGoogleLogin(@Body() req: GoogleLoginDto) {
    try {
      const res = await this.authentication.verifyGoogleUser(req);
      if (!res.success) return res;
      await UserSession.createUserSession(res.result);
      return ResponseDto.Success(await Authentication.generateTokenSet(res.result));
    } catch (e) {
      return ResponseDto.Error(e.message);
    }
  }

  @Post('register-google')
  @ApiOperation({summary: 'Register using google identity token'})
  public async postGoogleRegister(@Body() req: GoogleLoginDto) {
    try {
      const res = await this.authentication.createGoogleUser(req);
      if (!res.success) {return res;}
      return ResponseDto.Success(res);
    } catch (e) {
      return ResponseDto.Error(e.message);
    }
  }

  @Post('refresh')
  @ApiOperation({summary: 'Refresh an access token using a refresh token'})
  public async postRefresh(@Body() req: RefreshDto) {
    try {
      const decoded = await Authentication.validateToken(req.refreshToken);
      const session = await UserSession.getCurrentSession(decoded.user);
      if (!session) {
        throw new Error();
      }
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
  @ApiOperation({summary: 'Register a new user using the standard email / password method.'})
  public async postRegister(@Body() req: StandardRegisterDto) {
    return await this.authentication.createStandardUser(req);
  }
}

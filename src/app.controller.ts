import { Body, Controller, Get, Headers, Post, Query, Render, Res, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GoogleLoginDto, RefreshDto, StandardLoginDto, StandardRegisterDto } from './dtos/authentication.dto';
import { ResponseDto } from './dtos/response.dto';
import { User } from './entities/user.entity';
import { Authentication, TokenType } from './lib/Authentication';
import { Authorize } from './lib/Authorization.guard';
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
  @UseGuards(Authorize)
  @ApiOperation({summary: 'Return the details of the current authenticated user'})
  public async getSelf(@Headers("user") user: User) {
    return ResponseDto.Success(user);
  }

  @Post('login')
  @ApiOperation({summary: 'Login using the standard email / password method. Returns an access token & refresh token'})
  public async postLogin(@Body() req: StandardLoginDto) {
    const res = await this.authentication.verifyStandardUser(req);
    if (!res.success) return res;
    return ResponseDto.Success(await Authentication.generateTokenSet(res.result));
  }

  @Post('login-google')
  @ApiOperation({summary: 'Login using google identity token'})
  public async postGoogleLogin(@Body() req: GoogleLoginDto) {
    try {
      const res = await this.authentication.verifyGoogleUser(req);
      if (!res.success) return res;
      return ResponseDto.Success(await Authentication.generateTokenSet(res.result));
    } catch (e) {
      console.log(e);
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

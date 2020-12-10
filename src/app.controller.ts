import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Authentication } from './lib/Authentication';
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

  @Post('login')
  public async postLogin(@Body() req: any) {
    const verified = await this.authentication.verifyGoogleIdToken(req.idtoken);
  }

  @Get('random')
  public async getRandom(@Query('size') size?: string, format: BufferEncoding = 'hex') {
    return (await Crypto.randomBuffer(size ? parseInt(size) : 48)).toString(format);
  }

  @Get('hash')
  public async getHash(@Query('string') str?: string, format: BufferEncoding = 'hex') {
    return (Crypto.hash(Buffer.from(str, 'utf-8')).toString(format));
  }

  @Get('compare')
  public async compare(@Query('a') a: string, @Query('b') b: string) {
    return Crypto.compare(Crypto.hash(Crypto.getBufferFromText(a)), Crypto.getBufferFromEncoded(b));
  }
}

import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return { message: "Hello World"};
  }

  @Get("version")
  getVersion() {
    return {
      version: "0.0.1",
    }
  }

  @Post('login')
  public async postLogin(@Body() req: any) {
    console.log(req);
  }
}

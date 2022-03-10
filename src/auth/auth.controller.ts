import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponse } from 'src/app.dto';
import { LoginUserDto, SignupUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupRequest: SignupUserDto) {
    const response: BaseResponse = {
      data: await this.authService.createUser(signupRequest),
      message: 'success',
      status: 201,
    };
    return response;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const response: BaseResponse = {
      data: await this.authService.login(loginUserDto),
      message: 'success',
      status: 201,
    };
    return response;
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh-token')
  async refreshToken(@Request() req) {
    const response: BaseResponse = {
      data: await this.authService.refreshToken(req.user['uid']),
      message: 'success',
      status: 201,
    };
    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Request() req) {
    this.authService.logout(req.user.uid);
    const response: BaseResponse = {
      data: {},
      message: 'logged out',
      status: 201,
    };
    return response;
  }
}

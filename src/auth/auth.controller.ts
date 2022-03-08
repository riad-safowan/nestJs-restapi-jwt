import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto, SignupUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupRequest: SignupUserDto) {
    return this.authService.createUser(signupRequest);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('hello')
  getHello(@Request() req) {
    return req.user.email;
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refreshtoken')
  refreshToken() {
    return ' ';
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Request() req) {
    this.authService.logout(req.user.id);
  }
}

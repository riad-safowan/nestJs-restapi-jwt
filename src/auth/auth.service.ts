import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto, SignupUserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { type } from 'os';
import { TokenModel } from './auth.dto';
import { getProfileImageUrl } from 'src/user/user.service';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(payload: SignupUserDto): Promise<User> {
    if (await this.isUserExist(payload.email)) {
      throw new BadRequestException('Email is occupied');
    }
    if (payload.password.length < 6) {
      throw new BadRequestException('Password is too short');
    }
    if (payload.first_name.trim().length == 0) {
      throw new BadRequestException('Name is too short');
    }
    if (payload.user_type != 'ADMIN' && payload.user_type != 'USER') {
      throw new BadRequestException('User type is not defined');
    }

    const newUser = new User();
    newUser.first_name = payload.first_name;
    newUser.last_name = payload.last_name;
    newUser.email = payload.email;
    newUser.user_type = payload.user_type;

    const hashedPassword = await bcrypt.hash(payload.password, 8);
    newUser.password = hashedPassword;

    const user = await this.userRepository.save(newUser);

    const token = await this.generateToken(user);

    newUser.access_token = token.access_token;
    newUser.refresh_token = token.refresh_token;
    newUser.image_url = getProfileImageUrl(newUser.image_url);

    return newUser;
  }

  async login(payload: LoginUserDto): Promise<User> {
    let user = await this.userRepository.findOne({ email: payload.email });
    if (!user || !(await bcrypt.compare(payload.password, user.password))) {
      throw new BadRequestException('invalid email or password');
    }

    const token = await this.generateToken(user);
    user.access_token = token.access_token;
    user.refresh_token = token.refresh_token;
    user = await this.userRepository.save(user);
    user.image_url = getProfileImageUrl(user.image_url);
    return user;
  }

  async refreshToken(userId: number): Promise<TokenModel> {
    const user = await this.userRepository.findOne(userId);
    const token = await this.generateToken(user);
    user.refresh_token = token.refresh_token;
    await this.userRepository.save(user);
    return token;
  }

  async logout(uid: number) {
    const user = await this.userRepository.findOne(uid);
    user.refresh_token = null;
    return await this.userRepository.save(user);
  }

  async isUserExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email: email });
    if (!user) return false;
    else return true;
  }

  async generateToken(user: User): Promise<TokenModel> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          uid: user.id,
          first_name: user.first_name,
          email: user.email,
          token_type: 'ACCESS_TOKEN',
        },
        {
          expiresIn: '10h',
          secret: 'RIAD',
        },
      ),
      this.jwtService.signAsync(
        {
          uid: user.id,
          first_name: user.first_name,
          email: user.email,
          token_type: 'REFRESH_TOKEN',
        },
        {
          expiresIn: '7d',
          secret: 'SAFOWAN',
        },
      ),
    ]);
    return { access_token: access_token, refresh_token: refresh_token };
  }
}

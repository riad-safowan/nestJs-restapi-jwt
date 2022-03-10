import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BASE_URL } from 'src/const';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable({})
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // async getAllUser(): Promise<User[]> {
  //   return this.userRepository.find();
  // }

  async getOneById(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail(id);
  }

  // createUser(name: string): Promise<User> {
  //   const newUser = this.userRepository.create({ name: name });
  //   return this.userRepository.save(newUser);
  // }

  // async deleteUser(id: string): Promise<User> {
  //   const user = await this.getOneById(id);
  //   await this.userRepository.remove(user);
  //   return user;
  // }
  async updateUserImageUrl(id: number, filePath: string): Promise<User> {
    let user = await this.userRepository.findOneOrFail(id);
    user.image_url = filePath;
    user = await this.userRepository.save(user);
    user.image_url = getProfileImageUrl(user.image_url);
    return user;
  }
}

export function getProfileImageUrl(name: string): string {
  if (name) {
    return BASE_URL + '/user/profile-image/' + name;
  } else return null;
}

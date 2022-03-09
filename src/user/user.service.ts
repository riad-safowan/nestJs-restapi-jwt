import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getOneById(id: string): Promise<User> {
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
}

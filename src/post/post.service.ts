import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './post.entity';

@Injectable({})
export class PostService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
  ) {}

  async createPost(uid: number, text: string): Promise<Posts> {
    const post = new Posts();
    post.text = text;
    post.user_id = uid;
    return await this.postRepository.save(post);
  }

  async getAllPost(): Promise<Posts[]> {
    return await this.postRepository.find();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable({})
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(uid: number, text: string): Promise<Post> {
    const post = new Post();
    post.text = text;
    post.user_id = uid;
    return await this.postRepository.save(post);
  }
}

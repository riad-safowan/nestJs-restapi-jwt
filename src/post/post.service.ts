import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { retry } from 'rxjs';
import { BASE_URL } from 'src/const';
import { Repository } from 'typeorm';
import { Comments, Likes, Posts } from './post.entity';

@Injectable({})
export class PostService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
    @InjectRepository(Likes) private readonly likeRepository: Repository<Likes>,
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
  ) {}

  async createPost(uid: number, text: string): Promise<Posts> {
    const post = new Posts();
    post.text = text;
    post.user_id = uid;
    return await this.postRepository.save(post);
  }

  async updatePostImageUrl(id: number, filePath: string) {
    let post = await this.postRepository.findOne(id);
    post.image_url = filePath;
    post = await this.postRepository.save(post);
    post.image_url = getPostImageUrl(post.image_url);
    return post;
  }

  async getAllPost(): Promise<Posts[]> {
    return await this.postRepository.find();
  }

  async likePost(userid: number, postid: number): Promise<boolean> {
    let result = await this.likeRepository.findOne({
      where: { user_id: userid, post_id: postid },
    });

    if (!result) {
      this.likeRepository.save({
        user_id: userid,
        post_id: postid,
        is_liked: true,
      });
      const post = await this.postRepository.findOne({ id: postid });
      post.likes = post.likes + 1;
      this.postRepository.save(post);
      return true;
    } else {
      result.is_liked = !result.is_liked;
      this.likeRepository.save(result);
      if (result.is_liked) {
        const post = await this.postRepository.findOne({ id: postid });
        post.likes = post.likes + 1;
        this.postRepository.save(post);
        return true;
      } else {
        const post = await this.postRepository.findOne({ id: postid });
        post.likes = post.likes - 1;
        this.postRepository.save(post);
        return false;
      }
    }
  }

  async isLiked(userid: number, postid: number): Promise<boolean> {
    let isLiked = false;
    let result = await this.likeRepository.findOne({
      where: { user_id: userid, post_id: postid },
    });
    if (result) {
      isLiked = result.is_liked;
    }
    return isLiked;
  }
  async addAComment(
    userid: number,
    postid: number,
    text: string,
  ): Promise<string> {
    this.commentRepository.save({
      user_id: userid,
      post_id: postid,
      text: text,
    });
    const post = await this.postRepository.findOne({ id: postid });
    post.comments = post.comments + 1;
    this.postRepository.save(post);
    return text;
  }
}

export function getPostImageUrl(path: string): string {
  if (path) {
    return BASE_URL + '/post`/post-image/' + path;
  } else return null;
}

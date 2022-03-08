import { Controller, Get, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('postid')
  addLike() {
    return 'a new Like added';
  }
  @Post('postid')
  updateLike() {
    return 'a new Like updated';
  }
  @Post('postid')
  deleteLike() {
    return 'a new Like deleted';
  }

  @Get('getall')
  getAllLikes() {
    return 'all Likes';
  }

  @Get('Likeid')
  getLikeById() {
    return 'Like by id';
  }

  @Get('postid')
  getLikesByPostId() {
    return 'Likes by postid';
  }
}

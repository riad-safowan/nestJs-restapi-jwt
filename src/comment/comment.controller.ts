import { Controller, Get, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('postid')
  addComment() {
    return 'a new comment added';
  }
  @Post('postid')
  updateComment() {
    return 'a new comment updated';
  }
  @Post('postid')
  deleteComment() {
    return 'a new comment deleted';
  }

  @Get('getall')
  getAllComment() {
    return 'all comments';
  }

  @Get('commentid')
  getCommentById() {
    return 'comment by id';
  }

  @Get('postid')
  getCommentByPostId() {
    return 'comments by postid';
  }
}

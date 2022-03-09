import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponse } from 'src/app.dto';
import { UserService } from 'src/user/user.service';
import { CreatePostResponse, PostRequest } from './post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createPost(@Request() req, @Body() postRequest: PostRequest) {
    const post = await this.postService.createPost(
      req.user['uid'],
      postRequest.text,
    );
    const user = await this.userService.getOneById(req.user.uid);
    const responseData: CreatePostResponse = await {
      ...post,
      user_name: user.first_name + ' ' + user.last_name,
      user_image_url: user.image_url,
      is_liked: false,
    };
    const response: BaseResponse = {
      data: responseData,
      message: 'success',
      status: 201,
    };
    return response;
  }
}

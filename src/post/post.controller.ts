import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { use } from 'passport';
import { BaseResponse } from 'src/app.dto';
import { UserService } from 'src/user/user.service';
import { PostResponse, PostRequest } from './post.dto';
import { Posts } from './post.entity';
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
    const responseData: PostResponse = await {
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

  @UseGuards(AuthGuard('jwt'))
  @Get('get-all')
  async getAllPost(@Request() req) {
    const posts = await this.postService.getAllPost();

    const responsesData: PostResponse[] = [];

    for (const post of posts) {
      const user = await this.userService.getOneById(post.user_id);
      const name = user.first_name + ' ' + user.last_name;
      const is_liked = false;

      const responseData: PostResponse = {
        ...post,
        user_name: user.first_name + ' ' + user.last_name,
        user_image_url: user.image_url,
        is_liked: false,
      };

      responsesData.push(responseData);
    }

    const response: BaseResponse = {
      data: responsesData,
      message: 'success',
      status: 201,
    };
    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('like/:id')
  async likePost(@Request() req, @Param() params) {
    this.postService.likePost(req.user.uid as number, params.id as number);
    return;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('comment/:id')
  async addComment(
    @Request() req,
    @Param() params,
    @Body() payload: PostRequest,
  ) {
    this.postService.addAComment(
      req.user.uid as number,
      params.id as number,
      payload.text,
    );
    return;
  }
}

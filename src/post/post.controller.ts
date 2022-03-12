import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { of } from 'rxjs/internal/observable/of';
import { BaseResponse } from 'src/app.dto';
import { getProfileImageUrl, UserService } from 'src/user/user.service';
import { PostResponse, PostRequest } from './post.dto';
import { getPostImageUrl, PostService } from './post.service';

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
    // const user = await this.userService.getOneById(req.user.uid);
    // const responseData: PostResponse = await {
    //   ...post,
    //   user_name: user.first_name + ' ' + user.last_name,
    //   user_image_url: user.image_url,
    //   is_liked: false,
    // };
    // const response: BaseResponse = {
    //   data: responseData,
    //   message: 'success',
    //   status: 201,
    // };
    const user = await this.userService.getOneById(post.user_id);
    const name = user.first_name + ' ' + user.last_name;
    const postResponse: PostResponse = {
      ...post,
      image_url: getPostImageUrl(post.image_url),
      user_name: name,
      user_image_url: getProfileImageUrl(user.image_url),
      is_liked: false,
    };
    const response: BaseResponse = {
      data: postResponse,
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

      const responseData: PostResponse = {
        ...post,
        image_url: getPostImageUrl(post.image_url),
        user_name: name,
        user_image_url: getProfileImageUrl(user.image_url),
        is_liked: await this.postService.isLiked(
          req.user.uid as number,
          post.id,
        ),
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
    const isLiked = await this.postService.likePost(
      req.user.uid as number,
      params.id as number,
    );
    const response: BaseResponse = {
      data: { isLiked: isLiked },
      message: 'success',
      status: 201,
    };
    return response;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('comment/:id')
  async addComment(
    @Request() req,
    @Param() params,
    @Body() payload: PostRequest,
  ) {
    await this.postService.addAComment(
      req.user.uid as number,
      params.id as number,
      payload.text,
    );
    return await this.getCommentsByPostId(params);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('comments/:id')
  async getCommentsByPostId(@Param() params) {
    const response: BaseResponse = {
      data: await this.postService.getCommentsByPostId(params.id as number),
      message: 'success',
      status: 201,
    };
    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-image/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './image_server/post_image',
        filename: (req, file, cd) => {
          cd(null, (req.params['id'] as string) + '.jpg');
        },
      }),
    }),
  )
  async uploadPostImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    const filePath = file.path.replace('image_server\\post_image\\', '');
    const post = await this.postService.updatePostImageUrl(id, filePath);
    const user = await this.userService.getOneById(post.user_id);
    const name = user.first_name + ' ' + user.last_name;
    const postResponse: PostResponse = {
      ...post,
      image_url: getPostImageUrl(post.image_url),
      user_name: name,
      user_image_url: getProfileImageUrl(user.image_url),
      is_liked: false,
    };
    const response: BaseResponse = {
      data: postResponse,
      message: 'success',
      status: 201,
    };
    return response;
  }

  @Get('post-image/:name')
  getPostImage(@Param('name') name, @Res() res) {
    return of(
      res.sendFile(join(process.cwd(), './image_server/post_image/' + name)),
    );
  }
}

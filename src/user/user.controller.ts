import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Param,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { of } from 'rxjs/internal/observable/of';
import { BaseResponse } from 'src/app.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './image-server/profile-image',
        filename: (req, file, cd) => {
          cd(null, (req.user['uid'] as string) + '.jpg');
        },
      }),
    }),
  )
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const filePath = file.path.replace('image-server\\profile-image\\', '');

    const response: BaseResponse = {
      data: await this.userService.updateUserImageUrl(req.user.uid, filePath),
      message: 'success',
      status: 201,
    };
    return response;
  }

  @Get('profile-image/:name')
  getProfileImage(@Param('name') name, @Res() res) {
    return of(
      res.sendFile(join(process.cwd(), './image-server/profile-image/' + name)),
    );
  }
}

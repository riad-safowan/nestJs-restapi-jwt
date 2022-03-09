import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PostController } from './post.controller';
import { Posts, Likes, Comments } from './post.entity';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Likes, Comments]), UserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

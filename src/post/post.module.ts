import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PostController } from './post.controller';
import { Posts } from './post.entity';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), UserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}

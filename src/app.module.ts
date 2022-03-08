import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/auth.module';
import { Post } from './post/post.entity';
import { Comment } from './comment/comment.entity';
import { Like } from './like/like.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    LikeModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'nest',
      entities: [User, Post, Comment, Like],
      synchronize: true,
    }),
  ],
})
export class AppModule {}

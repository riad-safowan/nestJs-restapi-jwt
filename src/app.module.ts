import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { Likes, Posts, Comments } from './post/post.entity';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'nest',
      entities: [User, Posts, Comments, Likes],
      synchronize: true,
    }),
  ],
})
export class AppModule {}

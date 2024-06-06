import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { UserModule } from 'src/user/user.module';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule, PostsModule, AuthModule],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}

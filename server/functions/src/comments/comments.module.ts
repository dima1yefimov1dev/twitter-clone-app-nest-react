import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PostsModule } from 'src/posts/posts.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PostsModule, UserModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}

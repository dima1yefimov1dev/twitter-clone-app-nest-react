import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { UserService } from './user/user.service';
import { FirebaseAuthService } from './firebase/services/firebase.auth.service';
import { FirebaseJwtStrategy } from './auth/strategies/firebase-jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LikesModule } from './likes/likes.module';
import { FirebaseModule } from './firebase/firebase.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    FirebaseModule,
    UserModule,
    PostsModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [PostsController],
  providers: [
    FirebaseJwtStrategy,
    FirebaseAuthService,
    UserService,
    PostsService,
  ],
})
export class AppModule {}

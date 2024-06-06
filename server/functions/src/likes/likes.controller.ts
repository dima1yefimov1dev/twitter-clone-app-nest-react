import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuardJwt } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current.user.decorator';
import { IUser } from 'src/lib/interfaces';

@Controller('likes')
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  @Patch(':postId')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  async toggleLikePost(
    @Param('postId') postId: string,
    @CurrentUser() user: IUser,
  ): Promise<void> {
    await this.likeService.toggleLikePost(postId, user.uid);
  }
}

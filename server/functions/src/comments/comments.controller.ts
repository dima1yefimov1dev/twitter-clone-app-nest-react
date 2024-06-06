import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuardJwt } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/current.user.decorator';
import { IComment, IUser } from 'src/lib/interfaces';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get(':postId')
  async getPostDetailsWithComments(@Param('postId') postId: string) {
    return await this.commentService.getDetailsForPost(postId);
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async createComment(
    @Body() input,
    @CurrentUser() user: IUser,
  ): Promise<IComment> {
    const { postId, body } = input;
    const userId = user.uid;

    return await this.commentService.createComment(body, userId, postId);
  }

  @Patch(':commentId')
  @UseGuards(AuthGuardJwt)
  async updateComment(
    @CurrentUser() user: IUser,
    @Body() input: any,
    @Param('commentId') commentId: string,
  ) {
    const { postId, body } = input;
    console.log(`here`, input);
    await this.commentService.updateComment(body, postId, commentId, user.uid);
  }

  @Delete(':postId')
  @UseGuards(AuthGuardJwt)
  async deleteComment(
    @CurrentUser() user: IUser,
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    const { commentId } = req.body;

    await this.commentService.deleteComment(commentId, postId, user.uid);
  }
}

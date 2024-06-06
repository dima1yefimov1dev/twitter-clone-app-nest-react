import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/guards/auth.guard';
import { CreatePostDto } from './dto/create.post.dto';
import { CurrentUser } from 'src/user/decorators/current.user.decorator';
import { PostsService } from './posts.service';
import { IUser } from 'src/lib/interfaces/';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('/')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.CREATED)
  async createNewPost(@Body() input: CreatePostDto, @CurrentUser() user) {
    const post = await this.postService.createPost(input, user);
    return post;
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllPosts() {
    return await this.postService.getAllPosts();
  }

  @Get(':uid')
  async getPostsByUser(@Param('uid') uid: string) {
    return await this.postService.getPostsByUser(uid);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @Param('id') id: string,
    @Body() input: Partial<CreatePostDto>,
    @CurrentUser() user,
  ) {
    return await this.postService.updatePost(input, id, user.uid);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(
    @Param('id') id: string,
    @CurrentUser() user: IUser,
  ): Promise<void> {
    await this.postService.deletePostById(id, user.uid);
  }
}

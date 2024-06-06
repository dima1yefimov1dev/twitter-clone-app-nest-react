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
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthGuardJwt } from 'src/auth/guards/auth.guard';
import { CurrentUser } from './decorators/current.user.decorator';
import { UpdateUserDto } from './dto/update.user.dto';
import { IUser } from 'src/lib/interfaces/';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<IUser[]> {
    return await this.userService.getAllUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@CurrentUser() user: IUser): Promise<IUser> {
    return user;
  }

  @Get(':uid')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('uid') uid: string): Promise<IUser> {
    return await this.userService.getUserByUid(uid);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async registration(
    @Body()
    input: {
      displayName: string;
      email: string;
      password: string;
      photoURL?: string;
    },
  ): Promise<IUser> {
    return await this.userService.registerUser(input);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { token: string }, @Res() res: Response) {
    const { token } = body;

    res.cookie('token', token, {
      maxAge: 30000000,
      expires: new Date(Date.now() + 30000000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.send(token);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuardJwt)
  async logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.send();
  }

  @Patch()
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  async updateUserProfile(
    @CurrentUser() user: IUser,
    @Body() input: UpdateUserDto,
  ): Promise<void> {
    await this.userService.updateUser(user.uid, input);
  }

  @Patch('password')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.OK)
  async changePassword(@Body() input, @CurrentUser() user): Promise<void> {
    const { newPassword } = input;
    return await this.userService.changePassword(newPassword, user.uid);
  }

  @Delete('delete')
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserAccount(
    @CurrentUser() user,
    @Res() res: Response,
  ): Promise<void> {
    await this.userService.deleteUser(user.uid);

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.send();
  }
}

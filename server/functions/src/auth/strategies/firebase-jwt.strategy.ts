import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { auth } from 'firebase-admin';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FirebaseJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        FirebaseJwtStrategy.extractJwtFromCookies,
      ]),
    });
  }

  async validate(token: string) {
    try {
      const validatedUserData = await auth().verifyIdToken(token, true);
      if (!validatedUserData) {
        throw new UnauthorizedException();
      }
      const user = await this.usersService.findOrCreateFromDbOrAuth(
        validatedUserData.sub,
      );
      return user;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  private static extractJwtFromCookies(req: Request) {
    let token = null;

    if (req && req.cookies) {
      token = req.cookies['token'];
    }
    return token;
  }
}

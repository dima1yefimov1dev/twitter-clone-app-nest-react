import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseJwtStrategy } from './strategies/firebase-jwt.strategy';

import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  providers: [FirebaseJwtStrategy],
})
export class AuthModule {}

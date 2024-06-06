import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './services/firebase.auth.service';
import { FirebaseStorageService } from './services/firebase.storage.service';

@Module({
  imports: [],
  providers: [FirebaseAuthService, FirebaseStorageService],
  exports: [FirebaseAuthService, FirebaseStorageService],
})
export class FirebaseModule {}

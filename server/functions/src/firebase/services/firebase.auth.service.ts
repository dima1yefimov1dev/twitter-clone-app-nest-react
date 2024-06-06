import { Injectable } from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
  private auth: Auth;

  constructor() {
    this.auth = admin.auth();
  }

  async createNewUser(email: string, password: string) {
    return await this.auth.createUser({ email, password });
  }

  async findUserByUid(uid: string) {
    return await this.auth.getUser(uid);
  }

  async verifyEmail(email: string) {
    return this.auth.generateEmailVerificationLink(email);
  }
}

import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update.user.dto';
import { IUser } from 'src/lib/interfaces';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.getAllUsers();
  }

  async getUserByUid(uid: string): Promise<IUser> {
    return await this.userRepository.getUserByUid(uid);
  }

  async registerUser(input: {
    displayName: string;
    email: string;
    password: string;
    photoURL?: string;
  }): Promise<IUser> {
    return await this.userRepository.createUser(input);
  }

  async findOrCreateFromDbOrAuth(uid: string): Promise<IUser> {
    return await this.userRepository.findOrCreate(uid);
  }

  async changePassword(newPassword: string, uid: string): Promise<void> {
    await this.userRepository.changePassword(newPassword, uid);
  }

  // TODO!
  async deleteUser(uid: string): Promise<void> {
    await this.userRepository.deleteUser(uid);
  }

  async updateUser(uid: string, input: UpdateUserDto): Promise<void> {
    await this.userRepository.updateUser(uid, input);
  }
}

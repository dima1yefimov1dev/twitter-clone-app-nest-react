import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update.user.dto';
import { IUser } from 'src/lib/interfaces';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    getAllUsers(): Promise<IUser[]>;
    getUserByUid(uid: string): Promise<IUser>;
    registerUser(input: {
        displayName: string;
        email: string;
        password: string;
        photoURL?: string;
    }): Promise<IUser>;
    findOrCreateFromDbOrAuth(uid: string): Promise<IUser>;
    changePassword(newPassword: string, uid: string): Promise<void>;
    deleteUser(uid: string): Promise<void>;
    updateUser(uid: string, input: UpdateUserDto): Promise<void>;
}

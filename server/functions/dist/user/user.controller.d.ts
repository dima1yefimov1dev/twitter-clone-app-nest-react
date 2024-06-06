import { UserService } from './user.service';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update.user.dto';
import { IUser } from 'src/lib/interfaces/';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<IUser[]>;
    getUserProfile(user: IUser): Promise<IUser>;
    getUser(uid: string): Promise<IUser>;
    registration(input: {
        displayName: string;
        email: string;
        password: string;
        photoURL?: string;
    }): Promise<IUser>;
    login(body: {
        token: string;
    }, res: Response): Promise<void>;
    logout(res: Response): Promise<void>;
    updateUserProfile(user: IUser, input: UpdateUserDto): Promise<void>;
    changePassword(input: any, user: any): Promise<void>;
    deleteUserAccount(user: any, res: Response): Promise<void>;
}

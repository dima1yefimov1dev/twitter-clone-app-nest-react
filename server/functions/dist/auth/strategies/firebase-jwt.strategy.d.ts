import { Strategy } from 'passport-firebase-jwt';
import { UserService } from 'src/user/user.service';
declare const FirebaseJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class FirebaseJwtStrategy extends FirebaseJwtStrategy_base {
    private readonly usersService;
    constructor(usersService: UserService);
    validate(token: string): Promise<import("../../lib/interfaces").IUser>;
    private static extractJwtFromCookies;
}
export {};

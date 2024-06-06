export declare class FirebaseAuthService {
    private auth;
    constructor();
    createNewUser(email: string, password: string): Promise<import("firebase-admin/auth").UserRecord>;
    findUserByUid(uid: string): Promise<import("firebase-admin/auth").UserRecord>;
    verifyEmail(email: string): Promise<string>;
}

import { UserInfo } from 'firebase-admin/auth';
export interface IUser extends UserInfo {
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
}

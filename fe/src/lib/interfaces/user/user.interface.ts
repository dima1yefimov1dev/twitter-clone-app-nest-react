import { UserInfo } from "firebase/auth";

export interface IUser extends UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null,
  photoURL: string | null;
}
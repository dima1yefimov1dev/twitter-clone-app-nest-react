import { makeAutoObservable } from "mobx";
import { IUser } from "../lib/interfaces";

class User {
  user: IUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getUser() {
    return this.user;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  logOut() {
    this.user = null;
  }
}

export const currentUser = new User();
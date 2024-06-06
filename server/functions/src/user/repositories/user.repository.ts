import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from '@google-cloud/firestore';
import * as admin from 'firebase-admin';
import { FirebaseAuthService } from 'src/firebase/services/firebase.auth.service';
import { FirebaseStorageService } from 'src/firebase/services/firebase.storage.service';
import { UpdateUserDto } from '../dto/update.user.dto';
import { IUser } from 'src/lib/interfaces';
import { DUMMY_PHOTO_URL } from 'src/lib/constants';

@Injectable()
export class UserRepository {
  collection: CollectionReference<DocumentData>;

  constructor(
    private readonly firebaseAuth: FirebaseAuthService,
    private readonly firebaseStorage: FirebaseStorageService,
  ) {
    this.collection = admin.firestore().collection('users');
  }

  async getAllUsers(): Promise<IUser[]> {
    const querySnapshot = await this.collection.get();

    return this.serializeUsers(querySnapshot);
  }

  async getUserByUid(uid: string): Promise<IUser> {
    const userQuerySnapshot = await this.collection.doc(uid).get();

    if (!userQuerySnapshot.exists) {
      throw new NotFoundException("user doesn't exist");
    }

    return this.serializeUser(userQuerySnapshot);
  }

  async createUser(input: {
    displayName: string;
    email: string;
    password: string;
    photoURL?: string;
  }): Promise<IUser> {
    const { email, password, photoURL, ...data } = input;
    const { uid } = await this.firebaseAuth.createNewUser(email, password);

    let image = '';

    if (!photoURL) {
      image = DUMMY_PHOTO_URL;
    } else {
      image = photoURL;
    }

    await admin.auth().updateUser(uid, { photoURL: image });

    const user = {
      uid,
      isActivated: false,
      photoURL: image,
      email,
      ...data,
    };

    const dockRef = this.collection.doc(uid);

    await dockRef.create(user);

    return await dockRef.get().then((doc) => this.serializeUser(doc));
  }

  async findOrCreate(uid: string): Promise<IUser> {
    const userFromDb = await this.collection.doc(uid).get();

    const userFromAuth = await this.firebaseAuth.findUserByUid(uid);

    if (!userFromAuth && !userFromDb.exists) {
      return null;
    }

    if (!userFromDb.exists && userFromAuth) {
      const userData = { ...userFromAuth.providerData[0] };

      for (const key in userData) {
        if (userData[key] === undefined) {
          userData[key] = null;
        }
      }

      const userDataForDB = { ...userData, uid };

      await this.collection.doc(uid).create({ ...userDataForDB });

      const newUserFromDb = await this.collection.doc(uid).get();

      return this.serializeUser(newUserFromDb);
    }

    if (userFromDb.exists && userFromAuth) {
      return this.serializeUser(userFromDb);
    }
  }

  async changePassword(newPassword: string, uid: string): Promise<void> {
    await admin.auth().updateUser(uid, { password: newPassword });
  }

  async deleteUser(uid: string): Promise<void> {
    const userDocRef = this.collection.doc(uid);
    const userToDelete = await userDocRef.get();

    if (!userToDelete.exists) {
      throw new NotFoundException('User not found');
    }

    const batch = admin.firestore().batch();

    try {
      const postsSnapshot = await admin
        .firestore()
        .collection('posts')
        .where('userId', '==', uid)
        .get();
      postsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      await admin.auth().deleteUser(uid);

      await userDocRef.delete();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async updateUser(uid: string, input: UpdateUserDto): Promise<void> {
    const { displayName, photoURL } = input;
    const updatedData: Partial<IUser> = { displayName };

    if (photoURL) {
      updatedData.photoURL = photoURL;
    }

    await this.collection.doc(uid).update({ ...updatedData });
  }

  private serializeUsers(docs: QuerySnapshot<DocumentData>): IUser[] {
    const users = [];

    docs.forEach((doc) => {
      users.push({ ...doc.data() });
    });

    return users;
  }

  private serializeUser(doc: FirebaseFirestore.DocumentSnapshot): IUser {
    const data = doc.data();
    if (!data) {
      throw new NotFoundException('Document data is undefined');
    }

    return {
      uid: doc.id,
      displayName: data.displayName,
      email: data.email || null,
      phoneNumber: data.phoneNumber || null,
      photoURL: data.photoURL || null,
      providerId: data.providerId || '',
    } as IUser;
  }
}

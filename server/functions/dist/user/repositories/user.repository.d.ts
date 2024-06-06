import { CollectionReference, DocumentData } from '@google-cloud/firestore';
import { FirebaseAuthService } from 'src/firebase/services/firebase.auth.service';
import { FirebaseStorageService } from 'src/firebase/services/firebase.storage.service';
import { UpdateUserDto } from '../dto/update.user.dto';
import { IUser } from 'src/lib/interfaces';
export declare class UserRepository {
    private readonly firebaseAuth;
    private readonly firebaseStorage;
    collection: CollectionReference<DocumentData>;
    constructor(firebaseAuth: FirebaseAuthService, firebaseStorage: FirebaseStorageService);
    getAllUsers(): Promise<IUser[]>;
    getUserByUid(uid: string): Promise<IUser>;
    createUser(input: {
        displayName: string;
        email: string;
        password: string;
        photoURL?: string;
    }): Promise<IUser>;
    findOrCreate(uid: string): Promise<IUser>;
    changePassword(newPassword: string, uid: string): Promise<void>;
    deleteUser(uid: string): Promise<void>;
    updateUser(uid: string, input: UpdateUserDto): Promise<void>;
    private serializeUsers;
    private serializeUser;
}

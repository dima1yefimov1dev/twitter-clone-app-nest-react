"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const firebase_auth_service_1 = require("../../firebase/services/firebase.auth.service");
const firebase_storage_service_1 = require("../../firebase/services/firebase.storage.service");
const constants_1 = require("../../lib/constants");
let UserRepository = class UserRepository {
    constructor(firebaseAuth, firebaseStorage) {
        this.firebaseAuth = firebaseAuth;
        this.firebaseStorage = firebaseStorage;
        this.collection = admin.firestore().collection('users');
    }
    async getAllUsers() {
        const querySnapshot = await this.collection.get();
        return this.serializeUsers(querySnapshot);
    }
    async getUserByUid(uid) {
        const userQuerySnapshot = await this.collection.doc(uid).get();
        if (!userQuerySnapshot.exists) {
            throw new common_1.NotFoundException("user doesn't exist");
        }
        return this.serializeUser(userQuerySnapshot);
    }
    async createUser(input) {
        const { email, password, photoURL, ...data } = input;
        const { uid } = await this.firebaseAuth.createNewUser(email, password);
        let image = '';
        if (!photoURL) {
            image = constants_1.DUMMY_PHOTO_URL;
        }
        else {
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
    async findOrCreate(uid) {
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
    async changePassword(newPassword, uid) {
        await admin.auth().updateUser(uid, { password: newPassword });
    }
    async deleteUser(uid) {
        const userDocRef = this.collection.doc(uid);
        const userToDelete = await userDocRef.get();
        if (!userToDelete.exists) {
            throw new common_1.NotFoundException('User not found');
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
        }
        catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
    async updateUser(uid, input) {
        const { displayName, photoURL } = input;
        const updatedData = { displayName };
        if (photoURL) {
            updatedData.photoURL = photoURL;
        }
        await this.collection.doc(uid).update({ ...updatedData });
    }
    serializeUsers(docs) {
        const users = [];
        docs.forEach((doc) => {
            users.push({ ...doc.data() });
        });
        return users;
    }
    serializeUser(doc) {
        const data = doc.data();
        if (!data) {
            throw new common_1.NotFoundException('Document data is undefined');
        }
        return {
            uid: doc.id,
            displayName: data.displayName,
            email: data.email || null,
            phoneNumber: data.phoneNumber || null,
            photoURL: data.photoURL || null,
            providerId: data.providerId || '',
        };
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_auth_service_1.FirebaseAuthService,
        firebase_storage_service_1.FirebaseStorageService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map
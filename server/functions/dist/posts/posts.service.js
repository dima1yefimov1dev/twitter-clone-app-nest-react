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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const user_repository_1 = require("../user/repositories/user.repository");
const firebase_storage_service_1 = require("../firebase/services/firebase.storage.service");
let PostsService = class PostsService {
    constructor(userRepository, firebaseStorage) {
        this.userRepository = userRepository;
        this.firebaseStorage = firebaseStorage;
        this.collection = admin.firestore().collection('posts');
    }
    async createPost(input, user) {
        const newPost = {
            ...input,
            userId: user.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const postRef = await this.collection.add(newPost);
        const userPostRef = this.userRepository.collection
            .doc(user.uid)
            .collection('posts')
            .doc(postRef.id);
        await userPostRef.set(newPost);
    }
    async getPostById(postId) {
        const docRef = await this.collection.doc(postId).get();
        return this.serializePost(docRef);
    }
    async getPostsByUser(uid) {
        const docRef = this.userRepository.collection.doc(uid).collection('posts');
        const querySnapShot = await docRef.where('userId', '==', `${uid}`).get();
        const posts = this.serializePosts(querySnapShot);
        return posts;
    }
    async getAllPosts() {
        const postsRef = await this.collection.get();
        return this.serializePosts(postsRef);
    }
    async updatePost(input, postId, uid) {
        const { postPhotoURL, text, title } = input;
        const updateData = { text, title };
        if (postPhotoURL) {
            updateData.postPhotoURL = postPhotoURL;
        }
        await this.collection.doc(postId).update(updateData);
        const postRef = this.userRepository.collection
            .doc(uid)
            .collection('posts')
            .doc(postId);
        await postRef.update(updateData);
        const updatedPost = await this.collection.doc(postId).get();
        return this.serializePost(updatedPost);
    }
    async updateTotalLikes(input, postId) {
        await this.collection.doc(postId).update(input);
    }
    async deletePostById(id, uid) {
        const postRef = this.collection.doc(id);
        const usersPostRef = this.userRepository.collection
            .doc(uid)
            .collection('posts')
            .doc(id);
        const postSnapshot = await postRef.get();
        if (!postSnapshot.exists) {
            throw new common_1.NotFoundException('post not found');
        }
        await usersPostRef.delete();
        await postRef.delete();
    }
    serializePost(doc) {
        const data = doc.data();
        if (!data) {
            throw new common_1.NotFoundException('doc data does not exist');
        }
        return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            text: data.text,
            totalLikes: data.totalLikes || 0,
            postPhotoURL: data.postPhotoURL || null,
            authorPhotoURL: data.authorPhotoURL,
            author: data.author || null,
            createdAt: data.createdAt,
            commentsCount: data.commentsCount || 0,
        };
    }
    serializePosts(docs) {
        const posts = [];
        docs.forEach((doc) => posts.push({ ...doc.data(), id: doc.id }));
        return posts;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        firebase_storage_service_1.FirebaseStorageService])
], PostsService);
//# sourceMappingURL=posts.service.js.map
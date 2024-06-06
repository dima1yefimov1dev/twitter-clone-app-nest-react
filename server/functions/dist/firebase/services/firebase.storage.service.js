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
exports.FirebaseStorageService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const storage_1 = require("firebase-admin/storage");
let FirebaseStorageService = class FirebaseStorageService {
    constructor() {
        this.storage = admin.storage();
        this.bucket = this.storage.bucket();
    }
    async uploadImage(buffer, fileName, folderName) {
        try {
            const metadata = {
                contentType: 'image/png',
                cacheControl: 'public, max-age=31536000',
            };
            const fileRef = this.bucket.file(`${folderName}/${fileName}`);
            await fileRef.save(buffer, { metadata });
            const imgUrl = await (0, storage_1.getDownloadURL)(fileRef);
            return imgUrl;
        }
        catch (error) {
            console.error('File upload error:', error);
            throw new common_1.HttpException('File upload error', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async uploadOrUpdateUserAvatar(buffer, fileName, uid) {
        const folderName = `users-avatars/${uid}`;
        const existingFiles = await this.bucket.getFiles({ prefix: folderName });
        if (existingFiles[0].length > 0) {
            await existingFiles[0][0].delete();
        }
        return await this.uploadImage(buffer, fileName, folderName);
    }
    async uploadPostFile(buffer, fileName, uid, postId) {
        const foldername = `posts/${uid}/${postId}`;
        return await this.uploadImage(buffer, fileName, foldername);
    }
};
exports.FirebaseStorageService = FirebaseStorageService;
exports.FirebaseStorageService = FirebaseStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FirebaseStorageService);
//# sourceMappingURL=firebase.storage.service.js.map
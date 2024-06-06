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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("../posts/posts.service");
let LikesService = class LikesService {
    constructor(postService) {
        this.postService = postService;
    }
    async toggleLikePost(postId, uid) {
        const likesRef = this.postService.collection
            .doc(postId)
            .collection('likes');
        const isAlreadyLiked = (await likesRef.doc(uid).get()).exists;
        if (isAlreadyLiked) {
            await likesRef.doc(uid).delete();
        }
        else {
            await likesRef.doc(uid).set({ likedAt: new Date() });
        }
        const totalLikes = (await likesRef.listDocuments()).length;
        const updateData = { totalLikes };
        await this.postService.updateTotalLikes(updateData, postId);
    }
    async isLiked(postId, uid) {
        const likesRef = this.postService.collection
            .doc(postId)
            .collection('likes');
        const isAlreadyLiked = (await likesRef.doc(uid).get()).exists;
        return isAlreadyLiked;
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], LikesService);
//# sourceMappingURL=likes.service.js.map
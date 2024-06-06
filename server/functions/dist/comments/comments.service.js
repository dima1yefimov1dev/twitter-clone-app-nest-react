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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("../posts/posts.service");
const admin = require("firebase-admin");
const user_service_1 = require("../user/user.service");
let CommentsService = class CommentsService {
    constructor(userService, postService) {
        this.userService = userService;
        this.postService = postService;
    }
    async createComment(body, userId, postId) {
        const commentData = {
            body,
            postId,
            userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const postRef = this.postService.collection.doc(postId);
        const commentsRef = postRef.collection('comments');
        const commentDoc = await commentsRef.add(commentData);
        const createdCommentDoc = await commentDoc.get();
        await postRef.update({
            commentsCount: admin.firestore.FieldValue.increment(1),
        });
        return this.serializeComment(createdCommentDoc);
    }
    async updateComment(body, postId, commentId, uid) {
        const commentRef = await this.checkCommentExistsAndPrivacy(commentId, postId, uid);
        if (!commentRef) {
            throw new common_1.ForbiddenException('u have no access to this');
        }
        await commentRef.update({ body });
    }
    async deleteComment(commentId, postId, uid) {
        const commentRef = await this.checkCommentExistsAndPrivacy(commentId, postId, uid);
        const postRef = this.postService.collection.doc(postId);
        if (!commentRef) {
            throw new common_1.ForbiddenException("u can't do this");
        }
        await commentRef.delete();
        await postRef.update({
            commentsCount: admin.firestore.FieldValue.increment(-1),
        });
    }
    async getDetailsForPost(postId) {
        const post = await this.postService.getPostById(postId);
        const dockRef = await this.postService.collection
            .doc(postId)
            .collection('comments')
            .get();
        const comments = this.serializeComments(dockRef);
        return { post, comments };
    }
    serializeComments(docs) {
        const comments = [];
        docs.forEach((doc) => comments.push({ ...doc.data(), id: doc.id }));
        return comments;
    }
    serializeComment(doc) {
        const data = doc.data();
        if (!data) {
            throw new common_1.NotFoundException("doc data doesn't exist");
        }
        return {
            id: doc.id,
            userId: data.userId,
            postId: data.postId,
            author: data.author,
            authorPhotoURL: data.authorPhotoURL,
            body: data.body,
            createdAt: data.createdAt,
        };
    }
    async checkCommentExistsAndPrivacy(commentId, postId, uid) {
        const commentRef = this.postService.collection
            .doc(postId)
            .collection('comments')
            .doc(commentId);
        const commentSnapshot = await commentRef.get();
        if (!commentSnapshot.exists) {
            return false;
        }
        const { userId } = commentSnapshot.data();
        if (userId !== uid) {
            return false;
        }
        return commentRef;
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        posts_service_1.PostsService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map
/// <reference types="cookie-parser" />
import { CommentsService } from './comments.service';
import { IComment, IUser } from 'src/lib/interfaces';
import { Request } from 'express';
export declare class CommentsController {
    private readonly commentService;
    constructor(commentService: CommentsService);
    getPostDetailsWithComments(postId: string): Promise<{
        post: import("src/lib/interfaces").IPost;
        comments: any[];
    }>;
    createComment(input: any, user: IUser): Promise<IComment>;
    updateComment(user: IUser, input: any, commentId: string): Promise<void>;
    deleteComment(user: IUser, postId: string, req: Request): Promise<void>;
}

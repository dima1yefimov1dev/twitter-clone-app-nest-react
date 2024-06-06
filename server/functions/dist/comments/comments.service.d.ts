import { PostsService } from 'src/posts/posts.service';
import { UserService } from 'src/user/user.service';
export declare class CommentsService {
    private readonly userService;
    private readonly postService;
    constructor(userService: UserService, postService: PostsService);
    createComment(body: string, userId: string, postId: string): Promise<{
        id: string;
        userId: any;
        postId: any;
        author: any;
        authorPhotoURL: any;
        body: any;
        createdAt: any;
    }>;
    updateComment(body: string, postId: string, commentId: string, uid: string): Promise<void>;
    deleteComment(commentId: string, postId: string, uid: string): Promise<void>;
    getDetailsForPost(postId: string): Promise<{
        post: import("../lib/interfaces").IPost;
        comments: any[];
    }>;
    private serializeComments;
    private serializeComment;
    private checkCommentExistsAndPrivacy;
}

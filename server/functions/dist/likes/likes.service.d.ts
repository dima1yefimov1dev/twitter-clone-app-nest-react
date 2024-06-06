import { PostsService } from 'src/posts/posts.service';
export declare class LikesService {
    private readonly postService;
    constructor(postService: PostsService);
    toggleLikePost(postId: string, uid: string): Promise<void>;
    isLiked(postId: string, uid: string): Promise<boolean>;
}

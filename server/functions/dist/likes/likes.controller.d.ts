import { LikesService } from './likes.service';
import { IUser } from 'src/lib/interfaces';
export declare class LikesController {
    private readonly likeService;
    constructor(likeService: LikesService);
    toggleLikePost(postId: string, user: IUser): Promise<void>;
}

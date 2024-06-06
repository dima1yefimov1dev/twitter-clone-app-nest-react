import { CreatePostDto } from './dto/create.post.dto';
import { PostsService } from './posts.service';
import { IUser } from 'src/lib/interfaces/';
export declare class PostsController {
    private readonly postService;
    constructor(postService: PostsService);
    createNewPost(input: CreatePostDto, user: any): Promise<void>;
    getAllPosts(): Promise<import("src/lib/interfaces/").IPost[]>;
    getPostsByUser(uid: string): Promise<import("src/lib/interfaces/").IPost[]>;
    updatePost(id: string, input: Partial<CreatePostDto>, user: any): Promise<import("src/lib/interfaces/").IPost>;
    deletePostById(id: string, user: IUser): Promise<void>;
}

import { CollectionReference, DocumentData, QuerySnapshot } from '@google-cloud/firestore';
import { UserRepository } from 'src/user/repositories/user.repository';
import { CreatePostDto } from './dto/create.post.dto';
import { FirebaseStorageService } from 'src/firebase/services/firebase.storage.service';
import { IPost, IUser } from 'src/lib/interfaces/';
export declare class PostsService {
    private readonly userRepository;
    private readonly firebaseStorage;
    collection: CollectionReference<DocumentData>;
    constructor(userRepository: UserRepository, firebaseStorage: FirebaseStorageService);
    createPost(input: CreatePostDto, user: IUser): Promise<void>;
    getPostById(postId: string): Promise<IPost>;
    getPostsByUser(uid: string): Promise<IPost[]>;
    getAllPosts(): Promise<IPost[]>;
    updatePost(input: any, postId: string, uid: string): Promise<IPost>;
    updateTotalLikes(input: any, postId: string): Promise<void>;
    deletePostById(id: string, uid: string): Promise<void>;
    serializePost(doc: FirebaseFirestore.DocumentSnapshot): IPost;
    serializePosts(docs: QuerySnapshot<DocumentData>): IPost[];
}

import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { UserRepository } from 'src/user/repositories/user.repository';
import { CreatePostDto } from './dto/create.post.dto';
import { FirebaseStorageService } from 'src/firebase/services/firebase.storage.service';
import { IPost, IUser } from 'src/lib/interfaces/';

@Injectable()
export class PostsService {
  collection: CollectionReference<DocumentData>;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly firebaseStorage: FirebaseStorageService,
  ) {
    this.collection = admin.firestore().collection('posts');
  }

  async createPost(input: CreatePostDto, user: IUser) {
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

  async getPostById(postId: string) {
    const docRef = await this.collection.doc(postId).get();

    return this.serializePost(docRef);
  }

  async getPostsByUser(uid: string): Promise<IPost[]> {
    const docRef = this.userRepository.collection.doc(uid).collection('posts');

    const querySnapShot = await docRef.where('userId', '==', `${uid}`).get();

    const posts = this.serializePosts(querySnapShot);

    return posts;
  }

  async getAllPosts(): Promise<IPost[]> {
    const postsRef = await this.collection.get();
    return this.serializePosts(postsRef);
  }

  async updatePost(input, postId: string, uid: string): Promise<IPost> {
    const { postPhotoURL, text, title } = input;
    const updateData: Partial<IPost> = { text, title };

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

  async updateTotalLikes(input, postId: string): Promise<void> {
    await this.collection.doc(postId).update(input);
  }

  async deletePostById(id: string, uid: string): Promise<void> {
    const postRef = this.collection.doc(id);
    const usersPostRef = this.userRepository.collection
      .doc(uid)
      .collection('posts')
      .doc(id);

    const postSnapshot = await postRef.get();

    if (!postSnapshot.exists) {
      throw new NotFoundException('post not found');
    }

    await usersPostRef.delete();
    await postRef.delete();
  }

  serializePost(doc: FirebaseFirestore.DocumentSnapshot): IPost {
    const data = doc.data();

    if (!data) {
      throw new NotFoundException('doc data does not exist');
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

  serializePosts(docs: QuerySnapshot<DocumentData>): IPost[] {
    const posts = [];

    docs.forEach((doc) => posts.push({ ...doc.data(), id: doc.id }));

    return posts;
  }
}

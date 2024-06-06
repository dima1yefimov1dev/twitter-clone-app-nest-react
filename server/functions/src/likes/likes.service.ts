import { Injectable } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class LikesService {
  constructor(private readonly postService: PostsService) {}

  async toggleLikePost(postId: string, uid: string): Promise<void> {
    const likesRef = this.postService.collection
      .doc(postId)
      .collection('likes');

    const isAlreadyLiked = (await likesRef.doc(uid).get()).exists;

    if (isAlreadyLiked) {
      await likesRef.doc(uid).delete();
    } else {
      await likesRef.doc(uid).set({ likedAt: new Date() });
    }

    const totalLikes = (await likesRef.listDocuments()).length;
    const updateData = { totalLikes };

    await this.postService.updateTotalLikes(updateData, postId);
  }

  async isLiked(postId: string, uid: string) {
    const likesRef = this.postService.collection
      .doc(postId)
      .collection('likes');

    const isAlreadyLiked = (await likesRef.doc(uid).get()).exists;

    return isAlreadyLiked;
  }
}

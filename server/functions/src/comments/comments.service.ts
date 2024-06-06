import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import * as admin from 'firebase-admin';
import { DocumentData, QuerySnapshot } from '@google-cloud/firestore';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostsService,
  ) {}

  async createComment(body: string, userId: string, postId: string) {
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

  async updateComment(
    body: string,
    postId: string,
    commentId: string,
    uid: string,
  ) {
    const commentRef = await this.checkCommentExistsAndPrivacy(
      commentId,
      postId,
      uid,
    );

    if (!commentRef) {
      throw new ForbiddenException('u have no access to this');
    }

    await commentRef.update({ body });
  }

  async deleteComment(commentId: string, postId: string, uid: string) {
    const commentRef = await this.checkCommentExistsAndPrivacy(
      commentId,
      postId,
      uid,
    );
    const postRef = this.postService.collection.doc(postId);

    if (!commentRef) {
      throw new ForbiddenException("u can't do this");
    }

    await commentRef.delete();
    await postRef.update({
      commentsCount: admin.firestore.FieldValue.increment(-1),
    });
  }

  async getDetailsForPost(postId: string) {
    const post = await this.postService.getPostById(postId);

    const dockRef = await this.postService.collection
      .doc(postId)
      .collection('comments')
      .get();

    const comments = this.serializeComments(dockRef);

    return { post, comments };
  }

  private serializeComments(docs: QuerySnapshot<DocumentData>) {
    const comments = [];

    docs.forEach((doc) => comments.push({ ...doc.data(), id: doc.id }));

    return comments;
  }

  private serializeComment(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data();

    if (!data) {
      throw new NotFoundException("doc data doesn't exist");
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

  private async checkCommentExistsAndPrivacy(
    commentId: string,
    postId: string,
    uid: string,
  ) {
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
}

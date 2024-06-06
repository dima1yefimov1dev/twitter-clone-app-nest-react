import { IUser } from '../user/user.interface';

export interface IPost {
  id: string;
  userId: string;
  title: string;
  text: string;
  totalLikes?: number;
  postPhotoURL?: string;
  authorPhotoURL?: string;
  author?: IUser;
  createdAt: Date;
  commentsCount?: number;
}

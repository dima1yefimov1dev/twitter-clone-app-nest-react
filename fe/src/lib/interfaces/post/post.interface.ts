export interface IPost {
  id: string;
  title: string;
  text: string;
  totalLikes?: number;
  commentsCount? : number;
  postPhotoURL?: string;
  createdAt: {_seconds: number, _nanoseconds: number};
  userId: string,
}
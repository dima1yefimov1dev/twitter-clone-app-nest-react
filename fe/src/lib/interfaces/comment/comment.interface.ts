export interface IComment {
  id: string;
  userId: string;
  postId: string;
  body: string;
  createdAt: {_seconds: number, _nanoseconds: number};
}
import { FC } from "react";
import { Post } from "../post/post";
import { IPost } from "../../lib/interfaces";

interface Props {
  posts: IPost[];
}
export const PostList:FC<Props> = ({ posts }) => {

  return (
    <div className="">
      <ul>
        {posts.map(post => 
          <Post 
            post={post} 
            key={post.id}
          />
        )}
      </ul>
    </div>
  )
}
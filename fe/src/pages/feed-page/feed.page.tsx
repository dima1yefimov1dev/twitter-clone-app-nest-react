import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IPost } from "../../lib/interfaces";
import { CreateNewPost } from "../../components/create-post/create.post";
import { PostList } from "../../components/post-list/post.list";
import { POSTS_ENDPOINT } from "../../lib/constants/constants";

export const FeedPage:FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const {uid} = useParams();

  const getFilteredPosts = async (uid?: string) => {
    try {
      const { data } = await axios.get(POSTS_ENDPOINT + 'all', { withCredentials: true });
      if (uid) {
        const filteredPosts = data.filter((post: IPost) => post.userId === uid);
        setPosts(filteredPosts);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };


  useEffect(() => {
    getFilteredPosts(uid);
    
  }, [uid])
  
  return (
    <div className="">
      {!uid && <CreateNewPost/> }
      {posts.length ? (
        <PostList posts={posts} />
      ) : (
        'No posts yet!'
      )}
    </div>
  )
}
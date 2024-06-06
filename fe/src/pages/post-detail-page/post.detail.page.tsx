import { FC, useEffect, useState } from "react";
import { Post } from "../../components/post/post";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CreateCommentForm } from "../../components/create-comment/create.comment";
import { POST_COMMENT_ENDPOINT } from "../../lib/constants/constants";
import { FaArrowLeft } from "react-icons/fa";
import styles from './post.detail.page.module.css';
import { IComment, IPost } from "../../lib/interfaces";
import { CommentsList } from "../../components/comment-list/comment.list";

export const PostDetailPAge:FC = () => {
  const [post, setPost] = useState<IPost| null>(null);
  const [comments, setComments] = useState<IComment[]>([]);

  const { id } = useParams();

  const getPostDetails = async (id: string) => {
    try {
       const {data} = await axios.get(POST_COMMENT_ENDPOINT + id)
       const {post, comments} = data;
       setPost(post);
       setComments(comments);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPostDetails(id!);
  }, [id])

  if (!post) {
    return (
      <div className="">LOADING...</div>
    )
  }

  return (
    <div className="">
      <Link
        to='/'
        className={styles.nav}
      >
        <FaArrowLeft className={styles.arrow} />
        <p>Feed</p>
      </Link>
      <Post post={post!}/>
      <CommentsList comments={comments} />
      <CreateCommentForm postId={post.id}/>
    </div>
  )
}
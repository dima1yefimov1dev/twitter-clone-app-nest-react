import { FC, useEffect, useState } from "react";
import dummyUser from "../../assets/dummy-user.png";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa6";
import { BsReply } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LIKES_ENDPOINT, POSTS_ENDPOINT, USER_ENDPOINT } from "../../lib/constants/constants";
import ReactModal from "react-modal";
import { IPost, IUser } from "../../lib/interfaces";
import { currentUser } from "../../store/current.user";
import { getTimeInfoFromTimestamp } from "../../lib/helpers/timestamp";
import { UpdatePost } from "../update-post/update.post";
import styles from './post.module.css';


interface Props {
  post: IPost;
 }

export const Post:FC<Props> = ({post}) => {
  const navigate = useNavigate();
  const [totalLikes, setTotalLikes] = useState(0);
  const [user, setUser] = useState<IUser | null>(null);
  const [isPostByUser, setIsPostByUser] = useState(false);
  const [date, setDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModalOpen = () => {
    setIsModalOpen(p => !p);
  }

  const redirectToPostDetail = () => {
    navigate(`/post/${post.id}`)
  }

  const redirectToUserPage = () => {
    navigate(`/${post.userId}`);
  }

  const handleSubmitLikePost = async () => {
    try {
      await axios.patch(LIKES_ENDPOINT + `${post.id}`, {postId: post.id}, {withCredentials: true});
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(POSTS_ENDPOINT + `${post.id}`, {withCredentials: true});
    } catch (error) {
      console.log(error);
    } 
  }

  const getUser = async () => {
    try {
      const {data} = await axios.get(USER_ENDPOINT + `${post.userId}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const {_seconds} = post.createdAt;
    const timePassed = getTimeInfoFromTimestamp(_seconds);
    setDate(timePassed);
    setTotalLikes(post.totalLikes!);
    const uid = currentUser?.user?.uid;
    setIsPostByUser(post.userId === uid);
    getUser();
  }, [post.totalLikes, post.createdAt, post.userId]);

  return (
   <li 
    className={styles.postWrapper} 
   >
      <div className={styles.author}>
        <img 
          src={user?.photoURL || dummyUser} 
          alt=""  
          className={styles.img}
          onClick={redirectToUserPage}
        />
      </div>

      <div 
        className={styles.post}
      >
        <div 
          className={styles.topBar}
        >
          <p 
            className={styles.postAuthorName}
            onClick={redirectToUserPage}
          >
            {user?.displayName}
          </p>

          <p>
            {date}
          </p>
        </div>

        <div 
          className={styles.postBody}
        >
          <h2 
            className={styles.postTitle}
          >
            {post.title}
          </h2>

          <p 
            className={styles.postText}
          >
            {post.text}
          </p>
          {post.postPhotoURL && <img className={styles.postImg} src={post.postPhotoURL}/>}
        </div>

        <div 
          className={styles.postController}
        >
          <a 
            className={styles.controllerLink}
            onClick={redirectToPostDetail}
          >
            <div 
              className={styles.flexDiv}
            >
              <FaRegComment 
                className={styles.comments} 
              />
              {post.commentsCount}
            </div>
          </a>

          <a 
            className={styles.controllerLink}
            onClick={handleSubmitLikePost}
          >
            <div 
              className={styles.flexDiv}
            >
              <IoIosHeartEmpty />
              {totalLikes}
            </div>
            
          </a>

          <a
            className={styles.controllerLink}
          >
            <BsReply 
              className={styles.reply}
            />
          </a>
        </div>
      </div>

      {isPostByUser && 
      <div className={styles.controller}>
        <button onClick={toggleModalOpen} className={styles.btn}>
          Edit
        </button>
        <button onClick={handleDeletePost} className={styles.btn} >
          Delete
        </button>
      </div>  
        
      }

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={toggleModalOpen}
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <UpdatePost
          photoURL={post.postPhotoURL!}
          commentTitle={post.title}
          body={post.text}
          toggleBtn={toggleModalOpen}
          postId={post.id}
          />
      </ReactModal>
    </li>
  )
}
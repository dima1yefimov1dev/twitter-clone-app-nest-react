import { FC, useEffect, useState } from "react";
import dummyUser from "../../assets/dummy-user.png";
import { BsReply } from "react-icons/bs";
import ReactModal from "react-modal";
import axios from "axios";
import { COMMENTS_ENDPOINT, USER_ENDPOINT } from "../../lib/constants/constants";
import { IComment, IUser } from "../../lib/interfaces";
import { getTimeInfoFromTimestamp } from "../../lib/helpers/timestamp";
import { currentUser } from "../../store/current.user";
import styles from './comment.module.css';
import { UpdateComment } from "../update-comment/update.comment";


interface Props {
  comment: IComment;
 }

export const Comment:FC<Props> = ({comment}) => {
  const [date, setDate] = useState('');
  const [user, setUser]= useState<IUser | null>(null);
  const [isPostByUser, setIsPostByUser] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModalOpen = () => {
    setIsModalOpen(p => !p);
  }

  const handleDeleteComment = async () => {
    try {
      await axios.delete(COMMENTS_ENDPOINT + `${comment.postId}`, {withCredentials: true, data: {commentId: comment.id}});
    } catch (error) {
      console.log(error);
    } 
  }

  const getUser = async () => {
    try {
      const {data} = await axios.get(USER_ENDPOINT + `${comment.userId}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const {_seconds} = comment.createdAt;
    const timePassed = getTimeInfoFromTimestamp(_seconds);
    setDate(timePassed);
    const uid = currentUser?.user?.uid;
    setIsPostByUser(comment.userId === uid);
    getUser();
  }, [comment.createdAt, comment.userId]);

  return (
   <li 
    className={styles.postWrapper} 
    >
      <div 
        className={styles.author}
      >
        <img 
          src={user?.photoURL || dummyUser} 
          alt=""  
          className={styles.img}
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
          <p 
            className={styles.postText}
          >
            {comment.body}
          </p>
        </div>

        <div 
          className={styles.postController}
        >
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
      <div className={styles.commentController}>
        <button onClick={toggleModalOpen} className={styles.btn}>
          Edit
        </button>
        <button className={styles.btn} onClick={handleDeleteComment}>
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
        <UpdateComment 
          commentBody={comment.body} 
          toggleBtn={toggleModalOpen} 
          postId={comment.postId} 
          commentId={comment.id}
        />
      </ReactModal>
      
   </li>
  )
}
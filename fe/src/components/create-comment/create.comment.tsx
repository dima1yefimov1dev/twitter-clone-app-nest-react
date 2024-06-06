import { ChangeEvent, FC, FormEvent, useState } from "react";
import styles from './create.comment.module.css';
import axios from "axios";
import { POST_COMMENT_ENDPOINT } from "../../lib/constants/constants";
import { currentUser } from "../../store/current.user";

interface Props {
  postId: string;
}

export const CreateCommentForm:FC<Props> = ({ postId }) => {
  const [body, setCommentBody] = useState('');

  const handleChangeCommentBody = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody(e.target.value);
  }

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();

    const formData = {
      body,
      postId,
    }

    try {
      await axios.post(POST_COMMENT_ENDPOINT, formData, {withCredentials: true});
    } catch(err) {
      console.log(err);
    } finally {
      setCommentBody('');
    }
  }

  return (
    <div 
      className={styles.wrapper}
    >
      <img 
        src={currentUser.user?.photoURL ?? undefined}
        className={styles.img}
        alt="" 
      />
    
      <form
        className={styles.form}
        onSubmit={handleSubmitComment}
      >
        <textarea 
          className={styles.textArea}
          value={body}
          onChange={handleChangeCommentBody}
          placeholder="Write your comment!"
          name="" 
          id=""
        />
  
        <button 
          type="submit"
          className={styles.button}
        >
          Comment!
        </button>
      </form>
    </div>
  )
}
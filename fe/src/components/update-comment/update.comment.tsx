import { ChangeEvent, FC, FormEvent, useState } from "react";
import styles from './update.comment.module.css';
import axios from "axios";
import { COMMENTS_ENDPOINT } from "../../lib/constants/constants";

interface Props {
  commentBody: string;
  toggleBtn: () => void;
  postId: string;
  commentId: string;
}

export const UpdateComment:FC<Props> = ({commentBody, toggleBtn, postId, commentId}) => {
  const [body, setBody] = useState(commentBody);
  const handleChangeBody = (e: ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  }

  const handleSubmitUpdateComment = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await axios.patch(COMMENTS_ENDPOINT + `${commentId}`, {body, postId}, {withCredentials: true});
    } catch (error) {
      console.log(error);
    } finally {
      toggleBtn();
    }
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={toggleBtn} className={styles.closeBtn}>X</button>
      <form action="" onSubmit={handleSubmitUpdateComment} className={styles.form}>
        <label className={styles.label} htmlFor="edit">Edit comment:</label>
        <input className={styles.input} type="text" value={body} onChange={handleChangeBody} />
        <button className={styles.btn} type="submit">Save</button>
      </form>
    </div>
  )
}
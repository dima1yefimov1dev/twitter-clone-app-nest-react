import { ChangeEvent, FC, FormEvent, useState } from "react";
import styles from './update.post.module.css';
import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { currentUser } from "../../store/current.user";
import { POSTS_ENDPOINT } from "../../lib/constants/constants";

export interface Props {
  postId: string;
  photoURL: string;
  commentTitle: string;
  body: string;
  toggleBtn: () => void
}

export const UpdatePost:FC<Props> = ({photoURL, commentTitle, body, toggleBtn, postId}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(photoURL);
  const [text, setText] = useState(body);
  const [title, setTitle] = useState(commentTitle);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmitUpdatePost = async (e: FormEvent) => {
    e.preventDefault();

    try{
      let imageURL = '';
      
      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${currentUser.user?.uid}/${file.name}`);
        await uploadBytesResumable(storageRef, file);
        imageURL = await getDownloadURL(storageRef);
      }

      const formData = {
        postPhotoURL: imageURL,
        title,
        text,
      }

      await axios.patch(POSTS_ENDPOINT + `${postId}`, formData, {withCredentials: true});
    } catch(err) {
      console.log(err);
    } finally {
      toggleBtn();
    }
  }

  return (
    <div className={styles.box}>
    <button className={styles.closeBtn} onClick={toggleBtn}>X</button>
    <form action="" className={styles.form} onSubmit={handleSubmitUpdatePost}>
      <img 
        src={preview} 
        alt="post" 
        className={styles.img} 
      />
    
      <div className={styles.div}>
        <label htmlFor="file-comment" className={styles.fileLabel}>PHOTO</label>
        <input id='file-comment' type="file" className={styles.fileInput} onChange={handleFileChange} />
      </div>
  
      <div className={styles.div}>
        <label htmlFor="comment-title" className={styles.label}>New title:</label>
  
        <input 
          id="comment-title" 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.div}>
        <label htmlFor="comment-body" className={styles.label}>New Text:</label>
  
        <input 
          id="comment-body" 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.input}
        />
      </div>
      
      <button
        type="submit"
        className={styles.submitBtn}
        
      >
        Save changes
      </button>
    </form>
  </div>
  )
}
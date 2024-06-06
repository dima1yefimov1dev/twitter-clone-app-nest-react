import { ChangeEvent, FC, FormEvent, useState } from "react";
import axios from "axios";
import styles from './create.post.module.css';
import cn from 'classnames';
import { useMatch } from "react-router-dom";
import { POSTS_ENDPOINT } from "../../lib/constants/constants";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

interface Props {
  toggleBtn?: () => void
  isModal?: boolean
}

export const CreateNewPost:FC<Props> = ({toggleBtn, isModal}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const feedMatch = useMatch('/');

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

  const resetForm = () => {
    setText('');
    setTitle('');
    setFile(null);
    setPreview(null);
  }

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault()
    try {
      let imageURL = '';
      
      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytesResumable(storageRef, file);
        imageURL = await getDownloadURL(storageRef);
      }

      const formData = {
        postPhotoURL: imageURL,
        title,
        text,
      }

      await axios.post(POSTS_ENDPOINT, formData, {withCredentials: true});
    } catch (error) {
      console.error(error);
    } finally {
      resetForm();
    }
  };

  return (
    <div 
      className={cn(isModal ? styles.wrapperFeed : styles.wrapper)}
    >
        {isModal && 
        <button
          className={styles.closeBtn}
          onClick={toggleBtn}
        >
          X
        </button>}
      <form 
        action="POST"
        onSubmit={e => handleSubmitForm(e)}
        className={styles.form}
      >
        <div className={styles.div}>
          <label 
            htmlFor="title"
            className={styles.label}
          >
            Title:
          </label>
          <input 
              id='title' 
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <textarea 
          className={cn(feedMatch ? styles.textAreaFeed : styles.textArea)}
          id='description' 
          onChange={(e) => setText(e.target.value)}
          placeholder="Click and Write here!"
          value={text}
          maxLength={150}
        />
        <div className={styles.formFooter}>
          <input
            type="file"
            id={isModal ? "file-input-modal" : "file-input" }
            className={styles.fileInput}
            onChange={handleFileChange}
          />
          <label 
            htmlFor={isModal ? "file-input-modal" : "file-input" }
            className={styles.fileLabel}
          />
          
          {preview && (
            <img src={preview} alt="Preview" className={styles.preview} />
          )}
          <button 
            type="submit"
            className={styles.btn}
          >
            POST
          </button>
        </div>
      </form>
    </div>
  )
}
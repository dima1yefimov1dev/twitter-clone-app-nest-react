import { ChangeEvent, FC, FormEvent, useState } from "react";
import axios from "axios";
import { USER_ENDPOINT } from "../../lib/constants/constants";
import styles from './edit.profile.module.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { currentUser } from "../../store/current.user";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

interface Props {
  photoURL: string,
  name: string,
  toggleBtn: () => void
}

export const EditProfileModal:FC<Props> = observer(({photoURL, name, toggleBtn}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(photoURL);
  const [displayName, setDisplayName] = useState(name);
  const navigate = useNavigate();

  const handleChangeDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  }

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

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let imageURL = '';

      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${currentUser.user?.uid}/${file.name}`);
        await uploadBytesResumable(storageRef, file);
        imageURL = await getDownloadURL(storageRef);
      }

      const formData  = {
        displayName,
        photoURL: imageURL,
      }
      
      await axios.patch(USER_ENDPOINT, formData, {withCredentials: true});
    } catch (error) {
      console.log(error);
    } finally {
      toggleBtn();
      navigate(`/${currentUser.user?.uid}`)
    }
  }

  return (
    <div className={styles.box}>
      <button className={styles.closeBtn} onClick={toggleBtn}>X</button>
      <form action="" className={styles.form} onSubmit={handleUpdateProfile}>
        <img 
          src={preview} 
          alt="Profile" 
          className={styles.img} 
        />
      
        <div className={styles.div}>
          <label htmlFor="file-avatar" className={styles.fileLabel}>upload new photo</label>
          <input id='file-avatar' type="file" className={styles.fileInput} onChange={handleFileChange} />
        </div>
    
        <div className={styles.div}>
          <label htmlFor="displayName" className={styles.label}>New name:</label>
    
          <input 
            id="displayName" 
            type="text"
            value={displayName}
            onChange={handleChangeDisplayName}
            className={styles.input}
          />
        </div>
        
        <button
          type="submit"
          className={styles.submitBtn}
        >
          save changes
        </button>
      </form>
    </div>
  )
})
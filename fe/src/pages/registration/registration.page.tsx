import { ChangeEvent, FC, FormEvent, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { login } from "../../firebase";
import { POST_REGISTRATION_URL } from "../../lib/constants/constants";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import styles from './registration.page.module.css';

export const RegistrationPage:FC = observer(() => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [file, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleStateChange = (e: ChangeEvent<HTMLInputElement>, setStateAction: React.Dispatch<React.SetStateAction<string>>) => {
    setStateAction(e.target.value);
  }

  const handleSubmitRegistration = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = '';

      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      const formData = {
        displayName: username,
        email,
        password,
        phoneNumber,
        photoURL: imageUrl,
      };

      await axios.post(POST_REGISTRATION_URL, formData, {
        withCredentials: true,
      });

      await login(email, password);
      return navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    } 
  }
  return (
    <div className={styles.registrationBox}>
      <h1
        className={styles.title}
      >
        Sign Up:
      </h1>

      <form 
        action=""
        onSubmit={handleSubmitRegistration}
        className={styles.form}
      >
        <div 
          className={styles.div}
        >
          <label 
            htmlFor=""
            className={styles.label}  
          >
            *Username:
          </label>

          <input
              type="text" 
              className={styles.input}
              onChange={e => handleStateChange(e,setUsername)}
              value={username}
            />
        </div>

        <div 
          className={styles.div}
        >
          <label 
            htmlFor=""
            className={styles.label}
          >
            *Email:
          </label>

          <input 
            type="text"
            className={styles.input}
            onChange={e => handleStateChange(e,setEmail)}
            value={email}
          />
        </div>

        <div 
          className={styles.div}
        >
          <label 
            htmlFor=""
            className={styles.label}
          >
            *Password:
          </label>

          <input 
            type="password"
            className={styles.input}
            onChange={e => handleStateChange(e,setPassword)}
            value={password}
          />
        </div>

        <div 
          className={styles.div}
        >
          <label 
            htmlFor=""
            className={styles.label}
          >
            Phone number:
          </label>

          <input 
            type="text"
            className={styles.input}
            onChange={e => handleStateChange(e,setPhoneNumber)}
            value={phoneNumber}
          />
        </div>

        <div 
          className={`${styles.div} 
            ${styles.margin}`}
        >
          <label 
            htmlFor=""
            className={styles.label}
          >
            Choose your profile photo:
            
          </label>

          <input 
            className={styles.input}
            type="file"
            accept="image/*"
            onChange={handleFileChange} 
          />
        </div>
  
        <button 
          type="submit"
          className={styles.btn}
        >
          Sign Up!
        </button>
      </form>

      <p>Already have an account?&nbsp;
        <NavLink 
          to={'/login'}
          className={styles.link}
        >
          Sign In!
        </NavLink>
      </p>

      <p className={styles.ps}>* fields are mandatory</p>
    </div>
  );
});
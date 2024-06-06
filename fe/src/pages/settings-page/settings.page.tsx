import axios from "axios";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { currentUser } from "../../store/current.user";
import { DELETE_ACCOUNT_URL, PATCH_NEW_PASSWORD, POST_LOGOUT_URL } from "../../lib/constants/constants";
import { useNavigate } from "react-router-dom";
import styles from './settings.page.module.css';

export const SettingsPage:FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [successChangePassword, setSuccessChangePassword] = useState('');
  const navigate = useNavigate();

  const changedSuccess = 'completed';

  const handleChangeNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  }

  const handleSubmitPasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios.patch(PATCH_NEW_PASSWORD, {newPassword}, {withCredentials: true});
    } catch (error) {
        console.log(error);
    } finally {
      setNewPassword('');
      setSuccessChangePassword(changedSuccess);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.post(POST_LOGOUT_URL, {}, {withCredentials: true});

      currentUser.logOut();

    } catch (error) {
      console.log(error);
    } finally {
      navigate('/');
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(DELETE_ACCOUNT_URL, {withCredentials: true});
    } catch (error) {
      console.log(error);
    } finally {
      navigate('/');
    }
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Settings:</h3>

        <div 
          className={styles.sections}>

          <form 
            className={styles.form}
            onSubmit={handleSubmitPasswordChange}
          >
            <div 
              className={styles.formDiv}
            >
              <label 
                htmlFor="new-pass"
                className={styles.label}
              >
                New password:
              </label>

              <input 
                id='new-pass'
                className={styles.input}
                type="text" 
                value={newPassword} 
                onChange={handleChangeNewPassword}
              />
            </div>

            {successChangePassword && (<p>password changed success</p>)}

            <button 
              type="submit"
              className={styles.btn}
            >
              Submit
            </button>
          </form>

        </div>

        <button
          className={styles.btn}
          onClick={handleLogOut}
        >
          Log out
        </button>

        <button
         className={styles.btn}
         onClick={handleDeleteProfile}
        >
          delete my profile
        </button>
    </div>
  )
}
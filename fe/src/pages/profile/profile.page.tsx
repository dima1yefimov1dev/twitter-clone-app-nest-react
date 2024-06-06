import { FC, useEffect, useState } from "react";
import { NavLink, useParams, Outlet, useMatch } from "react-router-dom";
import cn from 'classnames';
import ReactModal from 'react-modal';
import axios from "axios";
import { USER_ENDPOINT } from "../../lib/constants/constants";
import { IUser } from "../../lib/interfaces";
import { currentUser } from "../../store/current.user";
import styles from './profile.page.module.css';
import { EditProfileModal } from "../../components/edit-profile/edit.profile.modal";
import { observer } from "mobx-react-lite";

export const ProfilePage:FC = observer(() => {
  const { uid } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleIsModalOpen = () => {
    setIsModalOpen(prevState => !prevState);
  }

  const isActiveLink = ({isActive}: {isActive : boolean}) => {
    return isActive ? styles.active : '';
  }

  const getUserProfile = async (uid : string) => {
    try {
      const { data } = await axios.get(USER_ENDPOINT + `${uid}`);

      setUser(data);
    } catch(err) {
      console.log(err);
    }
  }

  const matchPosts = useMatch(`/${uid}`);

  const isCurrenUser = uid === currentUser.user?.uid;

  useEffect(() => {
    if (isCurrenUser) {
      setUser(currentUser.user);
    } else {
       getUserProfile(uid!);
    }
  }, [currentUser.user, uid])

  return (
    <div className={styles.wrapper}>
      <div className={styles.general}>
        <div className=''>
          <div className={styles.imgWrapper}>
            <img
              className={styles.img}
              src={user?.photoURL as string}
              alt="" 
            />
          </div>

          <h3 className={styles.displayName}>{user?.displayName}</h3>
        </div>

        {isCurrenUser &&
          <button 
            className={styles.edit_btn}
            onClick={toggleIsModalOpen}
          >
            Edit profile
          </button>}
      </div>
    
      <div 
        className=""
      >
        <ul 
          className={styles.ul}
        >
          <li>
            <NavLink 
              to='.'
              className={cn({ [styles.active]: matchPosts })}
            >
               Posts 
            </NavLink>
          </li>

          <li>
            <NavLink 
              to='replies'
              className={isActiveLink}
            >
               Replies 
            </NavLink>
          </li>
        </ul>
      </div>

      <Outlet />

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={toggleIsModalOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <EditProfileModal 
          photoURL={user?.photoURL as string} 
          name={user?.displayName as string}
          toggleBtn={toggleIsModalOpen}
          />
      </ReactModal>
    </div>
  )
})
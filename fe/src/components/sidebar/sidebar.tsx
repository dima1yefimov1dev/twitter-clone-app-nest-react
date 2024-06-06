import { FC, useState } from "react";
import { NavLink, useMatch} from "react-router-dom";
import styles from './sidebar.module.css';
import ReactModal from 'react-modal';
import { currentUser } from "../../store/current.user";
import { CreateNewPost } from "../create-post/create.post";

export const SideBar:FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const toggleModalOpen = () => {
    setIsModalOpen(prev => !prev);
  }

  const isActiveLink = ({isActive}: {isActive : boolean}) => {
    return isActive ? styles.active : '';
  }
  
  const matchProfile =  useMatch(`/${currentUser.user?.uid}/*`);

  const isActiveProfileLink = () => {
    return matchProfile ? styles.active : '';
  }

  return (
   <nav className={styles.nav}>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <NavLink 
            to={'/'}
            className={isActiveLink}
          >
            Home
          </NavLink>
        </li>

        <li className={styles.li}>
          <NavLink 
            to={`/${currentUser.user?.uid}`} 
            className={isActiveProfileLink}
          >
            Profile
          </NavLink>
        </li>

        <li className={styles.li}>
          <NavLink 
            to={`/users`} 
            className={isActiveLink}
          >
            Users
          </NavLink>
        </li> 
        <li className={styles.li}>
          <NavLink 
            to={`/settings`} 
            className={isActiveLink}
          >
            Settings
          </NavLink>
        </li> 
      </ul>

      <button 
        onClick={toggleModalOpen}
        className={styles.btnModal}
      >
        POST
      </button>
    
      <ReactModal 
        isOpen={isModalOpen} 
        onRequestClose={toggleModalOpen}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <CreateNewPost isModal={true} toggleBtn={toggleModalOpen}/>
      </ReactModal>
   </nav>
  )
}
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styles from './user.module.css';
import { IUser } from "../../lib/interfaces";

interface Props {
  user: IUser;
}
export const User:FC<Props> = ({user}) => {
  const navigate = useNavigate();

  const redirectToUserProfilePage = () => {
    navigate(`/${user.uid}`);
  }

  return (
    <li 
      className={styles.li}
    >
      <div 
        className={styles.wrapper}
        onClick={redirectToUserProfilePage}
      >
        <img 
          src={user.photoURL ?? undefined}
          className={styles.img}
          alt="avatar" 
        />

        <p
          className={styles.author}
        >
          {user.displayName}
        </p>
      </div>
    </li>
  )
}
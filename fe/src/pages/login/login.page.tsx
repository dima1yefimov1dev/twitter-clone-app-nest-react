import { FC, FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SocialIcon } from 'react-social-icons'
import { observer } from "mobx-react-lite";
import { GET_PROFILE_URL } from "../../lib/constants/constants";
import { googleLogin, login } from "../../firebase";
import axios from "axios";
import styles from './login.page.module.css';
import { currentUser } from "../../store/current.user";

export const LoginPage:FC = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const {data} = await axios.get(GET_PROFILE_URL, {withCredentials: true});
      console.log(data);
      currentUser.setUser(data);
      return navigate('/');
    } catch(e) {
      console.log(e);
    }
  }

  const handleGoogleLogin = async () =>{
    try {
      await googleLogin();
      return navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.loginBox}>
      <h2 className={styles.title}>
        Sign In:
      </h2>

        <form 
          className={styles.form} 
          onSubmit={handleLogin}
        >
          <div 
            className={styles.div} 
          >
            <label 
              className={styles.label} 
              htmlFor="email"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div 
            className={`${styles.div} 
              ${styles.margin}`}
          >
            <label 
              className={styles.label} 
              htmlFor="password"
            >
              Password:
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={password}
              className={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            className={styles.btn} 
            type="submit"
          >
            Sign In
          </button>
        </form>

        <p>OR</p>

        <SocialIcon network="google" onClick={handleGoogleLogin} className={styles.social}/>
        
        <p>Have no account yet?&nbsp;
          <NavLink 
            to={'registration'}
            className={styles.link}
          >
            SignUp!
          </NavLink>
        </p>
    </div>
  )
})
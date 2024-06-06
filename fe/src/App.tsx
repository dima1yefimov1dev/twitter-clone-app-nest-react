import axios from 'axios';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SideBar } from './components/sidebar/sidebar';
import { observer } from 'mobx-react-lite';
import styles from './App.module.css';
import { currentUser } from './store/current.user';
import { GET_PROFILE_URL } from './lib/constants/constants';
import { LoginPage } from './pages/login/login.page';
import { RegistrationPage } from './pages/registration/registration.page';

export const App = observer(() => {
  
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const matchLoginLocation = location === '/login';
  const matchRegistrationLocation = location === '/registration';

  const getUserProfile = async () => {
    try {
      if (!currentUser.user) {
        const {data} = await axios.get(GET_PROFILE_URL, {withCredentials: true});
        currentUser.setUser(data);
        navigate('/');
        return;
      }
    } catch(er) {
      console.log(er);
    }
  }
  
  useEffect(() => {
    getUserProfile();
    console.log(currentUser.getUser());
  }, [])
  
  if (!currentUser.user && matchLoginLocation) {
    return <LoginPage />;
  }

  if (!currentUser.user && matchRegistrationLocation) {
    return <RegistrationPage />;
  }

  return (

    <div className={styles.container}>
          <SideBar />
          <div className={styles.outlet}>
            <Outlet />
          </div>
    </div>
  );
})

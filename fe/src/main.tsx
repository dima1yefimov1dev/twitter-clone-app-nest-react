import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import  {App }  from './App';
import { RegistrationPage } from './pages/registration/registration.page';
import { LoginPage } from './pages/login/login.page';
import { PostDetailPAge } from './pages/post-detail-page/post.detail.page';
import { UsersPage } from './pages/user-page/user.page';
import { ProfilePage } from './pages/profile/profile.page';
import { FeedPage } from './pages/feed-page/feed.page';
import { SettingsPage } from './pages/settings-page/settings.page';
import axios from 'axios';


axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: 'registration',
        element: <RegistrationPage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        index: true,
        element: <FeedPage/>
      },
      {
        path: '/post/:id',
        element: <PostDetailPAge />
      },
      {
        path: 'users',
        element: <UsersPage/>
      },
      {
        path: ":uid",
        element: <ProfilePage />,
        children: [
          { path: 'posts', element: < FeedPage/> },
          { path: 'replies', element: <div>Hello replies page </div> },
          { index: true, element: <FeedPage /> },
        ]
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      }
    ]
  },

]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

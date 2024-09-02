import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import styles from './css/navbar.module.css';
import { getCurrentUser, isLoggedIn } from '../auth';
import ProfileSidebar from './sidebar/ProfileSidebar.jsx';

const PrivateNav = () => {
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    setLogin(isLoggedIn())
    setUser(getCurrentUser());
  }, [login, user])


  return (
    <header className={styles.header}>
      <nav className={styles.mainNav}>
        <div className={styles.logo}>
          {
            login && (
              <>
                <ul>
                  <NavLink to="/user-routes/dashboard"> <img className={styles.invert_logo} src="../../assets/logo.png" alt="logo" /></NavLink>
                </ul>

              </>
            )
          }{
            !login && (
              <ul>
                <NavLink to="/"> <img className={styles.invert_logo} src="../../assets/logo.png" alt="logo" /></NavLink>
              </ul>
            )
          }
        </div>
        
            <ul>
            
              <ProfileSidebar />
            </ul>
         

      </nav>
    </header>
  );
};

export default PrivateNav;

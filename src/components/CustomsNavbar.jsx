import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import styles from './css/navbar.module.css';
import {   isLoggedIn } from '../auth';
import Sidebar from './sidebar/ProfileSidebar.jsx';

const CustomNavbar = (args) => {
 
  const [login,setLogin] = useState(true);
  useEffect(()=>{
    setLogin(isLoggedIn())
  },[login])

  return (
    <header className={styles.header}>
      <nav className={styles.mainNav}>
        <div className={styles.logo}>
        {
          login&&(
            <ul>
            <NavLink to="/user-routes/dashboard"> <img className={styles.invert_logo} src="./assets/logo.png" alt="logo" /></NavLink>
            </ul>
          )
        }{
          !login&&(
            <ul>
            <NavLink to="/"> <img className={styles.invert_logo} src="./assets/logo.png" alt="logo" /></NavLink>
            </ul>
          )
        }
         
        </div>
        
        <ul>
        
            <ul>
           
          <Sidebar />
          </ul>
         
          
        </ul>
      </nav>
    </header>
  );
};

export default CustomNavbar;

import React, { useEffect, useState } from 'react'
import { Offcanvas } from 'react-bootstrap';
import { doLogout, getCurrentUser, isLoggedIn } from '../../auth';
import { useNavigate } from 'react-router-dom';
import styles from './sidebar.module.css'
import { FaAngleRight } from "react-icons/fa";
import Logoutwarning from './Logoutwarning';
import { FcUnlock } from "react-icons/fc";
import { MdAssignmentInd } from "react-icons/md";
import Avatar from 'react-avatar';
const ProfileSidebar = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(undefined);
  const [login, setLogin] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setLogin(isLoggedIn())
    setUser(getCurrentUser);
  }, [login, user])
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleNavLinkClick = (path) => {
    handleClose();
    setTimeout(() => {
      navigate(path);
    }, 300);
  };
  const logout = () => {
    doLogout(() => {
      navigate('/login');
    });
  }
  return (
    <>
      <li onClick={handleShow} className={styles.profilePicture}>
        {login && user ?<Avatar name={user} textSizeRatio={1.5} size="40"  round={true}/>: <img className={styles.profilePictureLogo} src="../../assets/login.png" alt='profile' />}
      </li>
      <Offcanvas show={show} placement="end" onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{login ? "Welcome" : "Guest"} </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            {
              login && (
                <div className={styles.usersAndLoginLgoOutOption}>
                  <div className={styles.profilePictureName}>
                    <b>{user}</b>
                  </div>
                  <hr></hr>
                  
                  <Logoutwarning
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    confirmLogoutAction={logout}
                  />
                  <div className={styles.options} onClick={() => setModalShow(true)}>
                    <b >Log Out</b>
                    <FaAngleRight />
                  </div>
                </div>
              )
            }{
              !login && (
                <div className={styles.usersAndLoginLgoOutOption}>
                  <div className={styles.options} onClick={() => handleNavLinkClick("/login")}>
                    <b to="#" ><FcUnlock /> Login</b>
                    <FaAngleRight />
                  </div>
                  <div className={styles.options} onClick={() => handleNavLinkClick("/signup")}>
                    <b to="#" ><MdAssignmentInd /> Signup</b>
                    <FaAngleRight />
                  </div>
                </div>
              )
            }
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default ProfileSidebar;
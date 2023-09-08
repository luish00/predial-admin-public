import React, { useCallback, useState } from 'react';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Offcanvas } from 'react-bootstrap';
import { SideBarData } from './SideBarData';

import './SideBar.css';
import { MaterialIcon } from '../common/icons/MaterialIcon';

interface Props {
  children: React.ReactNode;
}

const SideBar: React.FC<Props> = ({ children }) => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const auth = useAuthUser();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const userInfo = auth()?.user;
  const logoutItem = SideBarData.find((item) => item.link === 'logout');

  const userName = userInfo?.FirstName || 'na';

  const handleLogOut = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    signOut();

    navigate('/login');
  }, [navigate, signOut]);


  const SideBarItems = () => (
    <>
      {SideBarData.filter((item) => item.link !== 'logout').map((item, key) => {
        const { icon, link, title } = item;

        return (
          <li
            key={key}
            className="Row-item"
          >
            <Link to={link}>
              <div id="icon">{icon}</div>

              <div id="title">{title}</div>
            </Link>
          </li>
        );
      })}


      <li className="Logout-item Row-item" onClick={handleLogOut}>
        <div id="icon">{logoutItem?.icon}</div><div id="title">{logoutItem?.title}</div>
      </li>
    </>
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div id="side-bar-container" className="col-md-2 min-vh-100 bg-dark">
          <ul className="Sidebar-list">
            <img style={{ width: '90%' }} src={`https://avatars.dicebear.com/api/bottts/${userName}.svg`} />

            <p className="Sidebar-name">{userName}</p>

            <SideBarItems />
          </ul>
        </div>

        <div className="col-auto side-bar-offcanvas">
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menú</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              <ul className="p-0">
                <SideBarItems />
              </ul>
            </Offcanvas.Body>
          </Offcanvas>
        </div>

        <div className="col-sd-12 col-md-10 m-0 p-8">
          <Button className="side-bar-offcanvas" variant="outlet-primary" onClick={handleShow}>
            <MaterialIcon icon="menu" />
          </Button>

          {children}
        </div>
      </div>
    </div>
  );
};

export { SideBar };

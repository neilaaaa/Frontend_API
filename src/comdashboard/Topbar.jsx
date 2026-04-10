// src/components/Topbar.jsx
import React, { useState } from "react";
import "./Topbar.css";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import MenuIcon from '@mui/icons-material/Menu';

export default function Topbar({ collapsed, setCollapsed }) {

  const [open, setOpen] = useState(false);

  return (
    <div className={`topbar ${collapsed ? "collapsed" : ""}`}>
      <div className="topbarConteneur">

        {/* Partie gauche : bouton menu + logo */}
        <div className="topleft">
          <MenuIcon 
            className="menuIcon"
            onClick={() => setCollapsed(!collapsed)}
          />
          <span className="logo">Mon espace</span>
        </div>

        {/* Partie droite : messages, notifications, utilisateur */}
        <div className="topright">

          

          <div className="topbarIconsContainer">
            <NotificationsIcon />
            <span className="topiconBag"></span>
          </div>

          {/* UTILISATEUR */}
          <div 
            className="userContainer"
            onClick={() => setOpen(!open)}
          >
            <AccountCircleIcon className="userIcon" />
            <span className="username">nom utilisateur</span>

            {open && (
              <div className="dropdownMenu">
                
                <div className="dropdownItem logout">Déconnexion</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
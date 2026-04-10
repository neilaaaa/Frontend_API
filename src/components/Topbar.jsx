import React, { useState } from "react";
import "./Topbar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../contexts/AuthContext";

export default function Topbar({ collapsed, setCollapsed }) {
  const { user } = useAuth();

  return (
    <div className={`topbar ${collapsed ? "collapsed" : ""}`}>
      <div className="topbarConteneur">
        <div className="topleft">
          <MenuIcon
            className="menuIcon"
            onClick={() => setCollapsed(!collapsed)}
          />
          <span className="logo">Mon espace</span>
        </div>

        <div className="topright">

          {/* SEARCH */}
          <div className="searchContainer">
            <SearchIcon />
            <input type="text" placeholder="Rechercher..." />
          </div>

          {/* NOTIFICATIONS */}
          <div className="topbarIconsContainer">
            <NotificationsIcon />
            <span className="topiconBag"></span>
          </div>

          {/* USER INFO (sans dropdown) */}
          <div className="userContainer">
            <AccountCircleIcon className="userIcon" />
            <div className="userInfo">
              <span className="username">{user?.nom}</span>
              <span className="userRole">{user?.role}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
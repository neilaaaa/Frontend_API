import React, { useEffect, useRef, useState } from "react";
import "./Topbar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

const TYPE_CONFIG = {
  user: { emoji: "\u{1F464}", color: "#7c3aed", bg: "#f3e8ff" },
  warning: { emoji: "\u26A0\uFE0F", color: "#f59e0b", bg: "#fef3c7" },
  role: { emoji: "\u{1F504}", color: "#2196f3", bg: "#e3f2fd" },
  success: { emoji: "\u2705", color: "#10b981", bg: "#d1fae5" },
  document: { emoji: "\u{1F4C4}", color: "#2196f3", bg: "#e3f2fd" },
  recours: { emoji: "\u2696\uFE0F", color: "#ef5350", bg: "#ffeaea" },
  brevet: { emoji: "\u{1F3C5}", color: "#ff7a18", bg: "#fff3e0" },
  demande: { emoji: "\u{1F4CB}", color: "#7c3aed", bg: "#f3e8ff" },
};

function formatRole(role) {
  if (!role) return "Utilisateur";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatDisplayName(user) {
  const fullName = [user?.prenom, user?.nom].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (user?.nom) return user.nom;
  if (user?.username) return user.username;
  if (user?.email) return user.email.split("@")[0];
  return "Utilisateur";
}

export default function Topbar({ collapsed, onMenuToggle }) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const displayName = formatDisplayName(user);
  const roleLabel = formatRole(user?.role);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleNotifClick(notif) {
    markAsRead(notif.id);
    setPanelOpen(false);
    navigate(notif.link);
  }

  return (
    <div className={`topbar ${collapsed ? "collapsed" : ""}`}>
      <div className="topbarConteneur">
        <div className="topleft">
          <button
            type="button"
            className="menuButton"
            aria-label={collapsed ? "Ouvrir le menu" : "Basculer le menu"}
            onClick={onMenuToggle}
          >
            <MenuIcon className="menuIcon" />
          </button>
          <span className="logo">Mon espace</span>
        </div>

        <div className="topright">
          <div className="notifWrapper" ref={panelRef}>
            <div
              className={`topbarIconsContainer ${panelOpen ? "active" : ""}`}
              onClick={() => setPanelOpen((v) => !v)}
            >
              <NotificationsIcon />
              {unreadCount > 0 && <span className="topiconBag">{unreadCount}</span>}
            </div>

            {panelOpen && (
              <div className="notifPanel">
                <div className="notifPanelHeader">
                  <div className="notifPanelTitle">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="notifBadgeCount">{unreadCount} nouvelles</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button className="markAllBtn" onClick={markAllAsRead}>
                      Tout lire
                    </button>
                  )}
                </div>

                <div className="notifList">
                  {notifications.length === 0 ? (
                    <div className="notifEmpty">
                      <span className="notifEmptyIcon">{TYPE_CONFIG.user.emoji}</span>
                      <p>Aucune notification</p>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.success;
                      return (
                        <div
                          key={notif.id}
                          className={`notifItem ${notif.read ? "read" : "unread"}`}
                          onClick={() => handleNotifClick(notif)}
                        >
                          {!notif.read && <div className="unreadDot" />}

                          <div
                            className="notifIcon"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            <span>{cfg.emoji}</span>
                          </div>

                          <div className="notifContent">
                            <p className="notifTitle">{notif.title}</p>
                            <p className="notifMessage">{notif.message}</p>
                            <p className="notifTime">{notif.time}</p>
                          </div>

                          <div className="notifArrow" style={{ color: cfg.color }}>
                            &#8250;
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="notifPanelFooter">
                  <span>
                    {notifications.filter((n) => n.read).length} / {notifications.length} lues
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="userContainer">
            <AccountCircleIcon className="userIcon" />
            <div className="userInfo">
              <span className="username">{displayName}</span>
              <span className="userRole">{roleLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

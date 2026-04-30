import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar  from "./Topbar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const syncLayout = (event) => {
      if (!event.matches) {
        setMobileMenuOpen(false);
      }
    };

    syncLayout(media);
    media.addEventListener("change", syncLayout);
    return () => media.removeEventListener("change", syncLayout);
  }, []);

  const handleMenuToggle = () => {
    if (window.matchMedia("(max-width: 900px)").matches) {
      setMobileMenuOpen((open) => !open);
      return;
    }
    setCollapsed((value) => !value);
  };

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileMenuOpen}
        onNavigate={() => setMobileMenuOpen(false)}
      />
      {mobileMenuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Fermer le menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div className="main-shell">
        <Topbar collapsed={collapsed} onMenuToggle={handleMenuToggle} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

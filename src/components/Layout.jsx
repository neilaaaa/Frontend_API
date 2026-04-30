import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar  from "./Topbar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} />
      <div className="main-shell">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

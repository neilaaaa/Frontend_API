import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar  from "./Topbar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
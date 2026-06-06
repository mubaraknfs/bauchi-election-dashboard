import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {

const menuItems = [

  {
    name: "Dashboard",
    path: "/"
  },

  {
  name: "Result Submission",
  path: "/submit-result"
},

  {
    name: "User Management",
    path: "/users"
  },

  {
    name: "Approvals",
    path: "/approvals"
  },

  {
    name: "Audit Logs",
    path: "/audit-logs"
  },

  {
    name: "Fraud Detection",
    path: "/fraud"
  },

  {
  label: "Cancelled Elections",
  path: "/cancelled-results",
  icon: "🚫"
},

  {
    name: "Notifications",
    path: "/notifications"
  },

  {
    name: "Analytics",
    path: "/analytics"
  },

  {
    name: "Election Map",
    path: "/map"
  }

];

  return (

    <div style={sidebarStyle}>

      <h2 style={titleStyle}>
        Election System
      </h2>

      {

        menuItems.map((item) => (

          <Link

  key={item.name}

  to={item.path}

  style={linkStyle}
>

  <button
    style={buttonStyle}
  >

    {item.name}

  </button>

</Link>

        ))
      }

    </div>
  );
}

const sidebarStyle = {

  width: "250px",

  minHeight: "100vh",

  backgroundColor: "#1f2937",

  padding: "20px",

  boxSizing: "border-box"
};

const titleStyle = {

  color: "white",

  marginBottom: "30px"
};

const linkStyle = {

  textDecoration: "none"
};

const buttonStyle = {

  width: "100%",

  padding: "14px",

  marginBottom: "10px",

  border: "none",

  backgroundColor: "#374151",

  color: "white",

  borderRadius: "6px",

  cursor: "pointer",

  textAlign: "left"
};

export default Sidebar;
import React from "react";
import { Link } from "react-router-dom";

function CollationSidebar() {

  const menuItems = [

    {
      name: "Result Submission",
      path: "/submit-result"
    },


    {
      name: "Evidence Upload",
      path: "/evidence-upload"
    }

  ];

  const handleLogout = () => {

  localStorage.clear();

  sessionStorage.clear();

  window.location.replace(
    "/login"
  );
};

  return (

    <div style={sidebarStyle}>

      <h2 style={titleStyle}>
        Collation Portal
      </h2>

      {menuItems.map((item) => (

        <Link
          key={item.path}
          to={item.path}
          style={linkStyle}
        >

          <button style={buttonStyle}>
            {item.name}
          </button>

        </Link>

      ))}

      {/* LOGOUT BUTTON */}

      <div
        style={{
          marginTop: "30px"
        }}
      >

        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
        >
          Logout
        </button>

      </div>

    </div>

  );
}

const sidebarStyle = {

  width: "250px",

  minHeight: "100vh",

  backgroundColor: "#1f2937",

  padding: "20px",

  display: "flex",

  flexDirection: "column"
};

const titleStyle = {

  color: "#fff",

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

  color: "#fff",

  borderRadius: "6px",

  cursor: "pointer",

  textAlign: "left",

  fontWeight: "bold"
};

const logoutButtonStyle = {

  width: "100%",

  padding: "14px",

  border: "none",

  backgroundColor: "#dc2626",

  color: "#fff",

  borderRadius: "6px",

  cursor: "pointer",

  fontWeight: "bold"
};

export default CollationSidebar;
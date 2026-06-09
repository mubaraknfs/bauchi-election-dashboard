import React from "react";
import { Link } from "react-router-dom";

function CollationSidebar() {

  const menuItems = [

    {
  name: "Result Submission",
  path: "/submit-result"
},

{
  name: "Result Import Center",
  path: "/import-results"
},

{
  name: "Import History",
  path: "/import-history"
},

{
  name: "Evidence Upload",
  path: "/evidence-upload"
},

  ];

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

    </div>

  );
}

const sidebarStyle = {
  width: "250px",
  minHeight: "100vh",
  backgroundColor: "#1f2937",
  padding: "20px"
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
  textAlign: "left"
};

export default CollationSidebar;
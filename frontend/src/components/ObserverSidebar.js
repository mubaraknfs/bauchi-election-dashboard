import React from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

function ObserverSidebar() {

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Main Dashboard",
      path: "/observer"
    },
    {
      name: "Polling Units Dashboard",
      path: "/polling-units-live"
    },
    {
      name: "Ward Dashboard",
      path: "/wards-live"
    },
    {
      name: "LGA Dashboard",
      path: "/lgas-live"
    },
    {
      name: "State Dashboard",
      path: "/state-live"
    },
    {
      name: "Fraud Detection",
      path: "/fraud"
    },
    {
      name: "Audit Logs",
      path: "/audit-logs"
    },
    {
      name: "Cancelled Elections",
      path: "/cancelled-results"
    },
    {
      name: "GIS Election Map",
      path: "/map"
    },
    {
      name: "Export PDF",
      path: "/export-pdf"
    },
    {
      name: "Export Excel",
      path: "/export-excel"
    }
  ];

  return (
    <div style={sidebarStyle}>
      <h2 style={titleStyle}>
        Observer Portal
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
  padding: "20px",
  boxSizing: "border-box"
};

const titleStyle = {
  color: "#ffffff",
  marginBottom: "30px",
  textAlign: "center"
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
  color: "#ffffff",
  borderRadius: "6px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "600"
};

export default ObserverSidebar;
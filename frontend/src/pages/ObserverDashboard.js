import React from "react";
import { useNavigate } from "react-router-dom";

function ObserverDashboard() {

  const navigate = useNavigate();
  const handleLogout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "/login";
};

  return (

    <div style={contentStyle}>

  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "20px"
    }}
  >

    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#dc2626",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Logout
    </button>

  </div>
     
      <h1>
        Observer Dashboard
      </h1>

      <p>
        Election monitoring and analytics center.
      </p>

      <div style={gridStyle}>

        <div
  style={cardStyle}
  onClick={() => navigate("/")}
>
  Main Dashboard
</div>

        <div
          style={cardStyle}
          onClick={() => navigate("/polling-units-live")}
        >
          Polling Units Dashboard
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/cancelled-results")}
        >
          Cancelled Elections
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/fraud")}
        >
          Fraud Detection
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/state-live")}
        >
          State Dashboard
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/wards-live")}
        >
          Ward Dashboard
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/lgas-live")}
        >
          LGA Dashboard
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/map")}
        >
          GIS Election Map
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/audit-logs")}
        >
          Audit Logs
        </div>

        <div
          style={cardStyle}
          onClick={() => navigate("/export-pdf")}
        >
          Export Reports
        </div>

      </div>

    </div>

  );
}

const contentStyle = {

  padding: "20px"
};

const gridStyle = {

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",

  gap: "20px",

  marginTop: "30px"
};

const cardStyle = {

  padding: "30px",

  backgroundColor: "#ffffff",

  borderRadius: "10px",

  border: "1px solid #ddd",

  fontWeight: "bold",

  textAlign: "center",

  cursor: "pointer",

  transition: "all 0.2s ease",

  boxShadow:
    "0 2px 5px rgba(0,0,0,0.1)"
};

export default ObserverDashboard;
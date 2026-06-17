import React from "react";
import { useNavigate } from "react-router-dom";

function ObserverDashboard() {

  const navigate = useNavigate();

  return (

    <div style={contentStyle}>
     
      <h1>
        Observer Dashboard
      </h1>

      <p>
        Election monitoring and analytics center.
      </p>

      <div style={gridStyle}>

        <div
  style={cardStyle}
  onClick={() => navigate("/observer")}
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
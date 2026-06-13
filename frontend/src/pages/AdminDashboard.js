import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  return (

    <div style={contentStyle}>

      <h1>
        Admin Dashboard
      </h1>

      <p>
        Election administration and monitoring.
      </p>

      <div style={gridStyle}>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/submit-result")
          }
        >
          Result Submission
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/approvals")
          }
        >
          Pending Approvals
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/audit-logs")
          }
        >
          Audit Logs
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/fraud")
          }
        >
          Fraud Detection
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/cancelled-results")
          }
        >
          Cancelled Elections
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/import-history")
          }
        >
          Import History
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/import-results")
          }
        >
          Result Import Center
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/notifications")
          }
        >
          Notifications
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            navigate("/map")
          }
        >
          Election Map
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

export default AdminDashboard;
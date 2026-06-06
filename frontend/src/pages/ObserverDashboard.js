import React from "react";

function ObserverDashboard() {

  return (

    <div style={contentStyle}>

      <h1>
        Observer Dashboard
      </h1>

      <p>
        Election monitoring and analytics center.
      </p>

      <div style={gridStyle}>

        <div style={cardStyle}>
          Live Polling Unit Results
        </div>

        <div style={cardStyle}>
          Overvoting Detection
        </div>

        <div style={cardStyle}>
          Suspicious Polling Units
        </div>

        <div style={cardStyle}>
          State Analytics
        </div>

        <div style={cardStyle}>
          Ward Analytics
        </div>

        <div style={cardStyle}>
          LGA Analytics
        </div>

        <div style={cardStyle}>
          GIS Election Map
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

  boxShadow:
    "0 2px 5px rgba(0,0,0,0.1)"
};

export default ObserverDashboard;
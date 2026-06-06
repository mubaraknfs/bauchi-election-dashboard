import React from "react";

function CollationDashboard() {

  return (

    <div style={contentStyle}>

      <h1>
        Collation Officer Dashboard
      </h1>

      <p>
        Submit polling unit election results.
      </p>

      <div style={cardStyle}>

        <h3>
          Election Result Submission Form
        </h3>

        <p>
          Access the polling unit result
          submission portal here.
        </p>

      </div>

    </div>
  );
}

const contentStyle = {

  padding: "20px"
};

const cardStyle = {

  marginTop: "30px",

  padding: "30px",

  backgroundColor: "#ffffff",

  borderRadius: "10px",

  border: "1px solid #ddd",

  boxShadow:
    "0 2px 5px rgba(0,0,0,0.1)"
};

export default CollationDashboard;
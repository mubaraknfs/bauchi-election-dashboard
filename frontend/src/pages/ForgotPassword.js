import React, {
  useState
} from "react";

import axios from "axios";

const API_URL =
  "https://bauchi-election-dashboard.onrender.com";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const handleReset =
    async () => {

      try {

        const response =
          await axios.post(

            `${API_URL}/api/forgot-password`,

            {
              email
            }
          );

        alert(
  response.data.message
);

console.log(
  "RESET LINK:",
  response.data.resetLink
);

window.open(
  response.data.resetLink,
  "_blank"
);

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Request failed"
        );
      }
    };

  return (

    <div style={containerStyle}>

      <div style={cardStyle}>

        <h1>
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <button
          onClick={handleReset}
          style={buttonStyle}
        >
          Send Reset Link
        </button>

      </div>

    </div>
  );
}

const containerStyle = {

  height: "100vh",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  backgroundColor: "#f3f4f6"
};

const cardStyle = {

  width: "450px",

  backgroundColor: "#fff",

  padding: "40px",

  borderRadius: "10px"
};

const inputStyle = {

  width: "100%",

  padding: "12px",

  marginBottom: "15px",

  border: "1px solid #ccc",

  borderRadius: "6px",

  boxSizing: "border-box"
};

const buttonStyle = {

  width: "100%",

  padding: "14px",

  backgroundColor: "#2563eb",

  color: "#fff",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer"
};

export default ForgotPassword;
import React, {
  useState
} from "react";

import axios from "axios";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin =
    async () => {

      try {

        const response =
          await axios.post(

            "http://localhost:5000/api/login",

            {
              email,
              password
            }
          );

        localStorage.setItem(

          "token",

          response.data.token
        );

        localStorage.setItem(

          "user",

          JSON.stringify(
            response.data.user
          )
        );

        window.location.reload();

      } catch (error) {

        alert(
          "Invalid credentials"
        );
      }
    };

  return (

    <div style={containerStyle}>

      <div style={cardStyle}>

        <h1>
          Election Login
        </h1>

        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          style={inputStyle}
        />

        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          style={inputStyle}
        />

        <button

          style={buttonStyle}

          onClick={handleLogin}
        >

          Login

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

  backgroundColor: "#f2f2f2"
};

const cardStyle = {

  width: "400px",

  backgroundColor: "#fff",

  padding: "40px",

  borderRadius: "10px"
};

const inputStyle = {

  width: "100%",

  padding: "12px",

  marginBottom: "15px",

  borderRadius: "5px",

  border: "1px solid #ccc",

  boxSizing: "border-box"
};

const buttonStyle = {

  width: "100%",

  padding: "14px",

  backgroundColor: "green",

  color: "white",

  border: "none",

  borderRadius: "5px",

  cursor: "pointer"
};

export default Login;
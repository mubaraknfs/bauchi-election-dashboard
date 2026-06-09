import React, {
  useState
} from "react";

import axios from "axios";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

const handleLogin = async () => {

  try {

    console.log("LOGIN EMAIL:", email);
    console.log("LOGIN PASSWORD:", password);

    const response =
      await axios.post(

        "https://bauchi-election-dashboard.onrender.com/api/login",

        {
          email: email.trim(),
          password: password.trim()
        }
      );

    console.log(
      "LOGIN RESPONSE:",
      response.data
    );

    if (response.data.success) {

      localStorage.setItem(
        "token",
        response.data.token
      );

    console.log(
  "TOKEN SAVED:",
  response.data.token
);

      localStorage.setItem(

        "user",

        JSON.stringify(
          response.data.user
        )
      );

    console.log(
  "TOKEN SAVED:",
  response.data.token
);

      alert("Login successful");

const role =
  response.data.user.role;

if (role === "observer") {

  window.location.href =
    "/observer";

} else if (
  role === "admin"
) {

  window.location.href =
    "/admin";

} else if (
  role === "collation_officer"
) {

  window.location.href =
    "/collation";

} else {

  window.location.href =
    "/";
}

    } else {

      alert(
        response.data.message
      );
    }

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error.response?.data ||
      error.message
    );

    alert(

      error.response?.data?.message ||

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
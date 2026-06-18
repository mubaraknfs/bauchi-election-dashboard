import React, {
  useState,
  useEffect
} from "react";

import axios from "axios";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    setEmail("");
    setPassword("");

    localStorage.removeItem(
      "loginEmail"
    );

  }, []);

  const handleLogin = async () => {

    try {

      setLoading(true);

      const response =
        await axios.post(

          "https://bauchi-election-dashboard.onrender.com/api/login",

          {
            email: email.trim(),
            password: password.trim()
          }
        );

      if (response.data.success) {

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

        const role =
          response.data.user.role;

        if (
          role === "observer"
        ) {

          window.location.href =
            "/observer";

        } else if (
          role === "admin"
        ) {

          window.location.href =
            "/admin";

        } else if (
          role ===
          "collation_officer"
        ) {

          window.location.href =
            "/collation";

        } else {

          window.location.href =
            "/";
        }

      } else {

        setLoading(false);

        alert(
          response.data.message
        );
      }

    } catch (error) {

      setLoading(false);

      console.error(error);

      alert(

        error.response?.data
          ?.message ||

        "Invalid credentials"
      );
    }
  };

  return (

    <div style={containerStyle}>

      <div style={wrapperStyle}>

        <div style={leftPanelStyle}>
          
          <h1 style={systemTitleStyle}>
            Bauchi State Election
          </h1>

          <h2>
            Situation Room 2027
          </h2>

          <p
            style={{
              opacity: 0.9,
              marginBottom: "25px"
            }}
          >
            Secure Election
            Management Platform
          </p>

          <div style={featureStyle}>
            ✓ Real-time Result Monitoring
          </div>

          <div style={featureStyle}>
            ✓ GIS Election Mapping
          </div>

          <div style={featureStyle}>
            ✓ Fraud Detection Engine
          </div>

          <div style={featureStyle}>
            ✓ Audit Logs & Compliance
          </div>

          <div style={featureStyle}>
            ✓ Target Result Tracking
          </div>

        </div>

        <div style={cardStyle}>

          <h1 style={loginTitleStyle}>
            Election Management Portal
          </h1>

          <form autoComplete="off">

            <input

              type="email"

              autoComplete="off"

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

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              autoComplete="new-password"

              placeholder="Password"

              value={password}

              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }

              style={inputStyle}
            />

          </form>

          <div
            style={{
              marginBottom: "15px"
            }}
          >

            <label
              style={{
                fontSize: "14px"
              }}
            >

              <input

                type="checkbox"

                checked={
                  showPassword
                }

                onChange={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

              />

              {" "}
              Show Password

            </label>

          </div>

          <button

            style={buttonStyle}

            onClick={handleLogin}

            disabled={loading}
          >

            {
              loading

                ? "Logging in..."

                : "Login"
            }

          </button>

          <div
            style={{
              marginTop: "20px",
              textAlign: "center"
            }}
          >

            <span

              onClick={() =>
                window.location.href =
                  "/forgot-password"
              }

              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >

              Forgot Password?

            </span>

          </div>

          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              fontSize: "12px",
              color: "#64748b"
            }}
          >

            🔒 Secure JWT Authentication

            <br />

            © 2027 Bauchi State Election Situation Room

            <br />

            Powered by MBR Design Technologies

            <br />

            Version 1.0.0

          </div>

        </div>

      </div>

    </div>
  );
}

const containerStyle = {

  minHeight: "100vh",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  padding: "20px",

  background:
    "linear-gradient(135deg,#eaf2ff,#f8fafc)"
};

const wrapperStyle = {

  width: "100%",

  maxWidth: "1000px",

  display: "flex",

  flexWrap: "wrap",

  backgroundColor: "#ffffff",

  borderRadius: "18px",

  overflow: "hidden",

  boxShadow:
    "0 20px 40px rgba(0,0,0,0.15)"
};

const leftPanelStyle = {

  flex: 1,

  minWidth: "320px",

  padding: "50px",

  background:
    "linear-gradient(135deg,#0f172a,#1e3a8a)",

  color: "#ffffff",

  display: "flex",

  flexDirection: "column",

  justifyContent: "center"
};

const cardStyle = {

  flex: 1,

  minWidth: "320px",

  padding: "50px",

  backgroundColor: "#ffffff",

  display: "flex",

  flexDirection: "column",

  justifyContent: "center"
};

const systemTitleStyle = {

  marginBottom: "10px"
};

const loginTitleStyle = {

  marginBottom: "30px",

  textAlign: "center"
};

const featureStyle = {

  marginBottom: "12px",

  fontSize: "15px"
};

const inputStyle = {

  width: "100%",

  padding: "14px",

  marginBottom: "15px",

  borderRadius: "8px",

  border: "1px solid #d1d5db",

  boxSizing: "border-box",

  fontSize: "15px"
};

const buttonStyle = {

  width: "100%",

  padding: "14px",

  backgroundColor: "#16a34a",

  color: "#ffffff",

  border: "none",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "bold",

  fontSize: "15px"
};

export default Login;
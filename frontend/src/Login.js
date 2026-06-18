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

const [isMobile, setIsMobile] =
useState(
window.innerWidth < 768
);

useEffect(() => {

setEmail("");
setPassword("");

localStorage.removeItem(
  "loginEmail"
);

}, []);

useEffect(() => {

const handleResize = () => {

  setIsMobile(
    window.innerWidth < 768
  );

};

window.addEventListener(
  "resize",
  handleResize
);

return () => {

  window.removeEventListener(
    "resize",
    handleResize
  );

};

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

    if (!email.trim() || !password.trim()) {

  alert(
    "Please enter email and password"
  );

  return;
}

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

maxWidth: "1100px",

display: "flex",

flexDirection:
  isMobile
    ? "column"
    : "row",

backgroundColor: "#ffffff",

borderRadius: "20px",

overflow: "hidden",

boxShadow:
  "0 20px 50px rgba(0,0,0,0.15)"

};

const leftPanelStyle = {

flex: 1,

minWidth: "320px",

padding:
  isMobile
    ? "35px"
    : "50px",

background:
  "linear-gradient(135deg,#0f172a,#1e3a8a)",

color: "#ffffff",

display: "flex",

flexDirection: "column",

justifyContent: "center",

alignItems:
  isMobile
    ? "center"
    : "flex-start",

textAlign:
  isMobile
    ? "center"
    : "left"

};

const cardStyle = {

flex: 1,

minWidth: "320px",

padding:
  isMobile
    ? "35px"
    : "50px",

backgroundColor: "#ffffff",

display: "flex",

flexDirection: "column",

justifyContent: "center"

};

const systemTitleStyle = {

marginBottom: "10px",

fontSize:
  isMobile
    ? "32px"
    : "42px",

fontWeight: "700"

};

const loginTitleStyle = {

marginBottom: "30px",

textAlign: "center",

fontSize:
  isMobile
    ? "30px"
    : "38px"

};

const featureStyle = {

marginBottom: "12px",

fontSize:
  isMobile
    ? "14px"
    : "16px"

};

const inputStyle = {

width: "100%",

padding: "15px",

marginBottom: "15px",

borderRadius: "8px",

border: "1px solid #d1d5db",

boxSizing: "border-box",

fontSize: "16px"

};

const buttonStyle = {

width: "100%",

padding: "16px",

backgroundColor: "#16a34a",

color: "#ffffff",

border: "none",

borderRadius: "8px",

cursor: "pointer",

fontWeight: "bold",

fontSize: "16px",

transition: "0.3s"

};

return (

<div style={containerStyle}>

  <div style={wrapperStyle}>

    <div style={leftPanelStyle}>

      <img
        src="/bauchi.png"
        alt="Bauchi Logo"
        style={{
          width:
            isMobile
              ? "90px"
              : "120px",

          height:
            isMobile
              ? "90px"
              : "120px",

          objectFit: "contain",

          marginBottom: "20px"
        }}
      />

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
      
      <div
  style={{
    textAlign: "center",
    marginBottom: "20px"
  }}
>

  <span
    style={{
      backgroundColor: "#dcfce7",
      color: "#166534",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold"
    }}
  >

    ● System Online

  </span>

</div>

      <form
        autoComplete="off"

        onSubmit={(e) => {

          e.preventDefault();

          handleLogin();

        }}
      >

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
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >

          {
            loading

              ? "Logging in..."

              : "Login"
          }

        </button>

      </form>

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
};

export default Login;
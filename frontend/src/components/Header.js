import React from "react";

function Header() {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const role =
    user?.role || "";

  const logout = () => {

    localStorage.clear();

    sessionStorage.clear();

    window.location.href =
      "/login";
  };

  return (

    <div
      style={{
        height: "70px",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
      }}
    >

      <div>

        <h3
          style={{
            margin: 0
          }}
        >
          Bauchi Election Dashboard
        </h3>

      </div>

      <div>

        <span
          style={{
            marginRight: "20px"
          }}
        >
          Role: {role}
        </span>

        <button
          onClick={logout}
          style={{
            background: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Header;
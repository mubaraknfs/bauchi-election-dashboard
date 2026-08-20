import React from "react";

import {
  Navigate
} from "react-router-dom";

function RoleRoute({
  children,
  allowedRoles
}) {

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  /*
  ================================
  NOT LOGGED IN
  ================================
  */

  if (!token || !user) {

    return (
      <Navigate to="/login" replace />
    );
  }

  /*
  ================================
  ROLE BLOCK
  ================================
  */

  if (
    !allowedRoles.includes(user.role)
  ) {

    return (
      <Navigate to="/login" replace />
    );
  }

  /*
  ================================
  ALLOW ACCESS
  ================================
  */

  return children;
}

export default RoleRoute;
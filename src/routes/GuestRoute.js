import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { checkJwtExistsAndExpired } from "../services/AuthService";

function GuestRoute() {
  const auth = checkJwtExistsAndExpired();

  // Redirect to dashboard if authenticated
  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the child components if not authenticated
  return <Outlet />;
}

export default GuestRoute;

import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const session = localStorage.getItem("ticketapp_session");
  return session ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

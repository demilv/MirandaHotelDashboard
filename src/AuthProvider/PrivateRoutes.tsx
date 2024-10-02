import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRoutesProps {
  children: React.ReactNode;
}

export const PrivateRoutes: React.FC<PrivateRoutesProps> = ({children}) => {
    const isLogged = localStorage.getItem("isLogged") === "true";
    return isLogged ? children : <Navigate to="/login"/>
}
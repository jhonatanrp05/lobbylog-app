import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate replace to="/packages" />;
  }

  if (user?.role === "RECEPTIONIST") {
    return <Navigate replace to="/packages/my-logged" />;
  }

  if (user?.role === "RESIDENT") {
    return <Navigate replace to="/packages/my" />;
  }

  return <Navigate replace to="/login" />;
}

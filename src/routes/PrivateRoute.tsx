import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { kullanici } = useAuth();

  return kullanici ? children : <Navigate to="/giris" />;
}

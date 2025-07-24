import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { kullanici } = useAuth();
  return kullanici ? children : <Navigate to="/giris" />;
}

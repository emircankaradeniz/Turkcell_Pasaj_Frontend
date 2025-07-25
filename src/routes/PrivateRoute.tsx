import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props): React.JSX.Element {
  const { kullanici } = useAuth();
  return kullanici ? <>{children}</> : <Navigate to="/giris" />;
}

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(null);

  const girisYap = (email, sifre) => {
    if (email === "admin@admin.com" && sifre === "1234") {
      setKullanici({ email });
      return true;
    }
    return false;
  };

  const cikisYap = () => setKullanici(null);

  return (
    <AuthContext.Provider value={{ kullanici, girisYap, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

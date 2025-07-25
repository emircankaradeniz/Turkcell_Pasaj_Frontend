import { createContext, useContext, useState, ReactNode } from "react";


interface Kullanici {
  email: string;
}

interface AuthContextType {
  kullanici: Kullanici | null;
  girisYap: (email: string, sifre: string) => boolean;
  cikisYap: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);

  const girisYap = (email: string, sifre: string): boolean => {
    if (email === "admin@admin.com" && sifre === "1234") {
      setKullanici({ email });
      return true;
    }
    return false;
  };

  const cikisYap = (): void => setKullanici(null);

  return (
    <AuthContext.Provider value={{ kullanici, girisYap, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AppUser {
  uid: string;
  email: string | null;
  rol: string; // admin | user
}

interface AuthContextType {
  kullanici: AppUser | null;
  loading: boolean;
  girisYap: (email: string, sifre: string) => Promise<UserCredential>;
  kayitOl: (email: string, sifre: string, rol?: string) => Promise<void>;
  cikisYap: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [kullanici, setKullanici] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Giriş yap
  const girisYap = (email: string, sifre: string) => {
    return signInWithEmailAndPassword(auth, email, sifre);
  };

  // 🔹 Kayıt ol (opsiyonel rol parametresi)
  const kayitOl = async (email: string, sifre: string, rol: string = "user") => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
    const uid = userCredential.user.uid;
    // Firestore'a kullanıcı ekle
    await setDoc(doc(db, "users", uid), {
      email,
      rol
    });
  };

  // 🔹 Çıkış yap
  const cikisYap = () => {
    return signOut(auth);
  };

  // 🔹 Firebase Auth değiştiğinde çalışır
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore'dan rol bilgisi al
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setKullanici({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            rol: data.rol || "user",
          });
        } else {
          // Firestore'da yoksa user olarak ekle
          await setDoc(doc(db, "users", firebaseUser.uid), {
            email: firebaseUser.email,
            rol: "user",
          });
          setKullanici({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            rol: "user",
          });
        }
      } else {
        setKullanici(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ kullanici, loading, girisYap, kayitOl, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

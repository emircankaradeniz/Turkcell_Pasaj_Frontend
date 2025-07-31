import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Urun } from "../types/Product";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";

export interface FavoriContextType {
  favoriler: Urun[];
  favorideMi: (urunId: string) => boolean;
  favoriEkleCikar: (urun: Urun) => void;
}

const FavoriContext = createContext<FavoriContextType>({} as FavoriContextType);

export function FavoriProvider({ children }: { children: ReactNode }) {
  const { kullanici } = useAuth();
  const [favoriler, setFavoriler] = useState<Urun[]>([]);

  // 📌 Anlık olarak favorileri çek
  useEffect(() => {
    if (!kullanici) {
      setFavoriler([]);
      return;
    }
    const ref = collection(db, "users", kullanici.uid, "favorites");
    const unsubscribe = onSnapshot(ref, (snap) => {
      const veri = snap.docs.map((d) => {
        const data = d.data() as Urun;
        return { ...data, id: d.id };
      });

      setFavoriler(veri);
    });
    return () => unsubscribe();
  }, [kullanici]);

  // 📌 Favoride mi?
  const favorideMi = (id: string) => favoriler.some((u) => u.id === id);

  // 📌 Favoriye ekle / çıkar
  const favoriEkleCikar = async (urun: Urun) => {
    if (!kullanici) return;
    const ref = doc(db, "users", kullanici.uid, "favorites", urun.id);
    if (favorideMi(urun.id)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, urun);
    }
  };

  return (
    <FavoriContext.Provider
      value={{
        favoriler,
        favorideMi,
        favoriEkleCikar
      }}
    >
      {children}
    </FavoriContext.Provider>
  );
}

export const useFavori = () => useContext(FavoriContext);

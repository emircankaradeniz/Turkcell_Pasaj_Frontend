import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Urun } from "../types/Product";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  increment
} from "firebase/firestore";

interface SepetContextType {
  sepet: Urun[];
  sepeteEkle: (urun: Urun) => void;
  adetArttir: (id: string) => void;
  adetAzalt: (id: string) => void;
  adetGuncelle: (id: string, yeniAdet: number) => void; // ✅ eklendi
  sepettenCikar: (id: string) => void;
}

const SepetContext = createContext<SepetContextType>({} as SepetContextType);

export function SepetProvider({ children }: { children: ReactNode }) {
  const { kullanici } = useAuth();
  const [sepet, setSepet] = useState<Urun[]>([]);

  // 📌 Anlık olarak Firestore'dan sepeti çek
  useEffect(() => {
    if (!kullanici) {
      setSepet([]);
      return;
    }
    const ref = collection(db, "users", kullanici.uid, "cart");
    const unsubscribe = onSnapshot(ref, (snap) => {
      const veri = snap.docs.map((d) => {
        const data = d.data() as Urun;
        return { ...data, id: d.id };
      });

      setSepet(veri);
    });
    return () => unsubscribe();
  }, [kullanici]);

  // 📌 Sepete ekle
  const sepeteEkle = async (urun: Urun) => {
    if (!kullanici) return;
    const ref = doc(db, "users", kullanici.uid, "cart", urun.id);
    await setDoc(ref, { ...urun, adet: 1 });
  };

  // 📌 Adet arttır
  const adetArttir = async (id: string) => {
    if (!kullanici) return;
    const ref = doc(db, "users", kullanici.uid, "cart", id);
    await updateDoc(ref, { adet: increment(1) });
  };

  // 📌 Adet azalt
  const adetAzalt = async (id: string) => {
    if (!kullanici) return;
    const ref = doc(db, "users", kullanici.uid, "cart", id);
    await updateDoc(ref, { adet: increment(-1) });
  };

  // 📌 Adeti doğrudan güncelle (0 veya altına düşerse ürünü siler)
  const adetGuncelle = async (id: string, yeniAdet: number) => {
    if (!kullanici) return;
    const ref = doc(db, "users", kullanici.uid, "cart", id);

    if (yeniAdet <= 0) {
      await deleteDoc(ref);
    } else {
      await updateDoc(ref, { adet: yeniAdet });
    }
  };

  // 📌 Sepetten çıkar
  const sepettenCikar = async (id: string) => {
    if (!kullanici) return;
    await deleteDoc(doc(db, "users", kullanici.uid, "cart", id));
  };

  return (
    <SepetContext.Provider
      value={{
        sepet,
        sepeteEkle,
        adetArttir,
        adetAzalt,
        adetGuncelle, // ✅ buraya eklendi
        sepettenCikar
      }}
    >
      {children}
    </SepetContext.Provider>
  );
}

export const useSepet = () => useContext(SepetContext);

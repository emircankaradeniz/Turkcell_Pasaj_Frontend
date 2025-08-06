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
  adetArttir: (id: string, saticiAdi?: string) => void;
  adetAzalt: (id: string, saticiAdi?: string) => void;
  adetGuncelle: (id: string, yeniAdet: number, saticiAdi?: string) => void;
  sepettenCikar: (id: string, saticiAdi?: string) => void;
}

const SepetContext = createContext<SepetContextType>({} as SepetContextType);

export function SepetProvider({ children }: { children: ReactNode }) {
  const { kullanici } = useAuth();
  const [sepet, setSepet] = useState<Urun[]>([]);

  // 📌 Firestore’dan anlık sepet verisi
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

  // 📌 Firestore belge ID oluşturucu (ürün + satıcı)
  const getDocId = (urun: Urun) => {
    return urun.secilenSatici
      ? `${urun.id}_${urun.secilenSatici.ad}`
      : urun.id;
  };

  // 📌 Sepete ekle
  const sepeteEkle = async (urun: Urun) => {
    if (!kullanici) return;
    const ref = doc(db, "users", kullanici.uid, "cart", getDocId(urun));
    await setDoc(ref, { ...urun, adet: 1 });
  };

  // 📌 Adet arttır
  const adetArttir = async (id: string, saticiAdi?: string) => {
    if (!kullanici) return;
    const ref = doc(
      db,
      "users",
      kullanici.uid,
      "cart",
      saticiAdi ? `${id}_${saticiAdi}` : id
    );
    await updateDoc(ref, { adet: increment(1) });
  };

  // 📌 Adet azalt
  const adetAzalt = async (id: string, saticiAdi?: string) => {
    if (!kullanici) return;
    const ref = doc(
      db,
      "users",
      kullanici.uid,
      "cart",
      saticiAdi ? `${id}_${saticiAdi}` : id
    );
    await updateDoc(ref, { adet: increment(-1) });
  };

  // 📌 Adet güncelle
  const adetGuncelle = async (id: string, yeniAdet: number, saticiAdi?: string) => {
    if (!kullanici) return;
    const ref = doc(
      db,
      "users",
      kullanici.uid,
      "cart",
      saticiAdi ? `${id}_${saticiAdi}` : id
    );
    if (yeniAdet <= 0) {
      await deleteDoc(ref);
    } else {
      await updateDoc(ref, { adet: yeniAdet });
    }
  };

  // 📌 Sepetten çıkar
  const sepettenCikar = async (id: string, saticiAdi?: string) => {
    if (!kullanici) return;
    await deleteDoc(
      doc(db, "users", kullanici.uid, "cart", saticiAdi ? `${id}_${saticiAdi}` : id)
    );
  };

  return (
    <SepetContext.Provider
      value={{
        sepet,
        sepeteEkle,
        adetArttir,
        adetAzalt,
        adetGuncelle,
        sepettenCikar
      }}
    >
      {children}
    </SepetContext.Provider>
  );
}

export const useSepet = () => useContext(SepetContext);

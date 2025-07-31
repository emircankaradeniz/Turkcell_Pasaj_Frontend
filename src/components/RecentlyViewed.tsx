import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";

interface Urun {
  id: string;
  ad: string;
  fiyat: number;
  gorsel: string;
}

export default function SonIncelenenler() {
  const { kullanici } = useAuth();
  const [urunler, setUrunler] = useState<Urun[]>([]);

  useEffect(() => {
    if (!kullanici) return;

    const ref = collection(db, "users", kullanici.uid, "recentlyViewed");
    const q = query(ref, orderBy("tarih", "desc"), limit(10));

    const unsub = onSnapshot(q, (snap) => {
      const liste: Urun[] = snap.docs.map((doc) => doc.data() as Urun);
      setUrunler(liste);
    });

    return () => unsub();
  }, [kullanici]);

  if (!urunler.length) return null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Son İncelenenler</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {urunler.map((urun) => (
          <div key={urun.id} className="border rounded-lg p-2 shadow-sm">
            <img src={urun.gorsel} alt={urun.ad} className="w-full h-40 object-cover rounded" />
            <h3 className="mt-2 font-medium">{urun.ad}</h3>
            <p className="text-blue-600 font-bold">{urun.fiyat} TL</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useLocation } from "react-router-dom";
import { Urun } from "../types/Product";
import UrunCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { db } from "../firebase"; // kendi firebase config'in
import { collection, getDocs } from "firebase/firestore";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Kategori() {
  const query = useQuery();
  const kategori = query.get("kategori");
  const altKategori = query.get("altKategori");

  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urunleriGetir = async () => {
      setLoading(true);

      // Firestore'dan ürünleri çek
      const snap = await getDocs(collection(db, "urunler"));
      const tumUrunler: Urun[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Urun, "id">),
      }));

      // Filtreleme
      const filtrelenmis = tumUrunler.filter((urun) => {
        if (altKategori) {
          return urun.altKategori?.toLowerCase() === altKategori.toLowerCase();
        }
        if (kategori) {
          return urun.kategori?.toLowerCase() === kategori.toLowerCase();
        }
        return true;
      });

      setUrunler(filtrelenmis);
      setLoading(false);
    };

    urunleriGetir();
  }, [kategori, altKategori]);

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {altKategori
          ? `${altKategori} ürünleri`
          : kategori
          ? `${kategori} kategorisindeki ürünler`
          : "Tüm Ürünler"}
      </h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : urunler.length === 0 ? (
        <p>Ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {urunler.map((urun) => (
            <UrunCard key={urun.id} urun={urun} />
          ))}
        </div>
      )}
    </div>
  );
}

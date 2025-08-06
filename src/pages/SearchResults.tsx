import { useLocation } from "react-router-dom";
import { Urun } from "../types/Product";
import { useEffect, useState } from "react";
import { db } from "../firebase"; // Firebase config dosyan
import { collection, getDocs, query, where } from "firebase/firestore";

export default function SearchResults() {
  const location = useLocation();
  const [sonuclar, setSonuclar] = useState<Urun[]>([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const arama = queryParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const urunleriGetir = async () => {
      setLoading(true);

      // Firestore tüm ürünleri çek
      const q = collection(db, "urunler");
      const snap = await getDocs(q);
      const tumUrunler: Urun[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Urun, "id">),
      }));

      // Arama kelimesine göre filtrele
      const filtrelenmis = tumUrunler.filter((urun) =>
        urun.ad.toLowerCase().includes(arama)
      );

      setSonuclar(filtrelenmis);
      setLoading(false);
    };

    urunleriGetir();
  }, [arama]);

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Arama Sonuçları: "{arama}"
      </h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : sonuclar.length === 0 ? (
        <p>Sonuç bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {sonuclar.map((urun) => (
            <div
              key={urun.id}
              className="border p-3 sm:p-4 rounded shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={urun.gorsel}
                alt={urun.ad}
                className="w-full h-32 sm:h-40 object-contain"
              />
              <h3 className="mt-2 font-semibold text-sm sm:text-base line-clamp-2">
                {urun.ad}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                {urun.aciklama}
              </p>
              <p className="text-blue-600 font-bold mt-1 text-sm sm:text-base">
                {urun.fiyat.toLocaleString("tr-TR")} ₺
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

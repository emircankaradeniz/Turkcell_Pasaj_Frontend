import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useFavori } from "../context/FavoriteContext";
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Urun } from "../types/Product";

export default function SonIncelenenler() {
  const { kullanici } = useAuth();
  const { favorideMi, favoriEkleCikar } = useFavori();
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const solaKaydir = () => {
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const sagaKaydir = () => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  useEffect(() => {
    if (!kullanici) return;

    const ref = collection(db, "users", kullanici.uid, "recentlyViewed");
    const q = query(ref, orderBy("tarih", "desc"), limit(10));

    const unsub = onSnapshot(q, (snap) => {
      const liste: Urun[] = snap.docs.map((doc) => {
        const data = doc.data() as Partial<Urun>;
        return {
          id: data.id || doc.id,
          ad: data.ad || "",
          fiyat: data.fiyat || 0,
          gorsel: data.gorsel || "",
          aciklama: data.aciklama || "",
          kategori: data.kategori || "",
          kategoriId: data.kategoriId || "",
        };
      });
      setUrunler(liste);
    });

    return () => unsub();
  }, [kullanici]);

  if (!urunler.length) return null;

  return (
    <div className="my-12 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Son İncelenenler</h2>

      <div className="relative max-w-screen-xl mx-auto">
        {/* Sol Ok */}
        <button
          onClick={solaKaydir}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100"
        >
          <FaChevronLeft />
        </button>

        {/* Ürün Listesi */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth px-6 py-4 no-scrollbar"
        >
          {urunler.map((urun) => (
            <div
              key={urun.id}
              className="relative flex-shrink-0 min-w-[160px] sm:min-w-[200px] lg:min-w-[230px]"
            >
              {/* Favori Butonu */}
              <button
                data-testid="fav-btn"
                onClick={() => favoriEkleCikar(urun)}
                className="absolute top-2 right-2 z-10 text-red-500 hover:scale-110 transition"
              >
                {favorideMi(urun.id) ? <FaHeart /> : <FaRegHeart />}
              </button>

              <Link to={`/urun/${urun.id}`}>
                <div className="bg-white shadow rounded-xl p-3 sm:p-4 hover:shadow-lg transition border hover:border-yellow-500 flex flex-col h-full">
                  <div className="text-xs text-blue-500 font-bold mb-2">
                    Son İncelenen
                  </div>
                  <img
                    src={urun.gorsel}
                    alt={urun.ad}
                    className="w-full h-28 sm:h-32 lg:h-40 object-contain mb-3"
                  />
                  <p className="font-semibold line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                    {urun.ad}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[36px] mt-1">
                    {urun.aciklama.length > 60 ? (
                      <>
                        {urun.aciklama.slice(0, 60)}...
                        <span className="text-blue-500"> Devamını Oku</span>
                      </>
                    ) : (
                      urun.aciklama
                    )}
                  </p>
                  <p className="mt-auto text-blue-600 font-bold">
                    {typeof urun.fiyat === "number"
                      ? urun.fiyat.toLocaleString("tr-TR") + " TL"
                      : urun.fiyat}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Sağ Ok */}
        <button
          onClick={sagaKaydir}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

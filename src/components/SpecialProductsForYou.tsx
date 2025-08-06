import { useRef, useEffect, useState } from "react";
import { Urun } from "../types/Product";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function SanaOzelUrunler() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [loading, setLoading] = useState(true);

  const solaKaydir = () => {
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const sagaKaydir = () => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  useEffect(() => {
    const urunleriGetir = async () => {
      try {
        const snap = await getDocs(collection(db, "urunler"));
        const data: Urun[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Urun, "id">),
        }));
        setUrunler(data.slice(0, 10));
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    urunleriGetir();
  }, []);

  return (
    <div className="relative max-w-screen-xl mx-auto mt-8 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Sana Özel Ürünler</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : urunler.length === 0 ? (
        <p>Ürün bulunamadı.</p>
      ) : (
        <div className="relative">
          {/* Sol ok (mobilde gizli) */}
          <button
            onClick={solaKaydir}
            className="hidden sm:flex absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>

          {/* Ürün listesi */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth no-scrollbar px-1 sm:px-6 py-4"
          >
            {urunler.map((urun) => (
              <Link to={`/urun/${urun.id}`} key={urun.id}>
                <div className="flex-shrink-0 min-w-[160px] sm:min-w-[200px] lg:min-w-[220px] border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition bg-white hover:border-yellow-500 flex flex-col h-full">
                  <img
                    src={urun.gorsel}
                    alt={urun.ad}
                    className="w-full h-28 sm:h-32 lg:h-40 object-contain mb-2"
                  />
                  <p className="font-semibold text-sm sm:text-base line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                    {urun.ad}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 min-h-[32px]">
                    {urun.aciklama.length > 60
                      ? `${urun.aciklama.slice(0, 60)}...`
                      : urun.aciklama}
                  </p>
                  <p className="text-blue-600 font-bold mt-auto text-sm sm:text-base">
                    {urun.fiyat.toLocaleString("tr-TR")} TL
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Sağ ok (mobilde gizli) */}
          <button
            onClick={sagaKaydir}
            className="hidden sm:flex absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

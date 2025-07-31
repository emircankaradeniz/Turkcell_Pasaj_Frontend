import { useRef, useEffect, useState } from "react";
import { Urun } from "../types/Product";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // 🔹 Firebase config
import { collection, getDocs } from "firebase/firestore";

export default function SanaOzelUrunler() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [loading, setLoading] = useState(true);

  const solaKaydir = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const sagaKaydir = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const urunleriGetir = async () => {
      try {
        const snap = await getDocs(collection(db, "urunler"));
        const data: Urun[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Urun, "id">),
        }));
        setUrunler(data.slice(0, 10)); // İlk 10 ürün
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    urunleriGetir();
  }, []);

  return (
    <div className="relative max-w-screen-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Sana Özel Ürünler</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : urunler.length === 0 ? (
        <p>Ürün bulunamadı.</p>
      ) : (
        <div className="relative">
          <button
            onClick={solaKaydir}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 scroll-smooth px-8 py-4 no-scrollbar"
          >
            {urunler.map((urun) => (
              <Link to={`/urun/${urun.id}`} key={urun.id}>
                <div className="min-w-[220px] border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white hover:border-yellow-500">
                  <img
                    src={urun.gorsel}
                    alt={urun.ad}
                    className="w-full h-40 object-contain mb-2"
                  />
                  <p className="font-semibold">{urun.ad}</p>
                  <p className="text-sm text-gray-500">{urun.aciklama}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    {urun.fiyat.toLocaleString()} TL
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={sagaKaydir}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

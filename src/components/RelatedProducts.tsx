import { useRef, useEffect, useState } from "react";
import { Urun } from "../types/Product";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useFavori } from "../context/FavoriteContext";

export default function IlginiziCekebilir() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { favoriler } = useFavori();
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [loading, setLoading] = useState(true);

  const solaKaydir = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const sagaKaydir = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    if (favoriler.length === 0) {
      setLoading(false);
      return;
    }

    const favoriKategoriler = [
      ...new Set(favoriler.map((u) => u.kategori).filter(Boolean)),
    ];

    const urunleriGetir = async () => {
      try {
        const q = query(
          collection(db, "urunler"),
          where("kategori", "in", favoriKategoriler)
        );
        const snap = await getDocs(q);
        const data: Urun[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Urun, "id">),
        }));
        setUrunler(data);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    urunleriGetir();
  }, [favoriler]);

  if (loading) return <p>Yükleniyor...</p>;
  if (urunler.length === 0) return null;

  return (
    <div className="relative max-w-screen-xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">İlginizi çekebilecek ürünler</h2>

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
              <div className="min-w-[230px] border rounded-lg shadow-sm hover:shadow-md transition bg-white hover:border-yellow-500">
                <img
                  src={urun.gorsel}
                  alt={urun.ad}
                  className="w-full h-44 object-contain p-4"
                />
                <div className="p-4">
                  <p className="font-medium">{urun.ad}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Faturana Ek 3 Taksit
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                      Faturanla Öde
                    </span>
                  </div>
                  <p className="text-blue-600 font-bold mt-2">
                    {urun.fiyat.toLocaleString("tr-TR")} TL
                  </p>
                </div>
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
    </div>
  );
}

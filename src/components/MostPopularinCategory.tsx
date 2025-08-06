import { useRef, useState, useEffect } from "react";
import { Urun } from "../types/Product";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

interface Props {
  kategori?: string;
  altKategori?: string;
}

export default function MostPopulerCategory({ kategori, altKategori }: Props) {
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
        let q;

        if (altKategori) {
          q = query(collection(db, "urunler"), where("altKategori", "==", altKategori));
        } else if (kategori) {
          q = query(collection(db, "urunler"), where("kategori", "==", kategori));
        } else {
          q = collection(db, "urunler");
        }

        const snap = await getDocs(q);
        const data: Urun[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Urun, "id">),
        }));

        setUrunler(data.slice(0, 10));
      } catch (err) {
        console.error("Ürünler alınırken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    urunleriGetir();
  }, [kategori, altKategori]);

  return (
    <div className="relative max-w-screen-xl mx-auto mb-8 px-2 sm:px-4">
      <h2 className="text-lg font-semibold mb-3">Kategorinin En Sevilenleri</h2>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : urunler.length === 0 ? (
        <p>Bu kategoride ürün bulunamadı.</p>
      ) : (
        <div className="relative">
          {/* Sol ok */}
          <button
            onClick={solaKaydir}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100 hidden sm:flex"
          >
            <FaChevronLeft />
          </button>

          {/* Kaydırılabilir alan */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
          >
            {urunler.map((urun) => (
              <Link to={`/urun/${urun.id}`}>
              <div
                key={urun.id}
                className="flex-shrink-0 min-w-[150px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[250px] border rounded-lg p-3 bg-white hover:shadow-md transition"
              >
                <img
                  src={urun.gorsel}
                  alt={urun.ad}
                  className="w-full h-32 sm:h-36 md:h-40 object-contain mb-2"
                />
                <div className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{urun.ad}</div>
                <div className="text-blue-600 font-bold mt-1">
                  {urun.fiyat?.toLocaleString("tr-TR")} TL
                </div>
              </div></Link>
            ))}
          </div>

          {/* Sağ ok */}
          <button
            onClick={sagaKaydir}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100 hidden sm:flex"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}

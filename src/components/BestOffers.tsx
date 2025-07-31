import { useEffect, useState } from "react";
import { Urun } from "../types/Product";
import { Link } from "react-router-dom";
import { useFavori } from "../context/FavoriteContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase"; // kendi firebase config yoluna göre düzenle

export default function EnIyiTeklifler() {
  const [teklifler, setTeklifler] = useState<Urun[]>([]);
  const { favoriler, favoriEkleCikar } = useFavori();

  useEffect(() => {
    const urunleriGetir = async () => {
      try {
        const q = query(collection(db, "urunler"), limit(4)); // en fazla 4 ürün
        const snapshot = await getDocs(q);
        const veri: Urun[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Urun, "id">),
        }));
        setTeklifler(veri);
      } catch (err) {
        console.error("Ürünler çekilirken hata oluştu:", err);
      }
    };

    urunleriGetir();
  }, []);

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6 px-4">En İyi Teklifler</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {teklifler.map((urun) => {
          const favorideMi = favoriler.some((f) => f.id === urun.id);
          return (
            <div
              key={urun.id}
              className="relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border hover:border-yellow-500"
            >
              {/* Favori Kalp İkonu */}
              <button
                onClick={() => favoriEkleCikar(urun)}
                className="absolute top-2 right-2 z-10 text-red-500 text-lg"
              >
                {favorideMi ? <FaHeart /> : <FaRegHeart />}
              </button>

              <Link to={`/urun/${urun.id}`}>
                {/* Etiket */}
                <div className="px-3 py-1 bg-orange-400 text-white text-xs font-bold w-fit rounded-br-xl">
                  Çok Satan
                </div>

                {/* Görsel */}
                <img
                  src={urun.gorsel}
                  alt={urun.ad}
                  className="w-full h-52 object-contain p-4"
                />

                {/* Başlık ve Açıklama */}
                <div className="p-4">
                  <h3 className="text-base font-semibold">{urun.ad}</h3>

                  {/* Yıldız ve Puan */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-yellow-500">★ ★ ★ ★ ☆</div>
                    <span className="text-sm text-gray-600">4,5</span>
                  </div>

                  {/* Özellik Rozetleri */}
                  <div className="flex flex-wrap gap-1 mt-2 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Pasaj Limitinle Öde
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Ücretsiz Kargo
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Hızlı Teslimat
                    </span>
                  </div>

                  {/* Fiyat */}
                  <p className="text-xl text-blue-700 font-bold mt-4">
                    {urun.fiyat.toLocaleString("tr-TR")} TL
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

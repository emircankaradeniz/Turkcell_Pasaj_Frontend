import { useState, useEffect } from "react";
import { Urun } from "../types/Product";
import { KategoriEnum, KategoriAdlari } from "../types/Categori";
import { Link } from "react-router-dom";
import { useFavori } from "../context/FavoriteContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function CokSatanlar() {
  const [aktifKategori, setAktifKategori] = useState<KategoriEnum>(KategoriEnum.Telefon);
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const { favorideMi, favoriEkleCikar } = useFavori();

  useEffect(() => {
    const urunleriGetir = async () => {
      try {
        // Firestore'dan kategoriye göre ürünleri çek
        const q = query(
          collection(db, "urunler"),
          where("kategori", "==", KategoriAdlari[aktifKategori])
        );
        const snapshot = await getDocs(q);

        // Firestore ID ile kaydet
        const veri: Urun[] = snapshot.docs.map((doc) => ({
          id: doc.id, // Firestore document ID
          ...(doc.data() as Omit<Urun, "id">),
        }));

        setUrunler(veri);
      } catch (err) {
        console.error("Ürünler çekilirken hata oluştu:", err);
      }
    };

    urunleriGetir();
  }, [aktifKategori]);

  return (
    <div className="my-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Çok Satanlar</h2>

      {/* Sekmeli kategori menü */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {Object.values(KategoriEnum).map((kategori) => (
          <button
            key={kategori}
            onClick={() => setAktifKategori(kategori)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
              aktifKategori === kategori
                ? "bg-yellow-400 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {KategoriAdlari[kategori]}
          </button>
        ))}
      </div>

      {/* Ürünler listesi */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {urunler.map((urun) => (
          <div key={urun.id} className="relative">
            {/* Favori ikonu */}
            <button
              onClick={() => favoriEkleCikar(urun)}
              className="absolute top-2 right-2 z-10 text-red-500 hover:scale-110 transition"
            >
              {favorideMi(urun.id) ? <FaHeart /> : <FaRegHeart />}
            </button>

            <Link to={`/urun/${urun.id}`}>
              <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition border hover:border-yellow-500">
                <div className="text-xs text-orange-500 font-bold mb-2">Çok Satan</div>
                <img
                  src={urun.gorsel}
                  alt={urun.ad}
                  className="w-full h-40 object-contain mb-4"
                />
                <p className="font-semibold">{urun.ad}</p>
                <p className="text-sm text-gray-500">{urun.aciklama}</p>
                <p className="mt-2 text-blue-600 font-bold">
                  {urun.fiyat.toLocaleString("tr-TR")} TL
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

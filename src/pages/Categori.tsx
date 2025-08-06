import { useLocation, useNavigate } from "react-router-dom";
import { Urun } from "../types/Product";
import UrunCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import MostPopulerCategory from "../components/MostPopularinCategory";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Kategori() {
  const query = useQuery();
  const navigate = useNavigate();

  const kategori = query.get("kategori");
  const altKategori = query.get("altKategori");

  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [altKategoriler, setAltKategoriler] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobilFiltreAcik, setMobilFiltreAcik] = useState(false);

  // 🔹 Aktif kategorinin alt kategorilerini Firestore'dan çek
  useEffect(() => {
    const altKategorileriGetir = async () => {
      if (!kategori) return;
      try {
        const docRef = doc(db, "kategoriler", kategori);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setAltKategoriler(data.altKategoriler || []);
        }
      } catch (err) {
        console.error("Alt kategoriler alınamadı:", err);
      }
    };

    altKategorileriGetir();
  }, [kategori]);

  // 🔹 Ürünleri kategori / altKategori'ye göre çek
  useEffect(() => {
    const urunleriGetir = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "urunler"));
      const tumUrunler: Urun[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Urun, "id">),
      }));

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

  // 🔹 Alt kategori seçildiğinde URL'i güncelle
  const handleAltKategoriSec = (alt: string) => {
    navigate(`?kategori=${kategori}&altKategori=${encodeURIComponent(alt)}`);
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {/* Sayfa Başlığı */}
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {altKategori
          ? `${altKategori}`
          : kategori
          ? `${kategori}`
          : "Tüm Ürünler"}
      </h1>

      {/* Kategorinin En Sevilenleri */}
      <MostPopulerCategory
        kategori={kategori || ""}
        altKategori={altKategori || ""}
      />

      {/* Mobilde filtre açma butonu */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobilFiltreAcik(!mobilFiltreAcik)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {mobilFiltreAcik ? "Filtreleri Gizle" : "Filtreleri Göster"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sol Filtre Paneli */}
        {(mobilFiltreAcik || window.innerWidth >= 1024) && (
          <aside className="w-full lg:w-64">
            {/* Alt Kategoriler */}
            <div className="border rounded-lg p-4 bg-white mb-4">
              <h3 className="font-bold mb-2">Kategoriler</h3>
              <ul className="space-y-1 text-sm">
                {altKategoriler.length > 0 ? (
                  altKategoriler.map((alt) => (
                    <li
                      key={alt}
                      onClick={() => handleAltKategoriSec(alt)}
                      className={`cursor-pointer hover:underline ${
                        altKategori === alt ? "font-bold text-blue-600" : ""
                      }`}
                    >
                      {alt}
                    </li>
                  ))
                ) : (
                  <li>Alt kategori bulunamadı</li>
                )}
              </ul>
            </div>

            {/* Markalar */}
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="font-bold mb-2">Markalar</h3>
              <ul className="space-y-1 text-sm">
                <li>Acer</li>
                <li>Lenovo</li>
                <li>Casper</li>
                <li>Apple</li>
              </ul>
            </div>
          </aside>
        )}

        {/* Ürün Listesi */}
        <main className="flex-1">
          {loading ? (
            <p>Yükleniyor...</p>
          ) : urunler.length === 0 ? (
            <p>Ürün bulunamadı.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {urunler.map((urun) => (
                <UrunCard key={urun.id} urun={urun} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

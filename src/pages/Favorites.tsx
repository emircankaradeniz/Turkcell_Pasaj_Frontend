import { useState, ChangeEvent, useEffect } from "react";
import { useFavori } from "../context/FavoriteContext";
import { Urun } from "../types/Product";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RelatedProduct from "../components/RelatedProducts";
import {
  FaBoxOpen,
  FaGift,
  FaQuestionCircle,
  FaUser,
  FaCreditCard,
  FaStar,
  FaChartBar,
  FaHeart
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Favoriler() {
  const { favoriler } = useFavori();
  const { kullanici } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!kullanici) navigate("/giris");
  }, [kullanici, navigate]);

  const [arama, setArama] = useState<string>("");
  const [kategori, setKategori] = useState<string>("tumu");

  const kategoriler = [...new Set(favoriler.map((u: Urun) => u.kategori).filter(Boolean))];
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);

  const filtrelenmisFavoriler = favoriler
    .filter((u: Urun) => u.ad.toLowerCase().includes(arama.toLowerCase()))
    .filter((u: Urun) => kategori === "tumu" || u.kategori === kategori);

  return (
    <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto mt-6 gap-6 p-4">
      {/* Mobil menü butonu */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobilMenuAcik(!mobilMenuAcik)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {mobilMenuAcik ? "Menüyü Gizle" : "Menüyü Göster"}
        </button>
      </div>

      {/* Sol Menü */}
      {(mobilMenuAcik || window.innerWidth >= 1024) && (
        <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm border p-4 text-gray-700 text-sm">
          <ul className="space-y-4">
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <FaChartBar /> Pasaj Limitini Öğren
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <FaBoxOpen /> Siparişlerim
            </li>
            <li className="flex items-center gap-2 text-blue-600 font-semibold">
              <FaHeart className="text-blue-600" /> Favorilerim
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <FaGift /> Hediye Çeklerim
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <FaStar /> Değerlendirmelerim
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <FaQuestionCircle /> Ürün Sorularım
            </li>
            <Link
              to={"/hesap"}
              className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
            >
              <FaUser /> Kullanıcı Bilgilerim
            </Link>
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
              <FaCreditCard /> Kayıtlı Kartlarım
            </li>
          </ul>
        </div>
      )}

      {/* Sağ İçerik */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Favorilerim</h1>

        {/* Arama ve Kategori */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={arama}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setArama(e.target.value)
            }
            placeholder="Ürün ara..."
            className="border px-3 py-2 rounded w-full sm:w-64"
          />
          <select
            value={kategori}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setKategori(e.target.value)
            }
            className="border p-2 rounded w-full sm:w-64"
          >
            <option value="tumu">Tümü</option>
            {kategoriler.map((k, i) => (
              <option key={i} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* Ürün Listesi */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtrelenmisFavoriler.length === 0 ? (
            <p className="text-gray-500">Favorilerde eşleşen ürün yok.</p>
          ) : (
            filtrelenmisFavoriler.map((urun: Urun) => (
              <div
                key={urun.id}
                className="bg-white border rounded-lg shadow-sm overflow-hidden relative group hover:shadow-lg transition"
              >
                {/* Sarı Kalp */}
                <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow">
                  <FaHeart className="text-yellow-400 text-lg" />
                </div>

                {/* Ürün Görseli */}
                <div className="flex justify-center mt-4">
                  <img
                    src={urun.gorsel}
                    alt={urun.ad}
                    className="w-28 h-28 sm:w-40 sm:h-40 object-contain"
                  />
                </div>

                {/* Slider Noktaları */}
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === 0 ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    ></span>
                  ))}
                </div>

                {/* Ürün Adı */}
                <div className="px-4 mt-3 font-medium text-sm text-gray-800 text-center sm:text-left">
                  {urun.ad}
                </div>

                {/* Fiyat Bilgisi */}
                <div className="px-4 pb-4 mt-2 text-center sm:text-left">
                  <div className="text-blue-600 font-bold text-lg">
                    {urun.fiyat.toLocaleString("tr-TR")}₺
                  </div>
                  <div className="text-gray-500 text-xs">
                    {Math.round(urun.fiyat / 3).toLocaleString("tr-TR")}₺ x 3
                    Ay
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <br />
        <RelatedProduct />
        <br />
      </div>
    </div>
  );
}

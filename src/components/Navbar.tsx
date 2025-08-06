import { Link, useNavigate } from "react-router-dom";
import { useSepet } from "../context/BasketContext";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import AramaKutusu from "../components/SearchBox";
import Kategoriler from "../components/Categories";

export default function Navbar() {
  const { sepet } = useSepet();
  const { kullanici } = useAuth();
  const toplamAdet = sepet.reduce((acc, u) => acc + (u.adet ?? 0), 0);
  const navigate = useNavigate();

  const handleSepetTiklama = () => {
    if (!kullanici) {
      // ✅ Giriş yapmamışsa login sayfasına yönlendir
      navigate("/giris");
    } else {
      // ✅ Giriş yapmışsa sepet sayfasına git
      navigate("/sepet");
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      {/* Üst Menü */}
      <div className="hidden lg:flex justify-between items-center max-w-screen-xl mx-auto px-4 py-2 text-sm text-gray-600">
        <span className="text-gray-400">turkcell.com.tr</span>
        <div className="flex gap-4 flex-wrap">
          <Link to="/favoriler">Favorilerim</Link>
          <a href="https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar">Kampanyalar</a>
          <a href="https://www.turkcell.com.tr/destek/online-alisveris">Yardım</a>
          <a href="https://www.turkcell.com.tr/pasaj#passageWhyUsInfo">Neden Pasaj?</a>
          <a href="https://pasajblog.turkcell.com.tr/">Pasaj Blog</a>
          <a href="#">Sipariş Sorgulama</a>
          <a href="https://www.turkcell.com.tr/pasaj/markalar">Markalar</a>
        </div>
      </div>

      {/* Logo + Arama + Kullanıcı + Sepet */}
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Logo */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/PasajLogo.png" alt="logo" className="w-[100px]" />
          </Link>
        </div>

        {/* Arama Kutusu */}
        <AramaKutusu />

        {/* Kullanıcı ve Sepet */}
        <div className="flex items-center gap-3">
          {!kullanici ? (
            <Link
              to="/giris"
              className="flex items-center gap-2 border px-3 py-2 rounded text-sm"
            >
              <FaUser />
              <span className="hidden sm:inline">Giriş Yap</span>
            </Link>
          ) : (
            <Link
              to="/hesap"
              className="flex items-center gap-2 border px-3 py-2 rounded text-sm"
            >
              <FaUser />
              <span className="hidden sm:inline">Hesabım</span>
            </Link>
          )}

          {/* Sepet Butonu */}
          <button
            onClick={handleSepetTiklama}
            className="relative bg-yellow-400 px-4 py-2 rounded flex items-center gap-1 font-semibold text-black text-sm"
          >
            <FaShoppingCart />
            <span className="hidden sm:inline">Sepet</span>
            {toplamAdet > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {toplamAdet}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Kategoriler */}
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <Kategoriler />
      </div>
    </div>
  );
}

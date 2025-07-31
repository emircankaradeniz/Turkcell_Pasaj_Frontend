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
    <div className="p-4 max-w-screen-xl mx-auto bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Üst Menü */}
      <div className="flex justify-between items-center px-6 py-2 text-sm text-gray-600">
        <span className="text-gray-400">turkcell.com.tr</span>
        <div className="flex gap-4">
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
      <div className="p-4 max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/PasajLogo.png" alt="logo" className="w-[100px]" />
        </Link>

        {/* Arama Kutusu */}
        <AramaKutusu />

        {/* Kullanıcı ve Sepet */}
        <div className="flex items-center gap-4">
          {!kullanici ? (
            <Link to="/giris" className="flex items-center gap-2 border px-4 py-2 rounded">
              <FaUser />
              <span>Giriş Yap</span>
            </Link>
          ) : (
            <Link to="/hesap" className="flex items-center gap-2 border px-4 py-2 rounded">
              <FaUser />
              <span>Hesabım</span>
            </Link>
          )}

          {/* Sepet Butonu */}
          <button
            onClick={handleSepetTiklama}
            className="relative bg-yellow-400 px-6 py-2 rounded flex items-center gap-2 font-semibold text-black"
          >
            <FaShoppingCart />
            Sepet
            {toplamAdet > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {toplamAdet}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="p-4 max-w-screen-xl mx-auto">
            <Kategoriler />
      </div>
    </div>
  );
}

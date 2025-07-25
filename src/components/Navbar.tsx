import { Link } from "react-router-dom";
import { useSepet } from "../context/SepetContext";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart, FaUser } from "react-icons/fa";

export default function Navbar() {
  const { sepet } = useSepet();
  const toplamAdet = sepet.reduce((acc, u) => acc + (u.adet ?? 0), 0);
  const { kullanici, cikisYap } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b">
      {/* Üst menü */}
      <div className="flex justify-between items-center px-6 py-2 text-sm text-gray-600">
        <span className="text-gray-400">turkcell.com.tr</span>
        <div className="flex gap-4">
          <Link to="/favoriler">Favorilerim</Link>
          <a href="#">Kampanyalar</a>
          <a href="#">Yardım</a>
          <a href="#">Neden Pasaj?</a>
          <a href="#">Pasaj Blog</a>
          <a href="#">Sipariş Sorgulama</a>
          <a href="#">Markalar</a>
        </div>
      </div>

      {/* Logo + Arama + Kullanıcı + Sepet */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo192.png" alt="logo" className="w-10 h-10" />
          <span className="text-2xl font-bold text-blue-900">Pasaj</span>
        </Link>

        {/* Arama Kutusu */}
        <input
          type="text"
          placeholder="Ürün, marka veya kategori ara"
          className="flex-1 mx-10 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 outline-none"
        />

        {/* Kullanıcı ve Sepet */}
        <div className="flex items-center gap-4">
          {!kullanici ? (
            <Link to="/giris" className="flex items-center gap-2 border px-4 py-2 rounded">
              <FaUser />
              <span>Giriş Yap</span>
            </Link>
          ) : (
            <button onClick={cikisYap} className="text-red-600 font-semibold">
              Çıkış Yap ({kullanici.email})
            </button>
          )}

          <Link
            to="/sepet"
            className="relative bg-yellow-400 px-6 py-2 rounded flex items-center gap-2 font-semibold text-black"
          >
            <FaShoppingCart />
            Sepet
            {toplamAdet > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {toplamAdet}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Alt Kategori Menüsü */}
      <div className="flex gap-6 px-6 pb-4 text-sm text-gray-700 border-t pt-3">
        <Link to="/kategori/cep">Cep Telefonu-Aksesuar</Link>
        <Link to="/kategori/bilgisayar">Bilgisayar-Tablet</Link>
        <Link to="/kategori/evaletleri">Elektrikli Ev Aletleri</Link>
        <Link to="/kategori/saglik">Sağlık-Kişisel Bakım</Link>
        <Link to="/kategori/hobi">Hobi-Oyun</Link>
        <Link to="/kategori/tv">TV-Ses Sistemleri</Link>
        <Link to="/kategori/evyasam">Ev-Yaşam</Link>
      </div>
    </div>
  );
}

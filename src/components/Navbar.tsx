import { Link } from "react-router-dom";
import { useSepet } from "../context/SepetContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { sepet } = useSepet();
  const toplamAdet = sepet.reduce((acc, u) => acc + (u.adet ?? 0), 0);
  const { kullanici, cikisYap } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Pasaj</Link>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-blue-600">Anasayfa</Link>
        <Link to="/favoriler" className="text-white hover:text-yellow-300 transition">Favorilerim</Link>
        <Link to="/kategori" className="hover:text-blue-600">Kategoriler</Link>
        <Link to="/kategori/telefon" className="hover:text-blue-600">Telefon</Link>
        <Link to="/kategori/aksesuar" className="hover:text-blue-600">Aksesuar</Link>
        <Link to="/sepet" className="hover:text-blue-600">Sepet ({toplamAdet})</Link>
        <Link to="/admin" className="hover:text-blue-600">Admin</Link>

        {!kullanici ? (
          <Link to="/giris" className="hover:text-blue-600">Giriş</Link>
        ) : (
          <button onClick={cikisYap} className="text-red-600 font-semibold">
            Çıkış Yap ({kullanici.email})
          </button>
        )}
      </div>
    </nav>
  );
}

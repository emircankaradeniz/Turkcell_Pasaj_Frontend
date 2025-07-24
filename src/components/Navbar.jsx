import { Link } from "react-router-dom";
import { useSepet } from "../context/SepetContext";

export default function Navbar() {
  const { sepet } = useSepet();
  const toplamAdet = sepet.reduce((acc, u) => acc + u.adet, 0);
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Pasaj</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-600">Anasayfa</Link>
        <Link to="/kategori" className="hover:text-blue-600">Kategoriler</Link>
        <Link to="/sepet" className="hover:text-blue-600">
          Sepet ({toplamAdet})
        </Link>
      </div>
    </nav>
  );
}
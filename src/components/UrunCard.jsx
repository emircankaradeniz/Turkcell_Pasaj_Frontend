import { Link } from "react-router-dom";
import { useSepet } from "../context/SepetContext";

export default function UrunCard({ urun }) {
    const { sepeteEkle } = useSepet();

  return (
    <Link to={`/urun/${urun.id}`}>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
        <img
          src={urun.gorsel}
          alt={urun.ad}
          className="w-full h-48 object-cover rounded-md"
        />
        <h3 className="mt-2 text-lg font-semibold">{urun.ad}</h3>
        <p className="text-gray-600">{urun.aciklama}</p>
        <p className="mt-2 text-blue-600 font-bold text-xl">{urun.fiyat} ₺</p>
        <button
            onClick={() => sepeteEkle(urun)}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
            Sepete Ekle
        </button>
      </div>
    </Link>
  );
}

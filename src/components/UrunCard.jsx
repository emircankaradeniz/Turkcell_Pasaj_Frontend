import { Link } from "react-router-dom";
import { useSepet } from "../context/SepetContext";
import { useFavori } from "../context/FavoriContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function UrunCard({ urun }) {
  const { sepeteEkle } = useSepet();
  const { favoriyeEkle, favoridenCikar, favorideMi } = useFavori();

  const favoride = favorideMi(urun.id);

  const toggleFavori = (e) => {
    e.preventDefault(); // link yönlendirmesini engelle
    favoride ? favoridenCikar(urun.id) : favoriyeEkle(urun);
  };

  return (
    <Link to={`/urun/${urun.id}`}>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition relative">
        <button
          onClick={toggleFavori}
          className="absolute top-2 right-2 text-red-600 text-xl"
        >
          {favoride ? <FaHeart /> : <FaRegHeart />}
        </button>
        {urun.gorsel && (
          <img
            src={urun.gorsel}
            alt={urun.ad}
            className="w-full h-40 object-contain mb-2"
          />
        )}
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

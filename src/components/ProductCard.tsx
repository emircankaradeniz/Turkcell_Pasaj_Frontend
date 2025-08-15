import { Link, useNavigate } from "react-router-dom";
import { useSepet } from "../context/BasketContext";
import { useFavori } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MouseEvent } from "react";
import { Urun } from "../types/Product";

interface Props {
  urun: Urun;
  showSepetButonu?: boolean;
  showFavori?: boolean;
}

export default function UrunCard({
  urun,
  showSepetButonu = true,
  showFavori = true
}: Props): React.JSX.Element {
  const { sepeteEkle } = useSepet();
  const { favoriEkleCikar, favorideMi } = useFavori();
  const { kullanici } = useAuth();
  const navigate = useNavigate();

  const favoride = favorideMi(urun.id);

  const toggleFavori = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!kullanici) {
      navigate("/giris");
      return;
    }
    favoriEkleCikar(urun);
  };

  return (
    <Link to={`/urun/${urun.id}`}>
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow hover:shadow-lg transition relative flex flex-col justify-between min-h-[320px]">

        {/* Favori butonu */}
        {showFavori && (
          <button
            data-testid="favori-btn"
            onClick={toggleFavori}
            className="absolute top-2 right-2 text-red-600 text-lg sm:text-xl"
          >
            {favoride ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}

        {/* Ürün görseli */}
        {urun.gorsel && (
          <img
            src={urun.gorsel}
            alt={urun.ad}
            className="w-full h-32 sm:h-40 object-contain mb-2"
          />
        )}

        {/* Ürün başlık ve açıklama */}
        <div className="flex-1">
          <h3 className="mt-2 text-sm font-semibold line-clamp-2 min-h-[40px]">
            {urun.ad}
          </h3>
          <p className="text-gray-600 line-clamp-2 min-h-[36px]">{urun.aciklama}</p>
        </div>

        {/* Fiyat ve Sepete Ekle */}
        <div>
          <p className="mt-2 text-blue-600 font-bold text-lg sm:text-xl">
            {typeof urun.fiyat === "number"
              ? urun.fiyat.toLocaleString("tr-TR") + " ₺"
              : urun.fiyat}
          </p>

          {/* Sepete Ekle butonu gösterilsin mi? */}
          {showSepetButonu && (
            <button
              onClick={(e) => {
                e.preventDefault();
                sepeteEkle({ ...urun, adet: 1 });
              }}
              className="mt-3 w-full bg-blue-600 text-white py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-blue-700"
            >
              Sepete Ekle
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}


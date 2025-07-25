import { useLocation } from "react-router-dom";
import mockUrunListesi from "../mock/mockUrunListesi";
import { Urun } from "../types/Urun";
import UrunCard from "../components/UrunCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Kategori() {
  const query = useQuery();
  const kategori = query.get("kategori");
  const altKategori = query.get("altKategori");

  const filtrelenmisUrunler: Urun[] = mockUrunListesi.filter((urun) => {
    if (altKategori) {
      return (
        urun.altKategori?.toLowerCase() === altKategori.toLowerCase()
      );
    }
    if (kategori) {
      return urun.kategori?.toLowerCase() === kategori.toLowerCase();
    }
    return true;
  });

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {altKategori
          ? `${altKategori} ürünleri`
          : kategori
          ? `${kategori} kategorisindeki ürünler`
          : "Tüm Ürünler"}
      </h1>

      {filtrelenmisUrunler.length === 0 ? (
        <p>Ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filtrelenmisUrunler.map((urun) => (
            <UrunCard key={urun.id} urun={urun} />
          ))}
        </div>
      )}
    </div>
  );
}

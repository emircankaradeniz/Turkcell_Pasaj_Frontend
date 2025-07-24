import { useParams } from "react-router-dom";
import mockUrunListesi from "../mock/mockUrunListesi";
import UrunCard from "../components/UrunCard";

export default function Kategori() {
  const { isim } = useParams();
  const filtrelenmisUrunler = mockUrunListesi.filter(
    (urun) => urun.kategori === isim
  );

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {isim} kategorisindeki ürünler
      </h1>
      {filtrelenmisUrunler.length === 0 ? (
        <p>Bu kategoride ürün bulunamadı.</p>
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

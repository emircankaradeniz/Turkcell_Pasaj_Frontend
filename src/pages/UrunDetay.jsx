import { useParams } from "react-router-dom";
import mockUrunListesi from "../mock/mockUrunListesi";
import { useSepet } from "../context/SepetContext";

export default function UrunDetay() {
  const { id } = useParams();
  const urun = mockUrunListesi.find((u) => u.id.toString() === id);
  const { sepeteEkle } = useSepet();

  if (!urun) return <div className="p-6">Ürün bulunamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={urun.gorsel}
          alt={urun.ad}
          className="w-full md:w-1/2 h-80 object-cover rounded-md"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{urun.ad}</h1>
            <p className="text-gray-700 mb-4">{urun.aciklama}</p>
            <p className="text-blue-600 text-2xl font-bold mb-4">{urun.fiyat} ₺</p>
          </div>
          <button
            onClick={() => sepeteEkle(urun)}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
            Sepete Ekle
        </button>
        </div>
      </div>
    </div>
  );
}

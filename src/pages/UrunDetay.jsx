import { useParams } from "react-router-dom";
import mockUrunListesi from "../mock/mockUrunListesi";
import { useSepet } from "../context/SepetContext";
import UrunCard from "../components/UrunCard";
import { useEffect, useState } from "react";

export default function UrunDetay() {
  const { id } = useParams();
  const urun = mockUrunListesi.find((u) => u.id.toString() === id);
  const { sepeteEkle } = useSepet();

  const [yorumlar, setYorumlar] = useState([]);
  const [yeniYorum, setYeniYorum] = useState({ kullanici: "", yorum: "" });

  useEffect(() => {
    const kayitliYorumlar = JSON.parse(localStorage.getItem("yorumlar")) || [];
    const filtreli = kayitliYorumlar.filter((y) => y.urunId.toString() === id);
    setYorumlar(filtreli);
  }, [id]);

  const yorumEkle = (e) => {
    e.preventDefault();
    if (!yeniYorum.kullanici || !yeniYorum.yorum) return;

    const yeni = {
      ...yeniYorum,
      urunId: urun.id,
      tarih: new Date().toLocaleString("tr-TR")
    };

    const tumYorumlar = JSON.parse(localStorage.getItem("yorumlar")) || [];
    const guncel = [...tumYorumlar, yeni];
    localStorage.setItem("yorumlar", JSON.stringify(guncel));
    setYorumlar((prev) => [...prev, yeni]);
    setYeniYorum({ kullanici: "", yorum: "" });
  };

  const benzerUrunler = mockUrunListesi.filter(
    (u) => u.kategori === urun.kategori && u.id !== urun.id
  );

  if (!urun) return <div className="p-6">Ürün bulunamadı.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Ürün detay */}
      <div className="bg-white rounded-lg shadow p-6 mb-10">
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

      {/* Yorum Formu */}
      <div className="bg-gray-50 rounded-lg p-4 shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Yorum Yap</h3>
        <form onSubmit={yorumEkle} className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Adınız"
            value={yeniYorum.kullanici}
            onChange={(e) =>
              setYeniYorum({ ...yeniYorum, kullanici: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
          <textarea
            placeholder="Yorumunuz"
            value={yeniYorum.yorum}
            onChange={(e) =>
              setYeniYorum({ ...yeniYorum, yorum: e.target.value })
            }
            className="border px-3 py-2 rounded"
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Gönder
          </button>
        </form>
      </div>

      {/* Yorum Listesi */}
      {yorumlar.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-3">Yorumlar ({yorumlar.length})</h3>
          <ul className="space-y-4">
            {yorumlar.map((y, index) => (
              <li key={index} className="bg-white p-3 rounded shadow border">
                <p className="font-semibold">{y.kullanici}</p>
                <p className="text-sm text-gray-600">{y.tarih}</p>
                <p className="mt-1">{y.yorum}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benzer Ürünler */}
      {benzerUrunler.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {benzerUrunler.map((u) => (
              <UrunCard key={u.id} urun={u} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

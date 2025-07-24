import { useState } from "react";
import { useFavori } from "../context/FavoriContext";
import UrunCard from "../components/UrunCard";

export default function Favoriler() {
  const { favoriler } = useFavori();

  const [arama, setArama] = useState("");
  const [kategori, setKategori] = useState("tumu");

  const kategoriler = [...new Set(favoriler.map(u => u.kategori).filter(Boolean))];

  const filtrelenmisFavoriler = favoriler
    .filter((u) =>
      u.ad.toLowerCase().includes(arama.toLowerCase())
    )
    .filter((u) => kategori === "tumu" || u.kategori === kategori);

  const toplam = filtrelenmisFavoriler.length;
  const ortalamaFiyat =
    toplam > 0
      ? (
          filtrelenmisFavoriler.reduce((acc, u) => acc + u.fiyat, 0) / toplam
        ).toFixed(2)
      : 0;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Favori Ürünlerim</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">Toplam Favori</p>
          <p className="text-2xl">{toplam}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">Ortalama Fiyat</p>
          <p className="text-2xl">{ortalamaFiyat} ₺</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">Kategori</p>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="border p-2 rounded w-full mt-2"
          >
            <option value="tumu">Tümü</option>
            {kategoriler.map((k, i) => (
              <option key={i} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input
        type="text"
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        placeholder="Ürün ara..."
        className="border px-3 py-2 rounded w-full mb-6"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filtrelenmisFavoriler.length === 0 ? (
          <p className="text-gray-500">Favorilerde eşleşen ürün yok.</p>
        ) : (
          filtrelenmisFavoriler.map((urun) => (
            <UrunCard key={urun.id} urun={urun} />
          ))
        )}
      </div>
    </div>
  );
}

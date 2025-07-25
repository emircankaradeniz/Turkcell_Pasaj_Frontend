import { useState } from "react";
import mockUrunListesi from "../mock/mockUrunListesi";
import { Urun } from "../types/Urun";
import { KategoriEnum, KategoriAdlari } from "../types/Kategori";

export default function CokSatanlar() {
  const [aktifKategori, setAktifKategori] = useState<KategoriEnum>(KategoriEnum.Telefon);

  const filtrelenmisUrunler = mockUrunListesi.filter(
    (urun) => urun.kategori === KategoriAdlari[aktifKategori]
    
  );console.log("");

  return (
    <div className="my-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Çok Satanlar</h2>

      {/* Sekmeli Kategori Menü */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {Object.values(KategoriEnum).map((kategori) => (
          <button
            key={kategori}
            onClick={() => setAktifKategori(kategori)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
              aktifKategori === kategori
                ? "bg-yellow-400 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {KategoriAdlari[kategori]}
          </button>
        ))}
      </div>

      {/* Ürünler Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtrelenmisUrunler.map((urun: Urun) => (
          <div
            key={urun.id}
            className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition"
          >
            <div className="text-xs text-orange-500 font-bold mb-2">Çok Satan</div>
            <img
              src={urun.gorsel}
              alt={urun.ad}
              className="w-full h-40 object-contain mb-4"
            />
            <p className="font-semibold">{urun.ad}</p>
            <p className="text-sm text-gray-500">{urun.aciklama}</p>
            <p className="mt-2 text-blue-600 font-bold">
              {urun.fiyat.toLocaleString()} TL
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

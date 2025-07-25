import { useState } from "react";
import { Link } from "react-router-dom";
import mockUrunListesi from "../mock/mockUrunListesi";
import { Urun } from "../types/Urun";

const kategoriler = [
  {
    baslik: "Cep Telefonu-Aksesuar",
    altKategoriler: [
      "Apple Telefonlar",
      "Android Telefonlar",
      "Yapay Zeka (AI) Telefonlar",
      "Giyilebilir Teknolojiler",
      "Aksesuarlar",
      "Tuşlu Telefonlar",
      "Yenilenmiş Telefonlar",
      "5G Destekli Akıllı Telefonlar",
    ],
  },
  {
    baslik: "Bilgisayar-Tablet",
    altKategoriler: [
      "Masaüstü Bilgisayarlar",
      "Dizüstü Bilgisayarlar",
      "Tabletler",
      "Modem & Network Ürünleri",
      "Veri Depolama Ürünleri",
      "Bilgisayar Çevre Birimleri",
      "Tablet Aksesuarları",
    ],
  },
  {
    baslik: "Elektrikli Ev Aletleri",
    altKategoriler: ["Süpürge", "Blender", "Kettle"],
  },
];

export default function Kategoriler() {
  const [acilan, setAcilan] = useState<string | null>(null);
  const [aktifAlt, setAktifAlt] = useState<string | null>(null);

  return (
    <div
      className="mt-4 border-b relative"
      onMouseLeave={() => {
        setAcilan(null);
        setAktifAlt(null);
      }}
    >
      {/* Üst kategori barı */}
      <div className="flex gap-6 overflow-x-auto whitespace-nowrap border-y py-2">
        {kategoriler.map((kat, i) => (
          <Link
            to={`/kategori?kategori=${encodeURIComponent(kat.baslik)}`}
            key={i}
            className={`cursor-pointer font-semibold px-2 hover:text-yellow-600 ${
              acilan === kat.baslik ? "text-yellow-600" : ""
            }`}
            onMouseEnter={() => {
              setAcilan(kat.baslik);
              setAktifAlt(null);
            }}
          >
            {kat.baslik}
          </Link>
        ))}
      </div>

      {/* Genişleyen panel */}
      {acilan && (
        <div className="absolute left-0 w-full z-50 bg-white border-t shadow-md transition-all duration-300">
          <div className="grid grid-cols-4 gap-6 p-6">
            {/* Sol: Alt Kategoriler */}
            <div className="col-span-1">
              <ul className="space-y-2">
                {kategoriler
                  .find((k) => k.baslik === acilan)
                  ?.altKategoriler.map((alt, j) => (
                    <li
                      key={j}
                      className={`cursor-pointer font-medium hover:text-blue-600 ${
                        aktifAlt === alt ? "text-blue-600" : ""
                      }`}
                      onMouseEnter={() => setAktifAlt(alt)}
                    >
                      <Link
                        to={`/kategori?altKategori=${encodeURIComponent(alt)}`}
                      >
                        {alt}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Sağ: Ürün Kutuları */}
            <div className="col-span-3 grid sm:grid-cols-2 gap-4">
              {aktifAlt ? (
                mockUrunListesi
                  .filter(
                    (u: Urun) =>
                      u.altKategori?.toLowerCase() ===
                      aktifAlt.toLowerCase()
                  )
                  .slice(0, 2)
                  .map((urun) => (
                    <Link
                      to={`/urun/${urun.id}`}
                      key={urun.id}
                      className="border rounded shadow hover:shadow-lg p-4 flex gap-4 bg-white"
                    >
                      <img
                        src={urun.gorsel}
                        alt={urun.ad}
                        className="w-24 h-24 object-contain"
                      />
                      <div>
                        <p className="font-semibold">{urun.ad}</p>
                        <p className="text-sm text-gray-500">{urun.aciklama}</p>
                        <p className="text-blue-600 font-bold mt-2">
                          {urun.fiyat.toLocaleString()} ₺
                        </p>
                      </div>
                    </Link>
                  ))
              ) : (
                mockUrunListesi
                  .filter(
                    (u: Urun) =>
                      u.kategori?.toLowerCase() ===
                      acilan.toLowerCase()
                  )
                  .slice(0, 2)
                  .map((urun) => (
                    <Link
                      to={`/urun/${urun.id}`}
                      key={urun.id}
                      className="border rounded shadow hover:shadow-lg p-4 flex gap-4 bg-white"
                    >
                      <img
                        src={urun.gorsel}
                        alt={urun.ad}
                        className="w-24 h-24 object-contain"
                      />
                      <div>
                        <p className="font-semibold">{urun.ad}</p>
                        <p className="text-sm text-gray-500">{urun.aciklama}</p>
                        <p className="text-blue-600 font-bold mt-2">
                          {urun.fiyat.toLocaleString()} ₺
                        </p>
                      </div>
                    </Link>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

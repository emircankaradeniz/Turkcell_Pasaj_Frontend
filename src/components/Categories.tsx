// src/components/Categories.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Urun } from "../types/Product";
import { db } from "../firebase"; // 🔹 Firebase config
import { collection, getDocs } from "firebase/firestore";

const kategoriler = [
  { baslik: "Cep Telefonu-Aksesuar", altKategoriler: ["Apple Telefonlar", "Android Telefonlar", "Yapay Zeka (AI) Telefonlar", "Giyilebilir Teknolojiler", "Aksesuarlar", "Tuşlu Telefonlar", "Yenilenmiş Telefonlar", "5G Destekli Akıllı Telefonlar"] },
  { baslik: "Bilgisayar-Tablet", altKategoriler: ["Masaüstü Bilgisayarlar", "Dizüstü Bilgisayarlar", "Tabletler", "Modem & Network Ürünleri", "Veri Depolama Ürünleri", "Bilgisayar Çevre Birimleri", "Tablet Aksesuarları"] },
  { baslik: "Elektrikli Ev Aletleri", altKategoriler: ["Ütüler", "Süpürgeler", "Elektrikli Mutfak Aletleri", "Mutfak Gereçleri", "Yapı Aletleri", "Hava Temizleme Cihazları", "Dikiş Makineleri", "Fırınlar", "Isıtma ve Soğutma Sistemleri"] },
  { baslik: "Sağlık-Kişisel Bakım", altKategoriler: ["Cilt Bakım Teknolojileri", "Saç Bakım Ürünleri", "Erkek Bakım Ürünleri", "Ağız Bakım Ürünleri", "Epilatörler & IPL Cihazları", "Ateş Ölçerler & Tansiyon Aletleri", "Masaj Aletleri", "Tartılar"] },
  { baslik: "Hobi-Oyun", altKategoriler: ["Oyun Konsolları", "Dijital Ürün Kodları", "Oyuncu Aksesuarları", "Oyunlar", "Fotoğraf & Kameralar", "Youtuber & Yayıncı Ürünleri", "Dronelar", "Scooterlar ve Bisikletler", "Yetişkin Hobi & Eğlence", "Müzik Ürünleri", "Ödeme Kartları"] },
  { baslik: "TV-Ses Sistemleri", altKategoriler: ["Televizyonlar", "Projeksiyon Sistemleri", "Ses Sistemleri", "Media Player"] },
  { baslik: "Ev-Yaşam", altKategoriler: ["Spor Ürünleri", "Bebek & Çocuk", "Akıllı Ev Çözümleri", "Pet Shop", "Epilatörler & IPL Cihazları", "Çanta & Valiz", "Araç Çözümleri", "Yapı Market Ürünleri", "Ofis Malzemeleri", "Akıllı & İlginç Ürünler", "Kadınların Elinden Ürünleri"] },
];

type Props = { initialUrunler?: Urun[] };

export default function Kategoriler({ initialUrunler }: Props) {
  const [acilan, setAcilan] = useState<string | null>(null);
  const [aktifAlt, setAktifAlt] = useState<string | null>(null);
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  // Firestore'dan ürünleri çek (veya testten geleni kullan)
  useEffect(() => {
    if (initialUrunler && initialUrunler.length) {
      setUrunler(initialUrunler);
      return;
    }
    const urunleriGetir = async () => {
      const snap = await getDocs(collection(db, "urunler"));
      const data: Urun[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Urun, "id">),
      }));
      setUrunler(data);
    };
    urunleriGetir();
  }, [initialUrunler]);

  return (
    <div
      className="mt-4 border-b relative"
      onMouseLeave={() => {
        if (isDesktop) {
          setAcilan(null);
          setAktifAlt(null);
        }
      }}
    >
      {/* Üst kategori barı */}
      <div
        data-testid="kategori-nav"
        className="flex gap-6 overflow-x-auto whitespace-nowrap border-y py-2"
      >
        {kategoriler.map((kat, i) => (
          <Link
            to={`/kategori?kategori=${encodeURIComponent(kat.baslik)}`}
            key={i}
            className={`cursor-pointer font-semibold px-2 hover:text-yellow-600 ${
              acilan === kat.baslik ? "text-yellow-600" : ""
            }`}
            onMouseEnter={() => {
              if (isDesktop) {
                setAcilan(kat.baslik);
                setAktifAlt(null);
              }
            }}
          >
            {kat.baslik}
          </Link>
        ))}
      </div>

      {/* Genişleyen panel (sadece masaüstünde gösterilecek) */}
      {isDesktop && acilan && (
        <div
          data-testid="kategori-panel"
          className="absolute left-0 w-full z-50 bg-white border-t shadow-md transition-all duration-300"
        >
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
                      onMouseEnter={() => {
                        if (isDesktop) setAktifAlt(alt);
                      }}
                    >
                      <Link
                        data-testid={`alt-${alt.toLowerCase().replace(/\s+/g, "-")}`}
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
              {(aktifAlt
                ? urunler.filter(
                    (u) =>
                      (u.altKategori ?? "").toLowerCase() ===
                      (aktifAlt ?? "").toLowerCase()
                  )
                : urunler.filter(
                    (u) =>
                      (u.kategori ?? "").toLowerCase() ===
                      (acilan ?? "").toLowerCase()
                  )
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
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

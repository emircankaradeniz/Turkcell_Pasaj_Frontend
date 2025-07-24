import { useState } from "react";
import Slider from "../components/Slider";
import KampanyaKarti from "../components/KampanyaKarti";
import UrunCard from "../components/UrunCard";
import AramaKutusu from "../components/AramaKutusu";
import mockUrunListesi from "../mock/mockUrunListesi";
import { FaTruck, FaCreditCard, FaGift } from "react-icons/fa";

export default function Home() {
  const [arama, setArama] = useState("");
  const [kategori, setKategori] = useState("tumu");
  const [siralama, setSiralama] = useState("varsayilan");

  const kategoriler = ["tumu", ...new Set(mockUrunListesi.map(u => u.kategori).filter(Boolean))];

  // Filtreleme ve sıralama işlemleri
  let filtreliUrunler = mockUrunListesi.filter((urun) =>
    urun.ad.toLowerCase().includes(arama.toLowerCase())
  );

  if (kategori !== "tumu") {
    filtreliUrunler = filtreliUrunler.filter((urun) => urun.kategori === kategori);
  }

  if (siralama === "artan") {
    filtreliUrunler.sort((a, b) => a.fiyat - b.fiyat);
  } else if (siralama === "azalan") {
    filtreliUrunler.sort((a, b) => b.fiyat - a.fiyat);
  }

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <Slider />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <KampanyaKarti icon={<FaTruck />} title="Ücretsiz Kargo" />
        <KampanyaKarti icon={<FaCreditCard />} title="12 Ay Taksit" />
        <KampanyaKarti icon={<FaGift />} title="Hediye Çeki Fırsatı" />
      </div>

      <AramaKutusu arama={arama} setArama={setArama} />

      {/* Filtre ve Sıralama */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 mb-4">
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/2"
        >
          {kategoriler.map((kat, i) => (
            <option key={i} value={kat}>
              {kat.charAt(0).toUpperCase() + kat.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={siralama}
          onChange={(e) => setSiralama(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/2"
        >
          <option value="varsayilan">Varsayılan</option>
          <option value="artan">Fiyat (Artan)</option>
          <option value="azalan">Fiyat (Azalan)</option>
        </select>
      </div>

      <h2 className="text-2xl font-bold mt-4 mb-4">Ürünler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filtreliUrunler.length === 0 ? (
          <p className="text-gray-600">Aradığınız ürün bulunamadı.</p>
        ) : (
          filtreliUrunler.map((urun) => (
            <UrunCard key={urun.id} urun={urun} />
          ))
        )}
      </div>
    </div>
  );
}

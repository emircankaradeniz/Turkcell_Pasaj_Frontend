import { useState, ChangeEvent } from "react";
import Slider from "../components/Slider";
import KampanyaKarti from "../components/KampanyaKarti";
import UrunCard from "../components/UrunCard";
import AramaKutusu from "../components/AramaKutusu";
import mockUrunListesi from "../mock/mockUrunListesi";
import { FaTruck, FaCreditCard, FaGift } from "react-icons/fa";
import { Urun } from "../types/Urun";
import Kategoriler from "../components/Kategoriler";
import SanaOzelUrunler from "../components/SanaOzelUrunler";
import EnIyiTeklifler from "../components/EnIyiTeklifler";
import CokSatanlar from "../components/CokSatanlar";


export default function Home() {
  const [arama, setArama] = useState<string>("");
  const [kategori, setKategori] = useState<string>("tumu");
  const [siralama, setSiralama] = useState<string>("varsayilan");

  const kategoriler: string[] = ["tumu", ...new Set(mockUrunListesi.map(u => u.kategori).filter(Boolean))];

  let filtreliUrunler: Urun[] = mockUrunListesi.filter((urun) =>
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
      <Kategoriler />
      <Slider />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <KampanyaKarti icon={<FaTruck />} title="Ücretsiz Kargo" />
        <KampanyaKarti icon={<FaCreditCard />} title="12 Ay Taksit" />
        <KampanyaKarti icon={<FaGift />} title="Hediye Çeki Fırsatı" />
      </div>

      <AramaKutusu arama={arama} setArama={setArama} />

      
      <SanaOzelUrunler />

      <EnIyiTeklifler />

      <CokSatanlar />
    </div>
  );
}

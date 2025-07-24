import Slider from "../components/Slider";
import KampanyaKarti from "../components/KampanyaKarti";
import UrunCard from "../components/UrunCard";
import mockUrunListesi from "../mock/mockUrunListesi";
import { FaTruck, FaCreditCard, FaGift } from "react-icons/fa";

export default function Home() {
  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <Slider />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <KampanyaKarti icon={<FaTruck />} title="Ücretsiz Kargo" />
        <KampanyaKarti icon={<FaCreditCard />} title="12 Ay Taksit" />
        <KampanyaKarti icon={<FaGift />} title="Hediye Çeki Fırsatı" />
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">Öne Çıkan Ürünler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mockUrunListesi.map((urun) => (
          <UrunCard key={urun.id} urun={urun} />
        ))}
      </div>
    </div>
  );
}

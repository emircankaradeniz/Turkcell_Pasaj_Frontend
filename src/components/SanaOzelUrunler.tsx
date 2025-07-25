import { useRef } from "react";
import { Urun } from "../types/Urun";
import mockUrunListesi from "../mock/mockUrunListesi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function SanaOzelUrunler() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const solaKaydir = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const sagaKaydir = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="relative max-w-screen-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Sana Özel Ürünler</h2>

      {/* Scrollable ürün listesi */}
      <div className="relative">
        <button
          onClick={solaKaydir}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100"
        >
          <FaChevronLeft />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 scroll-smooth px-8 py-4 no-scrollbar"
        >
          {mockUrunListesi.slice(0, 10).map((urun) => (
            <div
              key={urun.id}
              className="min-w-[220px] border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              <img
                src={urun.gorsel}
                alt={urun.ad}
                className="w-full h-40 object-contain mb-2"
              />
              <p className="font-semibold">{urun.ad}</p>
              <p className="text-sm text-gray-500">{urun.aciklama}</p>
              <p className="text-blue-600 font-bold mt-2">
                {urun.fiyat.toLocaleString()} TL
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={sagaKaydir}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full shadow z-10 p-2 hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

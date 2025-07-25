import { Urun } from "../types/Urun";
import mockUrunListesi from "../mock/mockUrunListesi";

export default function EnIyiTeklifler() {
  const teklifler = mockUrunListesi.slice(0, 4); // İstersen filtre ekleriz (örn: urun.etiket.includes("cok-satan"))

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6 px-4">En İyi Teklifler</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {teklifler.map((urun) => (
          <div key={urun.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            {/* Etiket */}
            <div className="px-3 py-1 bg-orange-400 text-white text-xs font-bold w-fit rounded-br-xl">
              Çok Satan
            </div>

            {/* Görsel */}
            <img src={urun.gorsel} alt={urun.ad} className="w-full h-52 object-contain p-4" />

            {/* Başlık ve Açıklama */}
            <div className="p-4">
              <h3 className="text-base font-semibold">{urun.ad}</h3>

              {/* Yıldız ve Puan */}
              <div className="flex items-center gap-2 mt-2">
                <div className="text-yellow-500">★ ★ ★ ★ ☆</div>
                <span className="text-sm text-gray-600">4,5</span>
              </div>

              {/* Özellik Rozetleri */}
              <div className="flex flex-wrap gap-1 mt-2 text-xs">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Pasaj Limitinle Öde</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Ücretsiz Kargo</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Hızlı Teslimat</span>
              </div>

              {/* Fiyat */}
              <p className="text-xl text-blue-700 font-bold mt-4">
                {urun.fiyat.toLocaleString("tr-TR")} TL
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

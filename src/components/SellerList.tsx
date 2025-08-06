import { useSepet } from "../context/BasketContext";
import { Urun } from "../types/Product";

interface Satici {
  ad?: string;
  puan?: number;
  fiyat?: number;
  kargo?: string;
  ucretsizKargo?: boolean;
  etiket?: string;
}

interface Props {
  saticilar: Satici[];
  urun: Urun;
}

export default function SaticiListesi({ saticilar, urun }: Props) {
  const { sepeteEkle } = useSepet();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Diğer Satıcılar</h2>
      <div className="flex overflow-x-auto gap-4 pb-4">
        {saticilar.map((satici, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-64 border rounded-xl shadow bg-white p-4 relative"
          >
            {/* Puan */}
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
              {satici.puan != null ? satici.puan.toFixed(1) : "-"}
            </div>

            {/* Satıcı adı */}
            <p className="font-semibold text-blue-700 mt-6">
              {satici.ad || "Bilinmeyen Satıcı"}
            </p>

            {/* Fiyat */}
            <p className="text-2xl font-bold mt-2">
              {satici.fiyat != null
                ? `${satici.fiyat.toLocaleString("tr-TR")} TL`
                : "Fiyat Yok"}
            </p>

            {/* Kargo bilgisi */}
            {satici.kargo && (
              <p className="text-sm text-gray-600">{satici.kargo}</p>
            )}
            {satici.ucretsizKargo && (
              <p className="text-green-600 text-sm">Ücretsiz Kargo</p>
            )}

            {/* Etiket */}
            {satici.etiket && (
              <div className="mt-2 text-xs text-gray-500 border rounded-full px-2 py-1 inline-block">
                {satici.etiket}
              </div>
            )}

            {/* Sepete ekle */}
            <button
              onClick={() =>
                sepeteEkle({
                  ...urun,
                  fiyat: satici.fiyat ?? urun.fiyat, // fiyat yoksa ürün fiyatını kullan
                  secilenSatici: {
                    ad: satici.ad || "Bilinmeyen Satıcı",
                    puan: satici.puan ?? 0,
                    fiyat: satici.fiyat ?? 0,
                    kargo: satici.kargo || "",
                    ucretsizKargo: satici.ucretsizKargo ?? false,
                    etiket: satici.etiket || ""
                  }
                })
              }
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg"
            >
              Ekle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

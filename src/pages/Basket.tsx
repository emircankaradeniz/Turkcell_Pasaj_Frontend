import { useSepet } from "../context/BasketContext";
import { useState } from "react";
import IlginiziCekebilir from "../components/RelatedProducts";

export default function Sepet() {
  const { sepet, sepettenCikar, adetGuncelle } = useSepet();
  const [sozlesmeOnay, setSozlesmeOnay] = useState(false);
  const [kampanyaKodu, setKampanyaKodu] = useState("");

  const toplam = sepet.reduce(
    (acc, u) => acc + u.fiyat * (u.adet ?? 1),
    0
  );

  const indirim = toplam > 0 ? 500 : 0; // örnek indirim
  const odemeTutari = toplam - indirim;

  return (
    <div>
    <div className="max-w-6xl mx-auto p-4 flex gap-6">
      {/* SOL TARAF: Ürünler */}
      <div className="flex-1">
        <h1 className="text-xl font-bold mb-4">Sepetim</h1>

        {sepet.length === 0 ? (
          <p>Sepetiniz boş.</p>
        ) : (
          <div className="space-y-4">
            {sepet.map((u) => (
              <div
                key={u.id}
                className="bg-white border rounded-lg p-4 flex gap-4 items-center"
              >
                <img
                  src={u.gorsel}
                  alt={u.ad}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{u.ad}</p>
                  <p className="text-sm text-gray-500">{u.aciklama}</p>
                  <p className="text-sm mt-1">Birim Fiyat: {u.fiyat.toLocaleString()} TL</p>
                </div>
                {/* Adet */}
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => adetGuncelle(u.id, (u.adet ?? 1) - 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3">{u.adet ?? 1}</span>
                  <button
                    onClick={() => adetGuncelle(u.id, (u.adet ?? 1) + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                {/* Tutar */}
                <div className="w-24 text-right font-semibold">
                  {(u.fiyat * (u.adet ?? 1)).toLocaleString()} TL
                </div>
                {/* Sil */}
                <button
                  onClick={() => sepettenCikar(u.id)}
                  className="text-red-500 hover:underline"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SAĞ TARAF: Sipariş Özeti */}
      <div className="w-80 bg-white border rounded-lg p-4 h-fit space-y-4">
        <h2 className="font-bold text-lg">Sipariş Özeti ({sepet.length} Ürün)</h2>
        <div className="flex justify-between text-sm">
          <span>Ürünler Toplamı</span>
          <span>{toplam.toLocaleString()} TL</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Kargo Tutarı</span>
          <span className="text-green-600 font-medium">Ücretsiz</span>
        </div>
        <div className="flex justify-between text-sm text-red-500">
          <span>İndirimler</span>
          <span>-{indirim.toLocaleString()} TL</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Ödenecek Tutar</span>
          <span>{odemeTutari.toLocaleString()} TL</span>
        </div>

        {/* Kampanya kodu */}
        <div className="flex gap-2">
          <input
            type="text"
            value={kampanyaKodu}
            onChange={(e) => setKampanyaKodu(e.target.value)}
            placeholder="Kampanya Kodu"
            className="border rounded px-3 py-2 flex-1"
          />
          <button className="bg-blue-600 text-white px-4 rounded">Ekle</button>
        </div>

        {/* Sözleşme */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sozlesmeOnay}
            onChange={(e) => setSozlesmeOnay(e.target.checked)}
          />
          Kullanıcı sözleşmesini okudum, onaylıyorum.
        </label>

        {/* Devam Et */}
        <button
          disabled={!sozlesmeOnay}
          className={`w-full py-3 rounded font-bold ${
            sozlesmeOnay
              ? "bg-yellow-400 hover:bg-yellow-500"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Siparişe Devam Et
        </button>
      </div>
    </div>
    <div>
        <br/>
        <IlginiziCekebilir/>
        <br/>
    </div>
    </div>
  );
}

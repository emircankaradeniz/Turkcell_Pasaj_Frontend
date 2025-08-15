import { useParams } from "react-router-dom";
import { useSepet } from "../context/BasketContext";
import UrunCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { Urun } from "../types/Product";
import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, addDoc, setDoc, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import SaticiListesi from "../components/SellerList";
import ProductTabs from "../components/ProductTabs"

interface Yorum {
  kullanici: string;
  yorum: string;
  urunId: string;
  tarih: string;
}

export default function UrunDetay() {
  const { id } = useParams<{ id: string }>();
  const { sepeteEkle } = useSepet();
  const { kullanici } = useAuth();

  const [urun, setUrun] = useState<Urun | null>(null);
  const [benzerUrunler, setBenzerUrunler] = useState<Urun[]>([]);
  const [yorumlar, setYorumlar] = useState<Yorum[]>([]);
  const [yeniYorum, setYeniYorum] = useState({ kullanici: "", yorum: "" });

  // Ürün detayını ve benzerleri getir
  useEffect(() => {
    if (!id) return;
    (async () => {
      const docRef = doc(db, "urunler", id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return setUrun(null);

      const data = { ...(snap.data() as Urun), id: snap.id };
      setUrun(data);

      if (kullanici) {
        await setDoc(doc(db, "users", kullanici.uid, "recentlyViewed", data.id), {
          id: data.id,
          ad: data.ad,
          fiyat: data.fiyat,
          gorsel: data.gorsel,
          tarih: Date.now(),
        });
      }

      const q = query(collection(db, "urunler"), where("kategori", "==", data.kategori));
      const benzer = (await getDocs(q)).docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Urun, "id">) }))
        .filter((u) => u.id !== snap.id)
        .slice(0, 4);
      setBenzerUrunler(benzer);
    })();
  }, [id, kullanici]);

  // Yorumları getir
  useEffect(() => {
    if (!id) return;
    (async () => {
      const q = query(collection(db, "yorumlar"), where("urunId", "==", id));
      const liste = (await getDocs(q)).docs.map((d) => d.data() as Yorum);
      setYorumlar(liste);
    })();
  }, [id]);

  // Yorum ekle
  const yorumEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yeniYorum.kullanici || !yeniYorum.yorum || !urun) return;

    const yeni: Yorum = { ...yeniYorum, urunId: urun.id, tarih: new Date().toISOString() };
    await addDoc(collection(db, "yorumlar"), yeni);
    setYorumlar((prev) => [yeni, ...prev]);
    setYeniYorum({ kullanici: "", yorum: "" });
  };

  if (!urun) return <div className="p-6">Ürün bulunamadı.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Ürün Bilgisi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-4 sm:p-6 rounded-lg shadow">
        {/* Görseller */}
        <div className="flex flex-col items-center gap-4">
          <img src={urun.gorsel} alt={urun.ad} className="w-full max-w-md object-contain rounded-lg border" />
          <div className="flex gap-2 flex-wrap justify-center">
            {[urun.gorsel, urun.gorsel, urun.gorsel].map((g, i) => (
              <img key={i} src={g} alt={`thumb-${i}`} className="w-16 h-16 sm:w-20 sm:h-20 object-contain border rounded cursor-pointer hover:border-blue-500" />
            ))}
          </div>
        </div>

        {/* Bilgiler */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 data-testid="product-title" className="text-2xl sm:text-3xl font-bold">{urun.ad}</h1>
            <p className="text-yellow-500 mt-1 text-sm sm:text-base">⭐⭐⭐⭐⭐ 4.6</p>

            {/* Renk */}
            <div className="mt-4">
              <p className="font-semibold mb-2">RENK</p>
              <button className="px-3 py-2 border rounded-lg hover:border-blue-500 text-sm sm:text-base">
                {urun.renk || "Renk"}
              </button>
            </div>

            {/* Fiyat */}
            <div className="mt-6 bg-gray-100 p-4 rounded-lg border">
              <p className="text-sm">Satıcı: <b>Pasaj Satış</b></p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{urun.fiyat} ₺</p>
              <p className="text-xs sm:text-sm text-gray-600">1 İş Gününde Kargoda - Ücretsiz Kargo</p>
            </div>
          </div>

          {/* Sepete Ekle */}
          <button data-testid="add-to-cart-btn" onClick={() => sepeteEkle(urun)} className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg text-base sm:text-lg font-bold w-full">
            Sepete Ekle
          </button>
        </div>
      </div>

      {/* Benzer Ürünler */}
      {benzerUrunler.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {benzerUrunler.map((u) => <UrunCard key={u.id} urun={u} />)}
          </div>
        </div>
      )}

      {/* Satıcılar */}
      {urun.saticilar && urun.saticilar.length > 0 && (
        <SaticiListesi saticilar={urun.saticilar} urun={urun} />
      )}
      <ProductTabs
        urunId={urun.id}
        aciklama={urun.aciklama}
        ozellikler={urun.ozellikler || {}}
      />

    </div>
  );
}

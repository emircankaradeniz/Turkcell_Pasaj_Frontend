import { useParams } from "react-router-dom";
import { useSepet } from "../context/BasketContext";
import UrunCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { Urun } from "../types/Product";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  query,
  where
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // kullanıcı bilgisi almak için

interface Yorum {
  kullanici: string;
  yorum: string;
  urunId: string;
  tarih: string;
}

export default function UrunDetay() {
  const { id } = useParams<{ id: string }>();
  const { sepeteEkle } = useSepet();
  const { kullanici } = useAuth(); // giriş yapan kullanıcı

  const [urun, setUrun] = useState<Urun | null>(null);
  const [benzerUrunler, setBenzerUrunler] = useState<Urun[]>([]);
  const [yorumlar, setYorumlar] = useState<Yorum[]>([]);
  const [yeniYorum, setYeniYorum] = useState<
    Pick<Yorum, "kullanici" | "yorum">
  >({
    kullanici: "",
    yorum: ""
  });

  // Ürün detayını çek
  useEffect(() => {
    const urunGetir = async () => {
      if (!id) return;

      const docRef = doc(db, "urunler", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Urun;
        const fullData = { ...data, id: docSnap.id };
        setUrun(fullData);

        // **Son İncelenenler'e Kaydet**
        if (kullanici) {
          try {
            await setDoc(
              doc(db, "users", kullanici.uid, "recentlyViewed", fullData.id),
              {
                id: fullData.id,
                ad: fullData.ad,
                fiyat: fullData.fiyat,
                gorsel: fullData.gorsel,
                tarih: Date.now()
              }
            );
          } catch (err) {
            console.error("Son incelenenlere kaydedilemedi:", err);
          }
        }

        // Benzer ürünler
        const q = query(
          collection(db, "urunler"),
          where("kategori", "==", data.kategori)
        );
        const snap = await getDocs(q);
        const liste: Urun[] = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<Urun, "id">) }))
          .filter((u) => u.id !== docSnap.id);
        setBenzerUrunler(liste);
      } else {
        setUrun(null);
      }
    };

    urunGetir();
  }, [id, kullanici]);

  // Yorumları çek
  useEffect(() => {
    const yorumlariGetir = async () => {
      if (!id) return;
      const q = query(collection(db, "yorumlar"), where("urunId", "==", id));
      const snap = await getDocs(q);
      const liste: Yorum[] = snap.docs.map((d) => d.data() as Yorum);
      setYorumlar(liste);
    };
    yorumlariGetir();
  }, [id]);

  // Yorum ekle
  const yorumEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yeniYorum.kullanici || !yeniYorum.yorum || !urun) return;

    const yeni: Yorum = {
      ...yeniYorum,
      urunId: urun.id,
      tarih: new Date().toISOString()
    };

    await addDoc(collection(db, "yorumlar"), yeni);
    setYorumlar((prev) => [yeni, ...prev]);
    setYeniYorum({ kullanici: "", yorum: "" });
  };

  if (!urun) return <div className="p-6">Ürün bulunamadı.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Ürün Detay */}
      <div className="bg-white rounded-lg shadow p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={urun.gorsel}
            alt={urun.ad}
            className="w-full h-full md:w-1/2 h-80 object-cover rounded-md"
          />
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{urun.ad}</h1>
              <p className="text-gray-700 mb-4">{urun.aciklama}</p>
              <p className="text-blue-600 text-2xl font-bold mb-4">
                {urun.fiyat} ₺
              </p>
            </div>
            <button
              onClick={() => sepeteEkle(urun)}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Benzer Ürünler */}
      {benzerUrunler.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {benzerUrunler.map((u) => (
              <UrunCard key={u.id} urun={u} />
            ))}
          </div>
        </div>
      )}

      {/* Yorum Ekle */}
      <div className="bg-gray-50 rounded-lg p-4 shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Yorum Yap</h3>
        <form onSubmit={yorumEkle} className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Adınız"
            value={yeniYorum.kullanici}
            onChange={(e) =>
              setYeniYorum({ ...yeniYorum, kullanici: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
          <textarea
            placeholder="Yorumunuz"
            value={yeniYorum.yorum}
            onChange={(e) =>
              setYeniYorum({ ...yeniYorum, yorum: e.target.value })
            }
            className="border px-3 py-2 rounded"
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Gönder
          </button>
        </form>
      </div>

      {/* Yorum Listesi */}
      {yorumlar.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-3">
            Yorumlar ({yorumlar.length})
          </h3>
          <ul className="space-y-4">
            {yorumlar.map((y, index) => (
              <li
                key={index}
                className="bg-white p-3 rounded shadow border"
              >
                <p className="font-semibold">{y.kullanici}</p>
                <p className="text-sm text-gray-600">
                  {new Date(y.tarih).toLocaleString("tr-TR")}
                </p>
                <p className="mt-1">{y.yorum}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

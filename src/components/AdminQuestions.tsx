import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  or
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface Soru {
  id: string;
  urunId: string;
  saticiAd: string;
  soru: string;
  cevap?: string | null;
  kullaniciAd: string;
  tarih: any;
}

interface Urun {
  id: string;
  ad: string;
  gorsel?: string;
}

export default function AdminSorular() {
  const { kullanici } = useAuth();
  const [sorular, setSorular] = useState<Soru[]>([]);
  const [cevaplar, setCevaplar] = useState<Record<string, string>>({});
  const [urunBilgileri, setUrunBilgileri] = useState<Record<string, Urun>>({});

  const sorulariGetir = async () => {
    const qSoru = query(
      collection(db, "sorular"),
      or(where("cevap", "==", ""), where("cevap", "==", null))
    );

    const snap = await getDocs(qSoru);
    const liste: Soru[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Soru, "id">)
    }));

    setSorular(liste);

    const urunMap: Record<string, Urun> = {};
    for (const s of liste) {
      if (!urunMap[s.urunId]) {
        const urunRef = doc(db, "urunler", s.urunId);
        const urunSnap = await getDoc(urunRef);
        if (urunSnap.exists()) {
          const { id: _ignore, ...rest } = urunSnap.data() as Urun;
          urunMap[s.urunId] = {
            id: urunSnap.id,
            ...rest
          };
        }
      }
    }
    setUrunBilgileri(urunMap);
  };

  useEffect(() => {
    if (kullanici?.rol === "admin") {
      sorulariGetir();
    }
  }, [kullanici]);

  const cevapla = async (soruId: string) => {
    const cevap = cevaplar[soruId];
    if (!cevap || cevap.trim() === "") return alert("Cevap yazınız.");

    const soruRef = doc(db, "sorular", soruId);
    await updateDoc(soruRef, { cevap });

    // 🔹 Ekranı anında güncelle
    setSorular((prev) => prev.filter((s) => s.id !== soruId));
    setCevaplar((prev) => {
      const yeni = { ...prev };
      delete yeni[soruId];
      return yeni;
    });
  };

  if (kullanici?.rol !== "admin") {
    return <div className="p-6">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Cevap Bekleyen Sorular</h1>

      {sorular.length === 0 ? (
        <p className="text-gray-500">Şu anda cevaplanmamış soru bulunmuyor.</p>
      ) : (
        <div className="space-y-4">
          {sorular.map((soru) => (
            <div
              key={soru.id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-3">
                {urunBilgileri[soru.urunId]?.gorsel && (
                  <img
                    src={urunBilgileri[soru.urunId].gorsel}
                    alt={urunBilgileri[soru.urunId].ad}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-semibold">
                    {urunBilgileri[soru.urunId]?.ad || "Ürün Bilgisi Yok"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Satıcı: {soru.saticiAd}
                  </p>
                </div>
              </div>

              <p className="mb-2">
                <span className="font-semibold">{soru.kullaniciAd}:</span>{" "}
                {soru.soru}
              </p>

              <textarea
                value={cevaplar[soru.id] || ""}
                onChange={(e) =>
                  setCevaplar({ ...cevaplar, [soru.id]: e.target.value })
                }
                placeholder="Cevabınızı yazın..."
                className="w-full border rounded p-2 mb-2"
                rows={2}
              ></textarea>

              <button
                onClick={() => cevapla(soru.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Cevapla
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

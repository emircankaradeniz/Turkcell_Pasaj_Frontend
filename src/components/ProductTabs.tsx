import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Urun } from "../types/Product";

interface Satici {
  id: string;
  ad: string;
}

interface ProductTabsProps {
  urunId: string;
  aciklama: string;
  ozellikler: Record<string, string>;
}

export default function ProductTabs({
  urunId,
  aciklama,
  ozellikler
}: ProductTabsProps) {
  const { kullanici } = useAuth();

  const [activeTab, setActiveTab] = useState("aciklama");
  const [yorumlar, setYorumlar] = useState<any[]>([]);
  const [sorular, setSorular] = useState<any[]>([]);
  const [saticilar, setSaticilar] = useState<Satici[]>([]);

  // Form state
  const [yeniYorum, setYeniYorum] = useState("");
  const [puan, setPuan] = useState(5);

  // Soru form state
  const [seciliSatici, setSeciliSatici] = useState("");
  const [yeniSoru, setYeniSoru] = useState("");

  // 🔹 Firestore'dan satıcıları getir
  const saticilariGetir = async () => {
    const snap = await getDocs(collection(db, "saticilar"));
    const liste: Satici[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Satici, "id">)
    }));
    setSaticilar(liste);
  };

  // 🔹 Yorumları getir
  const yorumlariGetir = async () => {
    const qYorum = query(
      collection(db, "yorumlar"),
      where("urunId", "==", urunId),
      orderBy("tarih", "desc")
    );
    const snap = await getDocs(qYorum);
    setYorumlar(snap.docs.map((d) => d.data()));
  };

  // 🔹 Soruları getir
  const sorulariGetir = async () => {
    const qSoru = query(
      collection(db, "sorular"),
      where("urunId", "==", urunId),
      orderBy("tarih", "desc")
    );
    const snap = await getDocs(qSoru);
    setSorular(snap.docs.map((d) => d.data()));
  };

  useEffect(() => {
    yorumlariGetir();
    sorulariGetir();
    saticilariGetir();
  }, [urunId]);

  // 🔹 Yorum ekle
  const yorumEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kullanici) return alert("Giriş yapmalısınız.");
    if (!yeniYorum.trim()) return;

    await addDoc(collection(db, "yorumlar"), {
      urunId,
      kullanici: kullanici.email?.split("@")[0] || "Misafir",
      yorum: yeniYorum,
      puan,
      tarih: serverTimestamp()
    });

    setYeniYorum("");
    setPuan(5);
    yorumlariGetir();
  };

  // 🔹 Soru ekle
  const soruEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kullanici) return alert("Giriş yapmalısınız.");
    if (!seciliSatici) return alert("Lütfen bir satıcı seçin.");
    if (!yeniSoru.trim()) return;

    await addDoc(collection(db, "sorular"), {
      urunId,
      saticiAd: seciliSatici,
      kullaniciId: kullanici.uid,
      kullaniciAd: kullanici.email?.split("@")[0] || "Misafir",
      soru: yeniSoru,
      cevap: null,
      tarih: serverTimestamp()
    });

    setYeniSoru("");
    setSeciliSatici("");
    sorulariGetir();
  };

  const tabs = [
    { id: "aciklama", label: "Ürün Açıklamaları" },
    { id: "ozellikler", label: "Ürün Özellikleri" },
    { id: "yorumlar", label: `Değerlendirmeler (${yorumlar.length})` },
    { id: "sorular", label: `Ürün Soru&Cevapları (${sorular.length})` }
  ];

  return (
    <div className="mt-10 bg-white rounded-lg shadow">
      {/* Tab Başlıkları */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* İçerik */}
      <div className="p-6">
        {activeTab === "aciklama" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Ürün Açıklaması</h2>
            <p>{aciklama}</p>
          </div>
        )}

        {activeTab === "ozellikler" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Teknik Özellikler</h2>
            <table className="w-full border">
              <tbody>
                {Object.entries(ozellikler || {}).map(([k, v]) => (
                  <tr key={k} className="border-b">
                    <td className="p-2 font-semibold">{k}</td>
                    <td className="p-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "yorumlar" && (
          <div>
            <form onSubmit={yorumEkle} className="mb-4">
              <label>Puan:</label>
              <select value={puan} onChange={(e) => setPuan(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((p) => (
                  <option key={p} value={p}>{p} ★</option>
                ))}
              </select>
              <textarea
                value={yeniYorum}
                onChange={(e) => setYeniYorum(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                className="w-full border rounded p-2 mt-2"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
                Gönder
              </button>
            </form>

            {yorumlar.map((y, i) => (
              <div key={i} className="border-b py-2">
                <b>{y.kullanici}</b> - {y.puan} ★
                <p>{y.yorum}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sorular" && (
          <div>
            {/* Soru sorma formu */}
            <form onSubmit={soruEkle} className="mb-4">
              <label className="block mb-1">Satıcı Seç</label>
              <select
                value={seciliSatici}
                onChange={(e) => setSeciliSatici(e.target.value)}
                className="border rounded w-full p-2 mb-2"
              >
                <option value="">Seçiniz</option>
                {saticilar.map((s) => (
                  <option key={s.id} value={s.ad}>
                    {s.ad}
                  </option>
                ))}
              </select>

              <textarea
                value={yeniSoru}
                onChange={(e) => setYeniSoru(e.target.value)}
                placeholder="Sorunuzu yazın..."
                className="w-full border rounded p-2 mb-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Soruyu Gönder
              </button>
            </form>

            {/* Sorular listesi */}
            {sorular.length > 0 ? (
              sorular.map((s, i) => (
                <div key={i} className="border-b py-2">
                  <p className="font-semibold">{s.kullaniciAd} ({s.saticiAd})</p>
                  <p>{s.soru}</p>
                  {s.cevap ? (
                    <p className="text-green-600">Cevap: {s.cevap}</p>
                  ) : (
                    <p className="text-gray-500 italic">Henüz cevaplanmamış</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Henüz soru sorulmamış.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import UrunCard from "../components/ProductCard";
import { Urun } from "../types/Product";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import AdminSorular from "../components/AdminQuestions";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

interface Kategori {
  id: string;
  ad: string;
  altKategoriler?: string[];
}

interface AltKategori {
  id: string;
  ad: string;
  kategoriId: string;
}

interface Yorum {
  id?: string;
  urunId: string;
  kullaniciId: string;
  kullaniciAd: string;
  yorum: string;
  puan: number;
  tarih?: any;
}

// 🔹 Satıcı tipi
interface Satici {
  ad: string;
  fiyat: number;
  kargo: string;
  puan: number;
  ucretsizKargo: boolean;
  etiket: string;
}


export default function AdminPanel() {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [altKategoriler, setAltKategoriler] = useState<AltKategori[]>([]);

  // 🔹 Satıcı listesi ve seçilen satıcılar
  const [saticilar, setSaticilar] = useState<Satici[]>([]);
  const [seciliSaticilar, setSeciliSaticilar] = useState<Satici[]>([]);

  const [form, setForm] = useState<Omit<Urun, "id">>({
    ad: "",
    aciklama: "",
    fiyat: 0,
    gorsel: "",
    kategori: "",
    kategoriId: "",
    altKategori: "",
    altKategoriId: "",
    adet: 0,
    ozellikler: {},
    saticilar: [] // 🔹 eklendi
  });

  const [duzenlenenUrunId, setDuzenlenenUrunId] = useState<string | null>(null);
  const [aktifKategoriId, setAktifKategoriId] = useState("tumu");
  const [aramaTerimi, setAramaTerimi] = useState("");
  const [sirala, setSirala] = useState("varsayilan");

  const { kullanici, cikisYap } = useAuth();
  const navigate = useNavigate();

  // 🔹 Kategorileri getir
  const kategorileriGetir = async () => {
    const snap = await getDocs(collection(db, "kategoriler"));
    const data = snap.docs.map((d) => {
      const docData = d.data() as any;
      return {
        id: d.id,
        ad: docData.baslik,
        altKategoriler: docData.altKategoriler || []
      };
    });
    setKategoriler(data);
  };

  // 🔹 Alt kategorileri getir
  const altKategorileriGetir = (kategoriId: string) => {
    const seciliKategori = kategoriler.find((k) => k.id === kategoriId);
    if (seciliKategori) {
      setAltKategoriler(
        (seciliKategori.altKategoriler || []).map((ad, index) => ({
          id: `${kategoriId}-${index}`,
          ad,
          kategoriId
        }))
      );
    } else {
      setAltKategoriler([]);
    }
  };

  // 🔹 Satıcıları getir (Firestore → saticilar koleksiyonu)
  const saticilariGetir = async () => {
    const snap = await getDocs(collection(db, "saticilar"));
    const liste = snap.docs.map((d) => d.data() as Satici);
    setSaticilar(liste);
  };

  // 🔹 Ürünleri getir
  const urunleriGetir = async () => {
    const snap = await getDocs(collection(db, "urunler"));
    setUrunler(
      snap.docs.map((d) => {
        const data = d.data() as Omit<Urun, "id">;
        return { id: d.id, ...data };
      })
    );
  };

  useEffect(() => {
    kategorileriGetir();
    saticilariGetir(); // 🔹 Satıcıları da çek
    urunleriGetir();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "kategoriId") {
      altKategorileriGetir(e.target.value);
    }
  };

  // 🔹 Satıcı seçim toggle
  const handleSaticiSec = (ad: string) => {
  const secili = saticilar.find((s) => s.ad === ad);
  if (!secili) return;

  const varMi = seciliSaticilar.find((s) => s.ad === ad);
  if (varMi) {
    setSeciliSaticilar(seciliSaticilar.filter((s) => s.ad !== ad));
  } else {
    setSeciliSaticilar([
      ...seciliSaticilar,
      {
        ad,
        fiyat: 0,
        kargo: "",
        puan: 0,
        ucretsizKargo: false,
        etiket: ""
      }
    ]);
  }
};


  // 🔹 Ürün ekleme / güncelleme
  const urunEkle = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.ad || !form.fiyat || !form.kategoriId) return;

    const kategoriAd =
      kategoriler.find((k) => k.id === form.kategoriId)?.ad || "";
    const altKategoriAd =
      altKategoriler.find((a) => a.id === form.altKategoriId)?.ad || "";

    if (duzenlenenUrunId) {
      const urunRef = doc(db, "urunler", duzenlenenUrunId);
      await updateDoc(urunRef, {
        ...form,
        fiyat: Number(form.fiyat),
        kategori: kategoriAd,
        altKategori: altKategoriAd,
        saticilar: seciliSaticilar // 🔹 seçili satıcıları kaydet
      });
      setDuzenlenenUrunId(null);
    } else {
      await addDoc(collection(db, "urunler"), {
        ...form,
        fiyat: Number(form.fiyat),
        kategori: kategoriAd,
        altKategori: altKategoriAd,
        saticilar: seciliSaticilar // 🔹 seçili satıcıları kaydet
      });
    }

    setForm({
      ad: "",
      aciklama: "",
      fiyat: 0,
      gorsel: "",
      kategori: "",
      kategoriId: "",
      altKategori: "",
      altKategoriId: "",
      adet: 0,
      ozellikler: {},
      saticilar: []
    });
    setSeciliSaticilar([]);
    urunleriGetir();
  };

  const urunSil = async (id: string) => {
    await deleteDoc(doc(db, "urunler", id));
    urunleriGetir();
  };

  const urunDuzenle = (urun: Urun) => {
    setForm({
      ad: urun.ad,
      aciklama: urun.aciklama,
      fiyat: urun.fiyat,
      gorsel: urun.gorsel || "",
      kategori: urun.kategori,
      kategoriId: urun.kategoriId,
      altKategori: urun.altKategori || "",
      altKategoriId: urun.altKategoriId || "",
      adet: urun.adet || 0,
      ozellikler: urun.ozellikler || {},
      saticilar: urun.saticilar || []
    });
    setSeciliSaticilar(urun.saticilar || []);
    setDuzenlenenUrunId(urun.id);
    altKategorileriGetir(urun.kategoriId);
  };

  // 🔹 Özellik ekleme & silme
  const [yeniOzellik, setYeniOzellik] = useState({ key: "", value: "" });

  const ozellikEkle = () => {
    if (!yeniOzellik.key || !yeniOzellik.value) return;
    setForm((prev) => ({
      ...prev,
      ozellikler: {
        ...prev.ozellikler,
        [yeniOzellik.key]: yeniOzellik.value
      }
    }));
    setYeniOzellik({ key: "", value: "" });
  };

  const ozellikSil = (key: string) => {
    const yeni = { ...form.ozellikler };
    delete yeni[key];
    setForm((prev) => ({ ...prev, ozellikler: yeni }));
  };

  const toplamUrunSayisi = urunler.length;
  const toplamFiyat = urunler.reduce((acc, u) => acc + u.fiyat, 0);
  const ortalamaFiyat =
    toplamUrunSayisi > 0 ? (toplamFiyat / toplamUrunSayisi).toFixed(2) : "0";

  if (!kullanici) {
    navigate("/giris");
    return null;
  }
  // 🔹 Filtreleme
  let filtrelenmisUrunler = urunler
    .filter(
      (u) => aktifKategoriId === "tumu" || u.kategoriId === aktifKategoriId
    )
    .filter((u) =>
      u.ad.toLowerCase().includes(aramaTerimi.toLowerCase())
    );

  if (sirala === "artan") {
    filtrelenmisUrunler.sort((a, b) => a.fiyat - b.fiyat);
  } else if (sirala === "azalan") {
    filtrelenmisUrunler.sort((a, b) => b.fiyat - a.fiyat);
  }

    toplamUrunSayisi > 0
      ? (toplamFiyat / toplamUrunSayisi).toFixed(2)
      : "0";

  if (!kullanici) {
    navigate("/giris");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Paneli - Ürün Ekle</h1>

      {/* Ürün Ekleme Formu */}
      <form
        onSubmit={urunEkle}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        <input
          name="ad"
          value={form.ad}
          onChange={handleChange}
          placeholder="Ürün Adı"
          className="border p-2 rounded w-full"
        />
        <input
          name="aciklama"
          value={form.aciklama}
          onChange={handleChange}
          placeholder="Açıklama"
          className="border p-2 rounded w-full"
        />
        <input
          name="fiyat"
          value={form.fiyat}
          onChange={handleChange}
          placeholder="Fiyat (₺)"
          className="border p-2 rounded w-full"
          type="number"
        />
        <input
          name="gorsel"
          value={form.gorsel}
          onChange={handleChange}
          placeholder="Görsel URL / Path"
          className="border p-2 rounded w-full"
        />

        {/* Kategori dropdown */}
        <select
          name="kategoriId"
          value={form.kategoriId}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Kategori Seç</option>
          {kategoriler.map((kat) => (
            <option key={kat.id} value={kat.id}>
              {kat.ad}
            </option>
          ))}
        </select>

        {/* Alt kategori dropdown */}
        <select
          name="altKategoriId"
          value={form.altKategoriId}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Alt Kategori Seç</option>
          {altKategoriler.map((alt) => (
            <option key={alt.id} value={alt.id}>
              {alt.ad}
            </option>
          ))}
        </select>

        {/* Satıcılar */}
        <div className="sm:col-span-2 border p-3 rounded">
          <h3 className="font-semibold mb-2">Satıcılar</h3>
          <div className="flex flex-wrap gap-2">
            {saticilar.map((s, i) => (
              <button
                type="button"
                key={i}
                onClick={() => handleSaticiSec(s.ad)}
                className={`px-3 py-1 rounded border ${
                  seciliSaticilar.some((sec) => sec.ad === s.ad)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {s.ad}
              </button>
            ))}
          </div>
        </div>
        {/* Seçilen satıcılar detaylı bilgi girişi */}
        <div className="sm:col-span-2 border p-3 rounded mt-4">
          <h3 className="font-semibold mb-2">Seçilen Satıcı Bilgileri</h3>
          <div className="space-y-4">
            {seciliSaticilar.map((satici, index) => (
              <div key={index} className="border rounded p-3 bg-gray-50">
                <h4 className="font-semibold mb-2">{satici.ad}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Fiyat (₺)"
                    value={satici.fiyat === 0 ? "" : satici.fiyat.toString()}
                    onChange={(e) => {
                      const yeni = [...seciliSaticilar];
                      yeni[index].fiyat = Number(e.target.value);
                      setSeciliSaticilar(yeni);
                    }}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Kargo Süresi"
                    value={satici.kargo}
                    onChange={(e) => {
                      const yeni = [...seciliSaticilar];
                      yeni[index].kargo = e.target.value;
                      setSeciliSaticilar(yeni);
                    }}
                    className="border p-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Puan (0-10)"
                    value={satici.puan === 0 ? "" : satici.puan.toString()}
                    onChange={(e) => {
                      const yeni = [...seciliSaticilar];
                      yeni[index].puan = Number(e.target.value);
                      setSeciliSaticilar(yeni);
                    }}
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Etiket (örn: Başarılı Satıcı)"
                    value={satici.etiket}
                    onChange={(e) => {
                      const yeni = [...seciliSaticilar];
                      yeni[index].etiket = e.target.value;
                      setSeciliSaticilar(yeni);
                    }}
                    className="border p-2 rounded"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={satici.ucretsizKargo}
                      onChange={(e) => {
                        const yeni = [...seciliSaticilar];
                        yeni[index].ucretsizKargo = e.target.checked;
                        setSeciliSaticilar(yeni);
                      }}
                    />
                    <span>Ücretsiz Kargo</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Özellikler */}
        <div className="sm:col-span-2 border p-3 rounded">
          <h3 className="font-semibold mb-2">Ürün Özellikleri</h3>

          {form.ozellikler && Object.keys(form.ozellikler).length > 0 && (
            <ul className="mb-3 space-y-1">
              {Object.entries(form.ozellikler).map(([key, value]) => (
                <li
                  key={key}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>
                    <b>{key}:</b> {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => ozellikSil(key)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Özellik Adı"
              value={yeniOzellik.key}
              onChange={(e) =>
                setYeniOzellik({ ...yeniOzellik, key: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />
            <input
              type="text"
              placeholder="Değer"
              value={yeniOzellik.value}
              onChange={(e) =>
                setYeniOzellik({ ...yeniOzellik, value: e.target.value })
              }
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={ozellikEkle}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Ekle
            </button>
          </div>
        </div>

        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full sm:col-span-2">
          {duzenlenenUrunId ? "Güncelle" : "Ürünü Ekle"}
        </button>
      </form>
      {/* Ürün listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtrelenmisUrunler.map((urun) => (
          <div key={urun.id} className="relative">
            <UrunCard urun={urun} showSepetButonu={false} showFavori={false} />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => urunDuzenle(urun)}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
              >
                Düzenle
              </button>
              <button
                onClick={() => urunSil(urun.id)}
                className="bg-red-600 text-white px-2 py-1 rounded text-xs"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
      <AdminSorular/>
            
    </div>
  );
}

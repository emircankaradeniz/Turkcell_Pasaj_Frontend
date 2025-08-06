import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import UrunCard from "../components/ProductCard";
import { Urun } from "../types/Product";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
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

export default function AdminPanel() {
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [altKategoriler, setAltKategoriler] = useState<AltKategori[]>([]);

  const [form, setForm] = useState<Omit<Urun, "id">>({
    ad: "",
    aciklama: "",
    fiyat: 0,
    gorsel: "",
    kategori: "",
    kategoriId: "",
    altKategori: "",
    altKategoriId: "",
    adet: 0
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
        ad: docData.baslik, // Firestore'daki 'baslik' alanı
        altKategoriler: docData.altKategoriler || []
      };
    });
    console.log("📌 Gelen kategoriler:", data);
    setKategoriler(data);
  };

  // 🔹 Alt kategorileri getir (koleksiyon içinden)
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
        altKategori: altKategoriAd
      });
      setDuzenlenenUrunId(null);
    } else {
      await addDoc(collection(db, "urunler"), {
        ...form,
        fiyat: Number(form.fiyat),
        kategori: kategoriAd,
        altKategori: altKategoriAd
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
      adet: 0
    });
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
      adet: urun.adet || 0
    });
    setDuzenlenenUrunId(urun.id);
    altKategorileriGetir(urun.kategoriId);
  };

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

  const toplamUrunSayisi = filtrelenmisUrunler.length;
  const toplamFiyat = filtrelenmisUrunler.reduce((acc, u) => acc + u.fiyat, 0);
  const ortalamaFiyat =
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

        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full sm:col-span-2">
          {duzenlenenUrunId ? "Güncelle" : "Ürünü Ekle"}
        </button>
      </form>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <select
          value={aktifKategoriId}
          onChange={(e) => setAktifKategoriId(e.target.value)}
          className="border px-3 py-1 rounded w-full sm:w-auto"
        >
          <option value="tumu">Tüm Kategoriler</option>
          {kategoriler.map((kat) => (
            <option key={kat.id} value={kat.id}>
              {kat.ad}
            </option>
          ))}
        </select>

        <select
          value={sirala}
          onChange={(e) => setSirala(e.target.value)}
          className="border px-3 py-1 rounded w-full sm:w-auto"
        >
          <option value="varsayilan">Sıralama</option>
          <option value="artan">Fiyat: Artan</option>
          <option value="azalan">Fiyat: Azalan</option>
        </select>

        <input
          type="text"
          value={aramaTerimi}
          onChange={(e) => setAramaTerimi(e.target.value)}
          placeholder="Ürün ara..."
          className="border px-3 py-2 rounded w-full sm:flex-1"
        />

        <button
          onClick={() => {
            setAktifKategoriId("tumu");
            setSirala("varsayilan");
            setAramaTerimi("");
          }}
          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 w-full sm:w-auto"
        >
          Temizle
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">Toplam Ürün</p>
          <p className="text-2xl">{toplamUrunSayisi}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">Toplam Fiyat</p>
          <p className="text-2xl">
            {toplamFiyat.toLocaleString("tr-TR")} ₺
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">Ortalama Fiyat</p>
          <p className="text-2xl">{ortalamaFiyat} ₺</p>
        </div>
      </div>

      {/* Ürün listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtrelenmisUrunler.map((urun) => (
          <div key={urun.id} className="relative">
            <UrunCard urun={urun} />
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

      {/* Çıkış */}
      <button
        onClick={() => {
          cikisYap();
          navigate("/");
        }}
        className="bg-red-500 text-white py-2 px-4 rounded mt-4 w-full sm:w-auto"
      >
        Çıkış Yap
      </button>
    </div>
  );
}

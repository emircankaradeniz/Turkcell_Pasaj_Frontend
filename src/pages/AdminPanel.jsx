import { useEffect, useState } from "react";
import UrunCard from "../components/UrunCard";

export default function AdminPanel() {
  const [urunler, setUrunler] = useState([]);
  const [form, setForm] = useState({
    ad: "",
    aciklama: "",
    fiyat: "",
    gorsel: "",
    kategori: ""
  });
  const [yeniKategori, setYeniKategori] = useState("");
  const [duzenlenenUrunId, setDuzenlenenUrunId] = useState(null);
  const [aktifKategori, setAktifKategori] = useState("tumu");
  const [aramaTerimi, setAramaTerimi] = useState("");
  const [sirala, setSirala] = useState("varsayilan");

  useEffect(() => {
    const kayitli = localStorage.getItem("urunler");
    if (kayitli) {
      setUrunler(JSON.parse(kayitli));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("urunler", JSON.stringify(urunler));
  }, [urunler]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const urunEkle = (e) => {
    e.preventDefault();
    if (!form.ad || !form.fiyat) return;

    if (duzenlenenUrunId) {
      setUrunler((prev) =>
        prev.map((u) =>
          u.id === duzenlenenUrunId
            ? { ...form, id: u.id, fiyat: parseFloat(form.fiyat) }
            : u
        )
      );
      setDuzenlenenUrunId(null);
    } else {
      const yeniUrun = {
        ...form,
        id: Date.now(),
        fiyat: parseFloat(form.fiyat)
      };
      setUrunler((prev) => [...prev, yeniUrun]);
    }

    setForm({ ad: "", aciklama: "", fiyat: "", gorsel: "", kategori: "" });
  };

  const urunSil = (id) => {
    const kalanlar = urunler.filter((u) => u.id !== id);
    setUrunler(kalanlar);
  };

  const urunDuzenle = (urun) => {
    setForm({
      ad: urun.ad,
      aciklama: urun.aciklama,
      fiyat: urun.fiyat,
      gorsel: urun.gorsel,
      kategori: urun.kategori
    });
    setDuzenlenenUrunId(urun.id);
  };

  const kategoriler = [...new Set(urunler.map(u => u.kategori).filter(Boolean))].sort();

  let filtrelenmisUrunler = urunler
    .filter((u) => aktifKategori === "tumu" || u.kategori === aktifKategori)
    .filter((u) =>
      u.ad.toLowerCase().includes(aramaTerimi.toLowerCase())
    );

  // Sıralama
  if (sirala === "artan") {
    filtrelenmisUrunler.sort((a, b) => a.fiyat - b.fiyat);
  } else if (sirala === "azalan") {
    filtrelenmisUrunler.sort((a, b) => b.fiyat - a.fiyat);
  }

  const toplamUrunSayisi = filtrelenmisUrunler.length;
  const toplamFiyat = filtrelenmisUrunler.reduce((acc, u) => acc + u.fiyat, 0);
  const ortalamaFiyat = toplamUrunSayisi > 0 ? (toplamFiyat / toplamUrunSayisi).toFixed(2) : 0;

  const kategoriEkle = () => {
    if (!yeniKategori.trim()) return;
    const yeniUrun = {
      ...form,
      kategori: yeniKategori.trim()
    };
    setForm({ ...form, kategori: yeniKategori.trim() });
    setYeniKategori("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Paneli - Ürün Ekle</h1>

      <form onSubmit={urunEkle} className="grid grid-cols-1 gap-4 mb-8">
        <input name="ad" value={form.ad} onChange={handleChange} placeholder="Ürün Adı" className="border p-2 rounded" />
        <input name="aciklama" value={form.aciklama} onChange={handleChange} placeholder="Açıklama" className="border p-2 rounded" />
        <input name="fiyat" value={form.fiyat} onChange={handleChange} placeholder="Fiyat (₺)" className="border p-2 rounded" type="number" />
        <input name="gorsel" value={form.gorsel} onChange={handleChange} placeholder="Görsel URL / Path" className="border p-2 rounded" />

        <div className="flex gap-2">
          <select
            name="kategori"
            value={form.kategori}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Kategori Seç</option>
            {kategoriler.map((kategori, index) => (
              <option key={index} value={kategori}>{kategori}</option>
            ))}
          </select>
          <input
            type="text"
            value={yeniKategori}
            onChange={(e) => setYeniKategori(e.target.value)}
            placeholder="Yeni kategori"
            className="border p-2 rounded w-full"
          />
          <button type="button" onClick={kategoriEkle} className="bg-blue-500 text-white px-4 rounded">Ekle</button>
        </div>

        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          {duzenlenenUrunId ? "Güncelle" : "Ürünü Ekle"}
        </button>
      </form>

      {/* Filtre ve Sıralama Alanı */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={aktifKategori} onChange={(e) => setAktifKategori(e.target.value)} className="border px-3 py-1 rounded">
          <option value="tumu">Tüm Kategoriler</option>
          {kategoriler.map((kat, i) => (
            <option key={i} value={kat}>{kat}</option>
          ))}
        </select>

        <select value={sirala} onChange={(e) => setSirala(e.target.value)} className="border px-3 py-1 rounded">
          <option value="varsayilan">Sıralama</option>
          <option value="artan">Fiyat: Artan</option>
          <option value="azalan">Fiyat: Azalan</option>
        </select>

        <input
          type="text"
          value={aramaTerimi}
          onChange={(e) => setAramaTerimi(e.target.value)}
          placeholder="Ürün ara..."
          className="border px-3 py-2 rounded w-full sm:w-1/2"
        />

        <button onClick={() => {
          setAktifKategori("tumu");
          setSirala("varsayilan");
          setAramaTerimi("");
        }} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
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
          <p className="text-2xl">{toplamFiyat.toLocaleString("tr-TR")} ₺</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <p className="text-lg font-semibold">Ortalama Fiyat</p>
          <p className="text-2xl">{ortalamaFiyat} ₺</p>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtrelenmisUrunler.map((urun) => (
          <div key={urun.id} className="relative">
            <UrunCard urun={urun} />
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={() => urunDuzenle(urun)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Düzenle</button>
              <button onClick={() => urunSil(urun.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

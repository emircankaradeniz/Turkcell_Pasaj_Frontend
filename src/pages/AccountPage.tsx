import { useAuth } from "../context/AuthContext";
import { useNavigate ,Link } from "react-router-dom";
import { useState } from "react";
import {
  FaBoxOpen,
  FaGift,
  FaQuestionCircle,
  FaUser,
  FaCreditCard,
  FaStar,
  FaChartBar,
  FaHeart
} from "react-icons/fa";

export default function HesapSayfasi() {
  const { kullanici, cikisYap } = useAuth();
  const navigate = useNavigate();

  const [ad, setAd] = useState("Emircan");
  const [soyad, setSoyad] = useState("Karadeniz");
  const [dogumTarihi, setDogumTarihi] = useState("2003-05-10");
  const [meslek, setMeslek] = useState("Mühendis");
  const [email, setEmail] = useState(kullanici?.email || "");
  const [telefon, setTelefon] = useState("+90 545 472 16 54");
  const [izinVer, setIzinVer] = useState(true);

  if (!kullanici) {
    navigate("/giris");
    return null;
  }

  const kaydet = () => {
    alert("Bilgiler kaydedildi!");
  };

  return (
    <div className="flex max-w-6xl mx-auto mt-8 gap-6">
      {/* Sol Menü */}
            <div className="w-64 bg-white rounded-lg shadow-sm border p-4 text-gray-700 text-sm">
              <ul className="space-y-4">
                <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <FaChartBar /> Pasaj Limitini Öğren
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <FaBoxOpen /> Siparişlerim
                </li>
                <Link to={"/favoriler"} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <FaHeart /> Favorilerim
                </Link>
                <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <FaGift /> Hediye Çeklerim
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <FaStar /> Değerlendirmelerim
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <FaQuestionCircle /> Ürün Sorularım
                </li>
                <li className="flex items-center gap-2 text-blue-600 font-semibold">
                  <FaUser className="text-blue-600" /> Kullanıcı Bilgilerim
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <FaCreditCard /> Kayıtlı Kartlarım
                </li>
              </ul>
            </div>

      {/* SAĞ TARAF */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Kullanıcı Bilgilerim</h1>

        <div className="bg-white border rounded-lg p-6 space-y-6">
          {/* İzin Politikası */}
          <div className="flex items-start gap-2">
            <input type="checkbox" checked={izinVer} onChange={(e) => setIzinVer(e.target.checked)} />
            <p className="text-sm text-gray-600">
              Turkcell Satış A.Ş. tarafından bana uygun, avantajlı indirim, fırsatlar ve teklifler
              belirlenebilmesi için <a href="#" className="text-blue-600 underline">İzin Politikası</a>’nı okudum, kişisel
              verilerimin işlenmesine onay veriyorum.
            </p>
          </div>

          {/* Kişisel Bilgiler */}
          <div>
            <h2 className="font-semibold mb-2">Kişisel Bilgilerim</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                placeholder="Ad"
              />
              <input
                className="border rounded px-3 py-2"
                value={soyad}
                onChange={(e) => setSoyad(e.target.value)}
                placeholder="Soyad"
              />
              <input
                className="border rounded px-3 py-2"
                type="date"
                value={dogumTarihi}
                onChange={(e) => setDogumTarihi(e.target.value)}
              />
              <select
                className="border rounded px-3 py-2"
                value={meslek}
                onChange={(e) => setMeslek(e.target.value)}
              >
                <option>Mühendis</option>
                <option>Öğretmen</option>
                <option>Doktor</option>
                <option>Öğrenci</option>
              </select>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <h2 className="font-semibold mb-2">İletişim Bilgilerim</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta Adresi"
              />
              <input
                className="border rounded px-3 py-2"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="Telefon Numarası"
              />
            </div>
            <label className="flex items-center gap-2 mt-2 text-sm">
              <input
                type="checkbox"
                checked={izinVer}
                onChange={(e) => setIzinVer(e.target.checked)}
              />
              İletişim bilgilerimin kaydedilmesine izin veriyorum.
            </label>
          </div>

          {/* Butonlar */}
          <div className="flex gap-4">
            <button
              onClick={kaydet}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Kaydet
            </button>
            <button
              onClick={() => {
                cikisYap();
                navigate("/");
              }}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

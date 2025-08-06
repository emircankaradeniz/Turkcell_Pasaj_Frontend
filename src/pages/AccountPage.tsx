import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firebase config dosyan

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

  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [dogumTarihi, setDogumTarihi] = useState("");
  const [meslek, setMeslek] = useState("");
  const [email, setEmail] = useState(kullanici?.email || "");
  const [telefon, setTelefon] = useState("");
  const [izinVer, setIzinVer] = useState(false);

  // Kullanıcı bilgilerini Firestore'dan çek
  useEffect(() => {
    if (!kullanici) {
      navigate("/giris");
      return;
    }

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", kullanici.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAd(data.ad || "");
          setSoyad(data.soyad || "");
          setDogumTarihi(data.dogumTarihi || "");
          setMeslek(data.meslek || "");
          setTelefon(data.telefon || "");
          setIzinVer(data.izinVer ?? false);
        }
      } catch (err) {
        console.error("Kullanıcı bilgileri alınamadı:", err);
      }
    };

    fetchUserData();
  }, [kullanici, navigate]);

  // Firestore'a kaydet
  const kaydet = async () => {
    if (!kullanici) return;

    try {
      const docRef = doc(db, "users", kullanici.uid);
      await setDoc(
        docRef,
        {
          ad,
          soyad,
          dogumTarihi,
          meslek,
          email,
          telefon,
          izinVer
        },
        { merge: true }
      );
      alert("Bilgiler kaydedildi!");
    } catch (err) {
      console.error("Kayıt hatası:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-8 gap-6 p-4">
      {/* Sol Menü */}
      <div className="w-full md:w-64 bg-white rounded-lg shadow-sm border p-4 text-gray-700 text-sm">
        <ul className="space-y-4">
          <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <FaChartBar /> Pasaj Limitini Öğren
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <FaBoxOpen /> Siparişlerim
          </li>
          <Link
            to={"/favoriler"}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
          >
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

      {/* Sağ Taraf */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Kullanıcı Bilgilerim</h1>

        <div className="bg-white border rounded-lg p-6 space-y-6">
          {/* İzin Politikası */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={izinVer}
              onChange={(e) => setIzinVer(e.target.checked)}
            />
            <p className="text-sm text-gray-600">
              Turkcell Satış A.Ş. tarafından bana uygun, avantajlı indirim,
              fırsatlar ve teklifler belirlenebilmesi için{" "}
              <a href="#" className="text-blue-600 underline">
                İzin Politikası
              </a>
              ’nı okudum, kişisel verilerimin işlenmesine onay veriyorum.
            </p>
          </div>

          {/* Kişisel Bilgiler */}
          <div>
            <h2 className="font-semibold mb-2">Kişisel Bilgilerim</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2 w-full"
                value={ad}
                onChange={(e) => setAd(e.target.value)}
                placeholder="Ad"
              />
              <input
                className="border rounded px-3 py-2 w-full"
                value={soyad}
                onChange={(e) => setSoyad(e.target.value)}
                placeholder="Soyad"
              />
              <input
                className="border rounded px-3 py-2 w-full"
                type="date"
                value={dogumTarihi}
                onChange={(e) => setDogumTarihi(e.target.value)}
              />
              <select
                className="border rounded px-3 py-2 w-full"
                value={meslek}
                onChange={(e) => setMeslek(e.target.value)}
              >
                <option value="">Meslek Seçiniz</option>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta Adresi"
              />
              <input
                className="border rounded px-3 py-2 w-full"
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
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={kaydet}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
            >
              Kaydet
            </button>
            <button
              onClick={() => {
                cikisYap();
                navigate("/");
              }}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

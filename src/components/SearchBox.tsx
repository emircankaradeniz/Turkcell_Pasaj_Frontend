import { useState, useRef, useEffect } from "react";
import { FaHeart, FaRegHeart, FaUser, FaShoppingCart,FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const gecmisAramalar = ["iphone 14", "iphone 1"];
const sanaOzelKategoriler = ["Samsung Galaxy A26", "TV+", "iPhone 16e", "Sana Özel Teklifler"];
const populerAramalar = ["Oyuncu Mouseları", "Buharlı Ütüler", "Blender & Mikserler", "Bluetooth Hoparlörler"];

export default function AramaKutusu() {
  const [aranan, setAranan] = useState("");
  const navigate = useNavigate();
  const [aktifPopuler, setAktifPopuler] = useState(populerAramalar[0]);
  const [acik, setAcik] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const ara = () => {
    if (aranan.trim()) {
      navigate(`/arama?query=${encodeURIComponent(aranan)}`);
    }
  };

  // dışarı tıklanınca kapansın
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setAcik(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl" ref={wrapperRef}>
      {/* Arama kutusu */}
      <div
        className="flex items-center bg-gray-100 rounded-lg px-4 py-2 cursor-text"
        onClick={() => setAcik(true)}
      >
        {/* Büyüteç ikonu sol başta */}
        <button className="text-gray-500 hover:text-black mr-2" onClick={ara}>
          <FaSearch />
        </button>

        {/* Arama inputu */}
        <input
          type="text"
          placeholder="Ürün, marka veya kategori ara"
          className="w-full px-2 py-2 bg-gray-100 text-gray-700 placeholder-gray-400 outline-none"
          value={aranan}
          onChange={(e) => setAranan(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              ara();
            }
          }}
        />
      </div>

      {/* Açılır kutu */}
      {acik && (
        <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg border z-50 p-4">
          <div className="mb-4">
            <h3 className="text-sm text-gray-500 font-semibold mb-2">Geçmiş Aramalar</h3>
            <div className="flex gap-2 flex-wrap">
              {gecmisAramalar.map((item, i) => (
                <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {item}
                  <button className="text-gray-500 text-xs">✕</button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm text-gray-500 font-semibold mb-2">Sana Özel Kategoriler</h3>
            <div className="flex gap-2 flex-wrap">
              {sanaOzelKategoriler.map((kat, i) => (
                <span key={i} className="bg-gray-100 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-gray-200">
                  {kat}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 font-semibold mb-2">Popüler Aramalar</h3>
            <div className="flex gap-2 mb-3 overflow-x-auto">
              {populerAramalar.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setAktifPopuler(item)}
                  className={`px-4 py-1.5 rounded-full text-sm border ${
                    aktifPopuler === item ? "bg-blue-600 text-white" : "bg-white text-gray-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <img
                src="https://cdn.akakce.com/z/asus/asus-rog-gladius-iii.jpg"
                alt="populer-urun"
                className="w-16 h-16 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-sm">Asus ROG Gladius III Oyuncu Mouse</span>
                <div className="flex gap-2 items-end mt-1">
                  <span className="text-lg font-semibold text-black">2.579 TL</span>
                  <span className="line-through text-gray-400 text-sm">4.229 TL</span>
                  <span className="text-sm text-blue-600 font-semibold">1.650 TL İndirim</span>
                </div>
                <a href="#" className="text-sm text-blue-600 underline mt-1">
                  Tüm Oyuncu Mouseları göster
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

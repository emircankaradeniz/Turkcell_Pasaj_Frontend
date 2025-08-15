import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query as fsQuery,
  orderBy,
  limit,
  addDoc,
} from "firebase/firestore";

// --- Fallback sabitler (Firestore yoksa kullanılır) ---
const FALLBACK_POPULER = ["Iphone", "Samsung", "Blender", "Arzum"];
const FALLBACK_SANA_OZEL = [
  { label: "Samsung Galaxy A26", query: "Samsung Galaxy A26" },
  { label: "TV+", query: "TV+" },
  { label: "iPhone 16e", query: "iPhone 16e" },
  { label: "Sana Özel Teklifler", query: "Sana Özel Teklifler" },
];

// localStorage geçmiş
const LS_KEY = "arama_gecmisi_v1";
const MAX_HISTORY = 10;
const DEBOUNCE_MS = 250;

function readHistory(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function writeHistory(list: string[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
}

type Oneri = { id: string; ad: string; gorsel?: string; fiyat?: number };

export default function AramaKutusu() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const { kullanici } = useAuth();

  // UI state
  const [acik, setAcik] = useState(false);
  const [aranan, setAranan] = useState("");
  const [hoverIndex, setHoverIndex] = useState(-1);

  // Dinamik veriler
  const [oneriler, setOneriler] = useState<Oneri[]>([]);
  const [dinamikGecmis, setDinamikGecmis] = useState<string[]>([]);
  const [populer, setPopuler] = useState<string[]>(FALLBACK_POPULER);
  const [aktifPopuler, setAktifPopuler] = useState<string>(FALLBACK_POPULER[0]);
  const [sanaOzel, setSanaOzel] = useState<Array<{ label: string; query: string }>>(FALLBACK_SANA_OZEL);
  const [onerilenUrun, setOnerilenUrun] = useState<null | {
    id: string;
    ad: string;
    gorsel?: string;
    fiyat?: number;
    eskiFiyat?: number;
    indirimMetni?: string;
  }>(null);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setAcik(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Geçmişi yükle
  useEffect(() => {
    setDinamikGecmis(readHistory());
  }, []);

  // Popüler aramalar (dinamik)
  useEffect(() => {
    (async () => {
      try {
        const q = fsQuery(collection(db, "populerAramalar"), orderBy("weight", "desc"), limit(12));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const terms = snap.docs.map((d) => (d.data() as any).term).filter(Boolean);
          if (terms.length) {
            setPopuler(terms);
            setAktifPopuler(terms[0]);
          }
        }
      } catch {
        // fallback zaten yüklü
      }
    })();
  }, []);

  // Sana özel kategoriler (kullanıcıya özgü, yoksa genel)
  useEffect(() => {
    (async () => {
      try {
        if (kullanici) {
          const snap = await getDocs(collection(db, "users", kullanici.uid, "sanaOzelKategoriler"));
          if (!snap.empty) {
            const list = snap.docs
              .map((d) => d.data() as any)
              .map((x) => ({ label: x.label as string, query: x.query as string }))
              .filter((x) => x.label && x.query);
            if (list.length) {
              setSanaOzel(list);
              return;
            }
          }
        }
        // genel fallback
        const genelSnap = await getDocs(collection(db, "sanaOzelKategorilerGenel"));
        if (!genelSnap.empty) {
          const list = genelSnap.docs
            .map((d) => d.data() as any)
            .map((x) => ({ label: x.label as string, query: x.query as string }))
            .filter((x) => x.label && x.query);
          if (list.length) setSanaOzel(list);
        }
      } catch {
        // fallback kalır
      }
    })();
  }, [kullanici]);

  // Önerilen ürün (featured)
  useEffect(() => {
    (async () => {
      try {
        const meta = await getDoc(doc(db, "searchMeta", "onerilenUrun"));
        if (meta.exists()) {
          const { urunId, eskiFiyat, indirimMetni } = meta.data() as any;
          if (urunId) {
            const u = await getDoc(doc(db, "urunler", urunId));
            if (u.exists()) {
              const d: any = u.data();
              setOnerilenUrun({
                id: u.id,
                ad: d.ad,
                gorsel: d.gorsel,
                fiyat: d.fiyat,
                eskiFiyat,
                indirimMetni,
              });
            }
          }
        }
      } catch {
        // boş geç
      }
    })();
  }, []);

  // Öneriler – ad’ın ilk kelimesine göre (ad_lc’siz)
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const term = aranan.trim().toLowerCase();

    if (term.length < 3) {
      setOneriler([]);
      return;
    }

    timerRef.current = window.setTimeout(async () => {
      try {
        const snap = await getDocs(collection(db, "urunler"));
        const list: Oneri[] = snap.docs
          .map((d) => {
            const data: any = d.data();
            return { id: d.id, ad: data.ad, gorsel: data.gorsel, fiyat: data.fiyat };
          })
          .filter((u) => {
            const ilkKelime = (u.ad || "").toString().trim().split(/\s+/)[0]?.toLowerCase() || "";
            return ilkKelime.startsWith(term);
          })
          .slice(0, 8);

        setOneriler(list);
        setHoverIndex(-1);
      } catch (e) {
        console.error("Öneriler alınamadı:", e);
        setOneriler([]);
      }
    }, DEBOUNCE_MS) as unknown as number;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [aranan]);

  // geçmiş yönetimi (+ sunucuya yaz)
  const pushHistory = async (term: string) => {
    const temiz = term.trim();
    if (temiz.length < 2) return;

    // LS
    const without = dinamikGecmis.filter((x) => x.toLowerCase() !== temiz.toLowerCase());
    const yeni = [temiz, ...without].slice(0, MAX_HISTORY);
    setDinamikGecmis(yeni);
    writeHistory(yeni);

    // Firestore (opsiyonel)
    try {
      if (kullanici) {
        await addDoc(collection(db, "users", kullanici.uid, "searchHistory"), {
          term: temiz,
          at: Date.now(),
        });
      }
    } catch {
      // sorun olursa sessiz geç
    }
  };
  const removeFromHistory = (term: string) => {
    const yeni = dinamikGecmis.filter((x) => x !== term);
    setDinamikGecmis(yeni);
    writeHistory(yeni);
  };

  // arama çalıştır
  const ara = (term?: string) => {
    const t = (term ?? aranan).trim();
    if (!t) return;
    pushHistory(t);
    navigate(`/arama?query=${encodeURIComponent(t)}`);
    setAcik(false);
  };

  // klavye navigasyonu
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!acik || oneriler.length === 0) {
      if (e.key === "Enter") ara();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHoverIndex((i) => (i + 1) % oneriler.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHoverIndex((i) => (i - 1 + oneriler.length) % oneriler.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const secilen = hoverIndex >= 0 ? oneriler[hoverIndex].ad : aranan;
      ara(secilen);
    } else if (e.key === "Escape") {
      setAcik(false);
    }
  };

  // eşleşeni kalın göster
  const highlight = (text: string, term: string) => {
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx < 0) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + term.length);
    const after = text.slice(idx + term.length);
    return (
      <>
        {before}
        <strong>{match}</strong>
        {after}
      </>
    );
  };

  return (
    <div className="relative w-full max-w-2xl" ref={wrapperRef}>
      {/* Arama kutusu */}
      <div
        className="flex items-center bg-gray-100 rounded-lg px-3 py-2 cursor-text"
        onClick={() => setAcik(true)}
      >
        <button
          className="text-gray-500 hover:text-black mr-2"
          onClick={(e) => {
            e.stopPropagation();
            ara();
          }}
        >
          <FaSearch />
        </button>

        <input
          type="text"
          placeholder="Ürün, marka veya kategori ara"
          className="w-full bg-gray-100 text-gray-700 placeholder-gray-400 outline-none text-sm sm:text-base"
          value={aranan}
          onChange={(e) => setAranan(e.target.value)}
          onFocus={() => setAcik(true)}
          onKeyDown={onKeyDown}
        />
      </div>

      {/* Açılır panel */}
      {acik && (
        <div className="absolute left-0 right-0 top-full mt-2 w-full bg-white shadow-lg rounded-lg border z-50 p-4 max-h-[70vh] overflow-y-auto">
          {/* Öneriler */}
          {aranan.trim().length >= 3 && (
            <div className="mb-4">
              <h3 className="text-xs sm:text-sm text-gray-500 font-semibold mb-2">Öneriler</h3>
              {oneriler.length === 0 ? (
                <p className="text-xs text-gray-400">Eşleşen sonuç bulunamadı.</p>
              ) : (
                <ul className="divide-y">
                  {oneriler.map((o, i) => (
                    <li
                      key={o.id}
                      className={`py-2 flex items-center gap-3 cursor-pointer ${i === hoverIndex ? "bg-gray-50" : ""}`}
                      onMouseEnter={() => setHoverIndex(i)}
                      onClick={() => ara(o.ad)}
                    >
                      {o.gorsel ? (
                        <img src={o.gorsel} alt={o.ad} className="w-8 h-8 object-contain rounded" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded" />
                      )}
                      <div className="flex-1 text-sm">
                        <div className="text-gray-800">{highlight(o.ad, aranan.trim())}</div>
                        {typeof o.fiyat === "number" && (
                          <div className="text-xs text-blue-600 font-semibold">
                            {o.fiyat.toLocaleString("tr-TR")} ₺
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Geçmiş Aramalar */}
          <div className="mb-4">
            <h3 className="text-xs sm:text-sm text-gray-500 font-semibold mb-2">Geçmiş Aramalar</h3>
            <div className="flex gap-2 flex-wrap">
              {(dinamikGecmis.length ? dinamikGecmis : []).map((item, i) => (
                <span
                  key={i}
                  className="bg-gray-200 px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                  onClick={() => ara(item)}
                >
                  {item}
                  <button
                    className="text-gray-500 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item);
                    }}
                    title="Sil"
                  >
                    ✕
                  </button>
                </span>
              ))}
              {/* Geçmiş boşsa bilgi */}
              {dinamikGecmis.length === 0 && (
                <span className="text-xs text-gray-400">Henüz geçmiş yok.</span>
              )}
            </div>
          </div>

          {/* Sana Özel Kategoriler */}
          <div className="mb-4">
            <h3 className="text-xs sm:text-sm text-gray-500 font-semibold mb-2">Sana Özel Kategoriler</h3>
            <div className="flex gap-2 flex-wrap">
              {sanaOzel.map((kat, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-3 py-1 rounded-full text-xs sm:text-sm cursor-pointer hover:bg-gray-200"
                  onClick={() => ara(kat.query)}
                >
                  {kat.label}
                </span>
              ))}
            </div>
          </div>

          {/* Popüler Aramalar + Önerilen Ürün */}
          <div>
            <h3 className="text-xs sm:text-sm text-gray-500 font-semibold mb-2">Popüler Aramalar</h3>
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {populer.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAktifPopuler(item);
                    ara(item);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border whitespace-nowrap ${
                    aktifPopuler === item ? "bg-blue-600 text-white" : "bg-white text-gray-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Önerilen Ürün (dinamik) */}
            {onerilenUrun && (
              <div className="flex items-center gap-3">
                {onerilenUrun.gorsel ? (
                  <img
                    src={onerilenUrun.gorsel}
                    alt={onerilenUrun.ad}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded" />
                )}
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm">{onerilenUrun.ad}</span>
                  <div className="flex flex-wrap gap-2 items-end mt-1">
                    {typeof onerilenUrun.fiyat === "number" && (
                      <span className="text-sm sm:text-lg font-semibold text-black">
                        {onerilenUrun.fiyat.toLocaleString("tr-TR")} TL
                      </span>
                    )}
                    {typeof onerilenUrun.eskiFiyat === "number" && (
                      <span className="line-through text-gray-400 text-xs sm:text-sm">
                        {onerilenUrun.eskiFiyat.toLocaleString("tr-TR")} TL
                      </span>
                    )}
                    {onerilenUrun.indirimMetni && (
                      <span className="text-xs sm:text-sm text-blue-600 font-semibold">
                        {onerilenUrun.indirimMetni}
                      </span>
                    )}
                  </div>
                  <a
                    href="#"
                    className="text-xs sm:text-sm text-blue-600 underline mt-1"
                    onClick={(e) => {
                      e.preventDefault();
                      ara(onerilenUrun.ad);
                    }}
                  >
                    Benzerlerini göster
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

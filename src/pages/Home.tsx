import { useState, useEffect } from "react";
import Slider from "../components/Slider";
import UrunCard from "../components/ProductCard";
import { Urun } from "../types/Product";
import SanaOzelUrunler from "../components/SpecialProductsForYou";
import EnIyiTeklifler from "../components/BestOffers";
import CokSatanlar from "../components/Bestsellers";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import NedenPasaj from "../components/WhyPasajFooter"
import PasajLimitProduct from "../components/PasajLimitProduct"
import Campaigns from "../components/Campaigns"
import Firsatlar from "../components/UnmissableOpportunities"
import SonIncelenenler from "../components/RecentlyViewed";

export default function Home() {
  const { kullanici } = useAuth();
  const [arama, setArama] = useState<string>("");
  const [kategori, setKategori] = useState<string>("tumu");
  const [siralama, setSiralama] = useState<string>("varsayilan");
  const [urunler, setUrunler] = useState<Urun[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Urun[]>([]);

  // ✅ Firestore'dan ürünleri çek
  useEffect(() => {
    const fetchUrunler = async () => {
      const querySnapshot = await getDocs(collection(db, "urunler"));
      const urunListesi: Urun[] = [];
      querySnapshot.forEach((doc) => {
        urunListesi.push({ id: doc.id as any, ...doc.data() } as Urun);
      });
      setUrunler(urunListesi);
    };
    fetchUrunler();
  }, []);

  // ✅ Son incelenen ürünleri çek (kullanıcıya özel)
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (!kullanici) return;
      const q = query(
        collection(db, "users", kullanici.uid, "recentlyViewed"),
        orderBy("tarih", "desc")
      );
      const snap = await getDocs(q);
      const liste: Urun[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Urun, "id">),
        }));
      setRecentlyViewed(liste);
    };
    fetchRecentlyViewed();
  }, [kullanici]);

  const kategoriler: string[] = ["tumu", ...new Set(urunler.map(u => u.kategori).filter(Boolean))];

  let filtreliUrunler: Urun[] = urunler.filter((urun) =>
    urun.ad.toLowerCase().includes(arama.toLowerCase())
  );

  if (kategori !== "tumu") {
    filtreliUrunler = filtreliUrunler.filter((urun) => urun.kategori === kategori);
  }

  if (siralama === "artan") {
    filtreliUrunler.sort((a, b) => a.fiyat - b.fiyat);
  } else if (siralama === "azalan") {
    filtreliUrunler.sort((a, b) => b.fiyat - a.fiyat);
  }

  return (
    <div>
      <div className="p-4 max-w-screen-xl mx-auto">
        <br/>
        <Slider />
        <br/>
        <SanaOzelUrunler />
        <br/>
        <PasajLimitProduct />
        <br/>
        <EnIyiTeklifler />
        <br/>
        <Campaigns />
        <br/>
        <CokSatanlar />
        <br/>
        <Firsatlar />
        <br/>
        <SonIncelenenler/>
        <br/>
        
      </div>
      <NedenPasaj/>
    </div>
  );
}

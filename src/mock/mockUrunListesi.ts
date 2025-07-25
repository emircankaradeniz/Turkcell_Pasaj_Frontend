
export interface Urun {
  id: number;
  ad: string;
  aciklama: string;
  fiyat: number;
  gorsel: string;
  kategori: string;
}

const mockUrunListesi: Urun[] = [
  {
    id: 1,
    ad: "iPhone 14 Pro",
    aciklama: "128GB - Mor",
    fiyat: 59999,
    gorsel: "/images/iphone14.jpg",
    kategori: "telefon"
  },
  {
    id: 2,
    ad: "Samsung Galaxy S24",
    aciklama: "256GB - Siyah",
    fiyat: 45999,
    gorsel: "/images/s24.jpg",
    kategori: "telefon"
  },
  {
    id: 3,
    ad: "AirPods Pro 2",
    aciklama: "Aktif Gürültü Engelleme",
    fiyat: 8499,
    gorsel: "/images/airpods.jpg",
    kategori: "aksesuar"
  },
  {
    id: 4,
    ad: "Apple Watch Series 9",
    aciklama: "41mm GPS",
    fiyat: 12499,
    gorsel: "/images/watch.jpg",
    kategori: "aksesuar"
  }
];

export default mockUrunListesi;

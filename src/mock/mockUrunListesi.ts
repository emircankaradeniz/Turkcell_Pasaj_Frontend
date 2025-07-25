import { Urun } from "../types/Urun";

const mockUrunListesi: Urun[] = [
  { id: 1, ad: "iPhone 14 Pro", aciklama: "128GB - Mor", fiyat: 59999, gorsel: "/images/iphone14.jpg", kategori: "Cep Telefonu-Aksesuar", altKategori: "Apple Telefonlar" },
  { id: 2, ad: "Samsung Galaxy S24", aciklama: "256GB - Siyah", fiyat: 45999, gorsel: "/images/s24.jpg", kategori: "Cep Telefonu-Aksesuar", altKategori: "Android Telefonlar" },
  { id: 3, ad: "AirPods Pro 2", aciklama: "Aktif Gürültü Engelleme", fiyat: 8499, gorsel: "/images/airpods.jpg", kategori: "Cep Telefonu-Aksesuar", altKategori: "Aksesuarlar" },
  { id: 4, ad: "Apple Watch Series 9", aciklama: "41mm GPS", fiyat: 12499, gorsel: "/images/watch.jpg", kategori: "Cep Telefonu-Aksesuar", altKategori: "Giyilebilir Teknolojiler" },
  { id: 5, ad: "Casper Nirvana C370", aciklama: "14'' 8GB RAM", fiyat: 8799, gorsel: "/images/laptop1.jpg", kategori: "Bilgisayar-Tablet", altKategori: "Dizüstü Bilgisayarlar" },
  { id: 6, ad: "Lenovo Tab M10", aciklama: "64GB Tablet", fiyat: 3999, gorsel: "/images/tablet1.jpg", kategori: "Bilgisayar-Tablet", altKategori: "Tabletler" },
  { id: 7, ad: "Xiaomi Redmi Buds 4", aciklama: "Bluetooth Kulaklık", fiyat: 799, gorsel: "/images/kulaklik1.jpg", kategori: "Cep Telefonu-Aksesuar", altKategori: "Aksesuarlar" },
  { id: 8, ad: "Logitech MX Master 3", aciklama: "Kablosuz Mouse", fiyat: 2499, gorsel: "/images/mouse1.jpg", kategori: "Bilgisayar-Tablet", altKategori: "Bilgisayar Çevre Birimleri" },
  { id: 9, ad: "Philips Airfryer", aciklama: "Yağsız Fritöz", fiyat: 4599, gorsel: "/images/fritoz1.jpg", kategori: "Elektrikli Ev Aletleri", altKategori: "Airfryer" },
  { id: 10, ad: "Vestel Çamaşır Makinesi", aciklama: "9kg - A++", fiyat: 8999, gorsel: "/images/camasir1.jpg", kategori: "Elektrikli Ev Aletleri", altKategori: "Çamaşır Makineleri" },
  { id: 11, ad: "Oral-B Elektrikli Diş Fırçası", aciklama: "Şarjlı, 3 Başlık", fiyat: 1299, gorsel: "/images/dis1.jpg", kategori: "Sağlık-Kişisel Bakım", altKategori: "Diş Bakımı" },
  { id: 12, ad: "PS5 DualSense Controller", aciklama: "Kablosuz", fiyat: 2199, gorsel: "/images/ps5.jpg", kategori: "Hobi-Oyun", altKategori: "Oyun Aksesuarları" },
  { id: 13, ad: "Samsung 4K Smart TV", aciklama: "55 inç UHD", fiyat: 18999, gorsel: "/images/tv1.jpg", kategori: "TV-Ses Sistemleri", altKategori: "Televizyonlar" },
  { id: 14, ad: "Mi Smart Band 8", aciklama: "Akıllı Bileklik", fiyat: 1099, gorsel: "/images/band.jpg", kategori: "Cep Telefonu-Aksesuar", altKategori: "Giyilebilir Teknolojiler" },
  { id: 15, ad: "Fakir Saç Kurutma Makinesi", aciklama: "2200W", fiyat: 799, gorsel: "/images/sac1.jpg", kategori: "Sağlık-Kişisel Bakım", altKategori: "Saç Bakımı" },
  { id: 16, ad: "Arzum Blender Seti", aciklama: "1000W", fiyat: 1499, gorsel: "/images/blender1.jpg", kategori: "Elektrikli Ev Aletleri", altKategori: "Blender" },
  { id: 17, ad: "MSI Gaming Laptop", aciklama: "RTX 4060, 16GB RAM", fiyat: 35999, gorsel: "/images/laptop2.jpg", kategori: "Bilgisayar-Tablet", altKategori: "Dizüstü Bilgisayarlar" },
  { id: 18, ad: "Dyson V11 Süpürge", aciklama: "Kablosuz Dikey", fiyat: 17499, gorsel: "/images/supurge.jpg", kategori: "Elektrikli Ev Aletleri", altKategori: "Elektrikli Süpürgeler" },
  { id: 19, ad: "Canon Yazıcı", aciklama: "Tarayıcı + Wifi", fiyat: 2999, gorsel: "/images/yazici1.jpg", kategori: "Bilgisayar-Tablet", altKategori: "Bilgisayar Çevre Birimleri" },
  { id: 20, ad: "Xiaomi Elektrikli Scooter", aciklama: "25km/h - Katlanabilir", fiyat: 11999, gorsel: "/images/scooter.jpg", kategori: "Hobi-Oyun", altKategori: "Hobi Ürünleri" },
];

export default mockUrunListesi;

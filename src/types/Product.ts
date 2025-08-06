export interface Satici {
  ad: string;
  puan: number;
  fiyat: number;
  kargo: string;
  ucretsizKargo: boolean;
  etiket: string;
}

export interface Urun {
  id: string;
  ad: string;
  aciklama: string;
  fiyat: number;
  gorsel?: string;
  kategori: string;
  kategoriId: string;
  altKategori?: string;
  altKategoriId?: string;
  adet?: number;
  renk?: string;
  secilenSatici?: Satici;
  saticilar?: Satici[]; // ✅ diğer satıcılar

  // ✅ Yeni ekledik
  ozellikler?: Record<string, string>; // teknik özellikler
}

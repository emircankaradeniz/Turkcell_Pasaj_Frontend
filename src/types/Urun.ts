export interface Urun {
  id: number;
  ad: string;
  aciklama: string;
  fiyat: number;
  gorsel?: string;
  kategori: string;
  altKategori?: string;
  adet?: number;
}

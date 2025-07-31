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
}

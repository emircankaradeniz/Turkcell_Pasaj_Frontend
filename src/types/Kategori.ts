
export enum KategoriEnum {
  Telefon = "telefon",
  Bilgisayar = "bilgisayar",
  EvAleti = "ev-aleti",
  KisiselBakim = "kişisel-bakım",
  Oyun = "oyun",
  TV = "tv",
  Ev = "ev"
}

export const KategoriAdlari: Record<KategoriEnum, string> = {
  [KategoriEnum.Telefon]: "Cep Telefonu-Aksesuar",
  [KategoriEnum.Bilgisayar]: "Bilgisayar-Tablet",
  [KategoriEnum.EvAleti]: "Elektrikli Ev Aletleri",
  [KategoriEnum.KisiselBakim]: "Sağlık-Kişisel Bakım",
  [KategoriEnum.Oyun]: "Hobi-Oyun",
  [KategoriEnum.TV]: "TV-Ses Sistemleri",
  [KategoriEnum.Ev]: "Ev-Yaşam",
};

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click } from "../utils/render";
import SaticiListesi from "../../components/SellerList";

// 🧲 BasketContext'i mockla
const sepeteEkleMock = vi.fn();
vi.mock("@/context/BasketContext", () => ({
  useSepet: () => ({ sepeteEkle: sepeteEkleMock }),
}));

// Ürün tipinde projende kategori/kategoriId zorunluysa bunları ekle
const urun = {
  id: "p1",
  ad: "Test Ürün",
  aciklama: "Açıklama",
  fiyat: 5000,
  gorsel: "x.png",
  kategori: "Elektronik",
  kategoriId: "kat1",
};

describe("SaticiListesi", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    sepeteEkleMock.mockReset();
  });

  it("satıcı kartlarını, fiyat/kargo/etiket ve puanı doğru render eder", () => {
    const saticilar = [
      { ad: "Satıcı 1", puan: 4.5, fiyat: 5500, kargo: "Hızlı Teslimat", ucretsizKargo: true, etiket: "İndirim" },
      { ad: "Satıcı 2", puan: 3.9, fiyat: 5300, kargo: "Standart", ucretsizKargo: false },
    ];

    const { container } = render(<SaticiListesi saticilar={saticilar} urun={urun} />);

    // Başlık
    expect(container.textContent).toContain("Diğer Satıcılar");

    // İsimler
    expect(container.textContent).toContain("Satıcı 1");
    expect(container.textContent).toContain("Satıcı 2");

    // Puanlar (toFixed(1))
    expect(container.textContent).toContain("4.5");
    expect(container.textContent).toContain("3.9");

    // Fiyatlar (TL ile)
    expect(container.textContent).toContain("5.500 TL");
    expect(container.textContent).toContain("5.300 TL");

    // Kargo/etiket
    expect(container.textContent).toContain("Hızlı Teslimat");
    expect(container.textContent).toContain("Standart");
    expect(container.textContent).toContain("Ücretsiz Kargo");
    expect(container.textContent).toContain("İndirim");
  });

  it("puan yoksa '-' gösterir", () => {
    const saticilar = [{ ad: "Satıcı X" }];

    const { container } = render(<SaticiListesi saticilar={saticilar} urun={urun} />);

    // Kartın sol üst rozeti '-'
    expect(container.textContent).toContain("-");
  });

  it("Ekle butonuna tıklayınca sepeteEkle, seçilen satıcının bilgileriyle çağrılır", () => {
    const saticilar = [
      { ad: "Satıcı 1", puan: 4.5, fiyat: 5500, kargo: "Hızlı Teslimat", ucretsizKargo: true, etiket: "İndirim" },
      { ad: "Satıcı 2", puan: 3.9, fiyat: 5300 },
    ];

    const { container } = render(<SaticiListesi saticilar={saticilar} urun={urun} />);

    // İlk kartın "Ekle" butonu
    const ekleBtns = Array.from(container.querySelectorAll("button")).filter(b => b.textContent?.trim() === "Ekle");
    expect(ekleBtns.length).toBe(2);

    click(ekleBtns[0]);

    expect(sepeteEkleMock).toHaveBeenCalledTimes(1);
    const payload = sepeteEkleMock.mock.calls[0][0];

    expect(payload.id).toBe(urun.id);
    expect(payload.ad).toBe(urun.ad);
    expect(payload.fiyat).toBe(5500); // satıcı fiyatı
    expect(payload.secilenSatici).toEqual({
      ad: "Satıcı 1",
      puan: 4.5,
      fiyat: 5500,
      kargo: "Hızlı Teslimat",
      ucretsizKargo: true,
      etiket: "İndirim",
    });
  });

  it("satıcı fiyatı yoksa ürün fiyatını kullanır", () => {
    const saticilar = [{ ad: "Satıcı Y", puan: 4.0 /* fiyat yok */ }];

    const { container } = render(<SaticiListesi saticilar={saticilar} urun={urun} />);

    const ekleBtn = Array.from(container.querySelectorAll("button")).find(b => b.textContent?.trim() === "Ekle")!;
    click(ekleBtn);

    const payload = sepeteEkleMock.mock.calls[0][0];
    expect(payload.fiyat).toBe(urun.fiyat); // fallback ürün fiyatı
    expect(payload.secilenSatici).toMatchObject({
      ad: "Satıcı Y",
      puan: 4.0,
      fiyat: 0,           // bileşende 0 atanıyor
      kargo: "",
      ucretsizKargo: false,
      etiket: "",
    });
  });

  it("satıcı adı yoksa 'Bilinmeyen Satıcı' yazar ve sepeteEkle'ye o ad gider", () => {
    const saticilar = [{ /* ad yok */ puan: 4.2, fiyat: 6000 }];

    const { container } = render(<SaticiListesi saticilar={saticilar} urun={urun} />);

    // Metinde yazmalı
    expect(container.textContent).toContain("Bilinmeyen Satıcı");

    const ekleBtn = Array.from(container.querySelectorAll("button")).find(b => b.textContent?.trim() === "Ekle")!;
    click(ekleBtn);

    const payload = sepeteEkleMock.mock.calls[0][0];
    expect(payload.secilenSatici.ad).toBe("Bilinmeyen Satıcı");
  });
});

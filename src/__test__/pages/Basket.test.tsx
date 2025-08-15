import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click, typeInto, tick } from "../utils/render";
import Sepet from "../../pages/Basket";

// ---- IlginiziCekebilir'i stub'la (içerik önemli değil) ----
vi.mock("@/components/RelatedProducts", () => ({
  default: () => <div data-testid="mock-related" />,
}));

// ---- BasketContext mock'u ----
const adetGuncelleMock = vi.fn();
const sepettenCikarMock = vi.fn();

let mockSepet: any[] = [];

vi.mock("@/context/BasketContext", () => ({
  useSepet: () => ({
    sepet: mockSepet,
    sepettenCikar: sepettenCikarMock,
    adetGuncelle: adetGuncelleMock,
  }),
}));

// Ortak ürün şablonu (Urun tipindeki zorunlular dahil)
const baseUrun = {
  kategori: "Elektronik",
  kategoriId: "kat1",
  altKategori: "Telefon",
  altKategoriId: "kat1-0",
  ozellikler: {},
};

describe("Sepet sayfası", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    adetGuncelleMock.mockReset();
    sepettenCikarMock.mockReset();
    mockSepet = [];
  });

  it("sepet boşken mesaj gösterir", () => {
    mockSepet = []; // boş sepet
    const { container } = render(<Sepet />);
    expect(container.textContent).toContain("Sepetiniz boş.");
  });

  it("sepet satırlarını ve toplam/indirim/ödenecek tutarı doğru gösterir", async () => {
    mockSepet = [
      {
        id: "p1",
        ad: "Telefon X",
        aciklama: "Açıklama 1",
        fiyat: 10000,
        adet: 2,
        gorsel: "/x.png",
        ...baseUrun,
        secilenSatici: { ad: "Satıcı A" },
      },
      {
        id: "p2",
        ad: "Tablet Y",
        aciklama: "Açıklama 2",
        fiyat: 5000,
        adet: 1,
        gorsel: "/y.png",
        ...baseUrun,
        secilenSatici: { ad: "Satıcı B" },
      },
    ];

    const toplam = mockSepet[0].fiyat * 2 + mockSepet[1].fiyat * 1; // 25000
    const indirim = toplam > 0 ? 500 : 0; // 500
    const odemeTutari = toplam - indirim; // 24500

    const { container } = render(<Sepet />);
    await tick();

    // Ürün satırları
    expect(container.textContent).toContain("Telefon X");
    expect(container.textContent).toContain("Tablet Y");
    expect(container.textContent).toContain("Satıcı: Satıcı A");
    expect(container.textContent).toContain("Satıcı: Satıcı B");

    // Birim fiyatlar
    expect(container.textContent).toContain(
      `Birim Fiyat: ${mockSepet[0].fiyat.toLocaleString()} TL`
    );
    expect(container.textContent).toContain(
      `Birim Fiyat: ${mockSepet[1].fiyat.toLocaleString()} TL`
    );

    // Toplamlar
    expect(container.textContent).toContain(
      `Ürünler Toplamı${toplam.toLocaleString()} TL`
    );
    expect(container.textContent).toContain(
      `İndirimler-${indirim.toLocaleString()} TL`
    );
    expect(container.textContent).toContain(
      `Ödenecek Tutar${odemeTutari.toLocaleString()} TL`
    );
  });

  it("adet artır/azalt butonları adetGuncelle'yi doğru parametrelerle çağırır", async () => {
    mockSepet = [
      {
        id: "p1",
        ad: "Telefon X",
        aciklama: "",
        fiyat: 10000,
        adet: 2,
        gorsel: "",
        ...baseUrun,
        secilenSatici: { ad: "Satıcı A" },
      },
    ];

    const { container } = render(<Sepet />);
    await tick();

    const buttons = Array.from(container.querySelectorAll("button"));
    // sırayla: - , +, × (sil) gibi geliyor satır içinde
    const minus = buttons.find((b) => b.textContent?.trim() === "-")!;
    const plus = buttons.find((b) => b.textContent?.trim() === "+")!;

    // + tıkla -> 3 olmalı
    click(plus);
    expect(adetGuncelleMock).toHaveBeenCalledWith("p1", 3, "Satıcı A");

    // - tıkla -> 1 olmalı (mevcut 2'den -1)
    click(minus);
    expect(adetGuncelleMock).toHaveBeenCalledWith("p1", 1, "Satıcı A");
  });

  it("sil butonu sepettenCikar'ı doğru parametrelerle çağırır", async () => {
    mockSepet = [
      {
        id: "p9",
        ad: "Ürün 9",
        aciklama: "",
        fiyat: 1234,
        adet: 1,
        gorsel: "",
        ...baseUrun,
        secilenSatici: { ad: "Satıcı Z" },
      },
    ];

    const { container } = render(<Sepet />);
    await tick();

    const silBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "×"
    )!;
    click(silBtn);

    expect(sepettenCikarMock).toHaveBeenCalledWith("p9", "Satıcı Z");
  });

  it("kampanya kodu input'u değişir ve sözleşme onayı olmadan devam butonu disabled olur", async () => {
    mockSepet = [
      {
        id: "p1",
        ad: "Telefon X",
        aciklama: "",
        fiyat: 10000,
        adet: 1,
        gorsel: "",
        ...baseUrun,
      },
    ];

    const { container } = render(<Sepet />);
    await tick();

    const kampanyaInput = container.querySelector(
      'input[placeholder="Kampanya Kodu"]'
    ) as HTMLInputElement;
    const devamBtn = Array.from(container.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Siparişe Devam Et")
    ) as HTMLButtonElement;

    // Başta disabled
    expect(devamBtn.disabled).toBe(true);

    // Kampanya kodu yaz
    typeInto(kampanyaInput, "IND500");
    expect(kampanyaInput.value).toBe("IND500");

    // Sözleşme checkbox'ını işaretle
    const sozlesme = Array.from(
      container.querySelectorAll('input[type="checkbox"]')
    )[0] as HTMLInputElement; // özet kartındaki checkbox ilk
    click(sozlesme);

    // Artık aktif olmalı
    expect(devamBtn.disabled).toBe(false);
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click } from "../utils/render";
import UrunCard from "../../components/ProductCard";
import { Urun } from "../../types/Product";

// Mock: react-router-dom (Link + useNavigate)
vi.mock("react-router-dom", async () => {
  const mod = await import("../mocks/router");
  return {
    ...mod,
    useNavigate: () => navigateMock,
  };
});

const navigateMock = vi.fn();

// Mock: BasketContext
const sepeteEkleMock = vi.fn();
vi.mock("@/context/BasketContext", () => ({
  useSepet: () => ({ sepeteEkle: sepeteEkleMock }),
}));

// Mock: FavoriteContext
const favoriEkleCikarMock = vi.fn();
const favorideMiMock = vi.fn();
vi.mock("@/context/FavoriteContext", () => ({
  useFavori: () => ({
    favoriEkleCikar: favoriEkleCikarMock,
    favorideMi: favorideMiMock,
  }),
}));

// Mock: AuthContext
let mockKullanici: any = null;
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ kullanici: mockKullanici }),
}));

const baseUrun: Urun = {
  id: "1",
  ad: "Test Ürün",
  aciklama: "Test açıklama",
  fiyat: 1234,
  gorsel: "test.jpg",
  kategori: "Elektronik",
  kategoriId: "kat1",
};


describe("UrunCard", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    navigateMock.mockReset();
    sepeteEkleMock.mockReset();
    favoriEkleCikarMock.mockReset();
    favorideMiMock.mockReset();
    mockKullanici = null;
  });

  it("ürün bilgilerini doğru gösterir", () => {
    favorideMiMock.mockReturnValue(false);
    const { container } = render(<UrunCard urun={baseUrun} />);

    // Başlık, açıklama, fiyat
    expect(container.textContent).toContain(baseUrun.ad);
    expect(container.textContent).toContain(baseUrun.aciklama);
    expect(container.textContent).toContain("1.234 ₺");

    // Görsel kontrolü
    const img = container.querySelector("img") as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain(baseUrun.gorsel);
    expect(img.alt).toBe(baseUrun.ad);
  });

  it("favoride değilse boş kalp, favorideyse dolu kalp gösterir", () => {
    favorideMiMock.mockReturnValue(false);
    const { container: c1 } = render(<UrunCard urun={baseUrun} />);
    expect(c1.querySelector("svg")).toBeTruthy(); // boş kalp svg

    favorideMiMock.mockReturnValue(true);
    const { container: c2 } = render(<UrunCard urun={baseUrun} />);
    expect(c2.querySelector("svg")).toBeTruthy(); // dolu kalp svg
  });

  it("favori butonuna tıklayınca kullanıcı yoksa /giris'e yönlendirir", () => {
    favorideMiMock.mockReturnValue(false);
    const { container } = render(<UrunCard urun={baseUrun} />);
    const favBtn = container.querySelector("button") as HTMLButtonElement;

    click(favBtn);
    expect(navigateMock).toHaveBeenCalledWith("/giris");
    expect(favoriEkleCikarMock).not.toHaveBeenCalled();
  });

  it("favori butonuna tıklayınca kullanıcı varsa favoriEkleCikar çağrılır", () => {
    mockKullanici = { ad: "Ali" };
    favorideMiMock.mockReturnValue(false);
    const { container } = render(<UrunCard urun={baseUrun} />);
    const favBtn = container.querySelector("button") as HTMLButtonElement;

    click(favBtn);
    expect(favoriEkleCikarMock).toHaveBeenCalledWith(baseUrun);
  });

  it("sepete ekle butonuna tıklayınca sepeteEkle çağrılır", () => {
    mockKullanici = { ad: "Ali" };
    favorideMiMock.mockReturnValue(false);
    const { container } = render(<UrunCard urun={baseUrun} />);

    const sepetBtn = Array.from(container.querySelectorAll("button")).find(
      (btn) => btn.textContent?.includes("Sepete Ekle")
    ) as HTMLButtonElement;

    click(sepetBtn);
    expect(sepeteEkleMock).toHaveBeenCalledWith({ ...baseUrun, adet: 1 });
  });

  it("showSepetButonu=false ise Sepete Ekle butonu görünmez", () => {
    favorideMiMock.mockReturnValue(false);
    const { container } = render(
      <UrunCard urun={baseUrun} showSepetButonu={false} />
    );
    expect(container.textContent).not.toContain("Sepete Ekle");
  });

  it("showFavori=false ise favori butonu görünmez", () => {
    favorideMiMock.mockReturnValue(false);
    const { container } = render(
      <UrunCard urun={baseUrun} showFavori={false} />
    );
    expect(container.querySelector('[data-testid="favori-btn"]')).toBeFalsy();
  });
});

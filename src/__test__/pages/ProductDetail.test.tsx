import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, tick } from "../utils/render";
import * as firestore from "firebase/firestore";
import ProductDetail from "../../pages/ProductDetail";

/* ---- HOISTED spies (vitest kuralı) ---- */
const { sepeteEkleSpy } = vi.hoisted(() => ({
  sepeteEkleSpy: vi.fn(),
}));

/* ---- Router: sadece useParams'ı ez ---- */
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useParams: () => ({ id: "u1" }),
  };
});

/* ---- Sepet context: sepeteEkle spy kullan ---- */
vi.mock("../../context/BasketContext", () => ({
  useSepet: () => ({ sepeteEkle: sepeteEkleSpy }),
}));

/* ---- Auth: setDoc zorunlu olmasın diye kullanıcıyı null ver ---- */
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ kullanici: null }),
}));

/* ---- Alt bileşenleri stubla ---- */
vi.mock("../../components/ProductCard", () => ({
  default: () => <div data-testid="product-card-stub" />,
}));
vi.mock("../../components/SellerList", () => ({
  default: () => <div data-testid="seller-list-stub" />,
}));
vi.mock("../../components/ProductTabs", () => ({
  default: () => <div data-testid="product-tabs-stub" />,
}));

/* ---- Firestore modül mock'u ---- */
vi.mock("firebase/firestore", () => {
  return {
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(),
    collection: vi.fn(),
    where: vi.fn(),
    query: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    addDoc: vi.fn(),
  };
});

describe("ProductDetail", () => {
  beforeEach(() => {
    sepeteEkleSpy.mockReset();

    // Ürün detayını döndür
    (firestore.getDoc as any).mockResolvedValue({
      exists: () => true,
      id: "u1",
      data: () => ({
        ad: "iPhone 15",
        gorsel: "/iphone.png",
        fiyat: 65000,
        kategori: "Elektronik",
        renk: "Siyah",
        aciklama: "Açıklama",
        ozellikler: {},
        saticilar: [],
      }),
    });

    // Benzer ürünler / yorumlar boş liste
    (firestore.getDocs as any).mockResolvedValue({ docs: [] });

    // Yan etkiler no-op
    (firestore.setDoc as any).mockResolvedValue(undefined);
    (firestore.addDoc as any).mockResolvedValue(undefined);
  });

  it("ürün başlığını gösterir", async () => {
    const { getByTestId } = render(<ProductDetail />);
    await tick(0); // useEffect + getDoc bekle

    const baslikEl = getByTestId("product-title");
    expect(baslikEl).not.toBeNull();
    expect(baslikEl?.textContent).toContain("iPhone");
  });

  it("sepete ekleme butonuna tıklanır", async () => {
    const { getByTestId } = render(<ProductDetail />);
    await tick(0); // useEffect + getDoc bekle

    const btn = getByTestId("add-to-cart-btn") as HTMLButtonElement;
    expect(btn).not.toBeNull();

    btn.click();

    // Focus yerine gerçek davranışı doğrula
    expect(sepeteEkleSpy).toHaveBeenCalledTimes(1);
    expect(sepeteEkleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: "u1", ad: "iPhone 15" })
    );
  });
});

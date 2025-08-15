import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Kategori from "../../pages/Categori";
import { render, tick } from "../utils/render";

/* ---- Firebase config stub (getFirestore hatasını önler) ---- */
vi.mock("../../firebase", () => ({ db: {} }));

/* ---- Çocuk bileşenleri hafif mock ---- */
vi.mock("../../components/ProductCard", () => ({
  default: ({ urun }: any) => <div data-testid="urun-card">{urun.ad}</div>,
}));
vi.mock("../../components/MostPopularinCategory", () => ({
  default: () => <div data-testid="most-popular-in-category" />,
}));

/* ---- Firestore mock: tüm fn'ler fabrika içinde tanımlı ---- */
vi.mock("firebase/firestore", () => {
  const collection = vi.fn((..._args) => ({ __type: "collection" }));
  const getDocs = vi.fn(() =>
    Promise.resolve({
      docs: [
        { id: "1", data: () => ({ ad: "Ürün 1", kategori: "Bilgisayar" }) },
        { id: "2", data: () => ({ ad: "Ürün 2", kategori: "Telefon" }) },
      ],
    })
  );
  const doc = vi.fn((..._args) => ({ __type: "doc" }));
  const getDoc = vi.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({ altKategoriler: ["Oyun", "Ofis"] }),
    })
  );
  return { collection, getDocs, doc, getDoc };
});

/* ---- Router mock ---- */
vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ search: "?kategori=Bilgisayar" }),
    useNavigate: () => vi.fn(),
  };
});

describe("Kategori Sayfası", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("alt kategorileri ve ürünleri render ediyor", async () => {
    const { container, getAllByTestId } = render(<Kategori />);
    await tick(0); // async firestore beklenir

    // Alt kategoriler
    expect(container.textContent).toContain("Oyun");
    expect(container.textContent).toContain("Ofis");

    // Ürün kartları
    const urunKartlari = getAllByTestId("urun-card");
    expect(urunKartlari.length).toBeGreaterThan(0);
  });
});

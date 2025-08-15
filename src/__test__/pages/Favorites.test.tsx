import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click, tick } from "../utils/render";
import Favoriler from "../../pages/Favorites";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

/* Firestore'u no-op mockla (Favorites bu dosyada Firestore kullanmıyor ama güvenli dursun) */
vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  limit: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

/* RelatedProducts stub (Favorites.tsx -> "../components/RelatedProducts") */
vi.mock("../../components/RelatedProducts", () => ({
  default: () => <div data-testid="related-products-stub" />,
}));

/* FavoriteContext mock’u: favoriler ZORUNLU (undefined olursa .map patlar) */
let mockFavoriler: any[] = [];
vi.mock("../../context/FavoriteContext", () => ({
  useFavori: () => ({
    favoriler: mockFavoriler,
    favorideMi: vi.fn(() => false),
    favoriEkleCikar: vi.fn(),
  }),
}));

/* AuthContext mock’u */
let mockUser: any = { uid: "u1", email: "test@example.com" };
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ kullanici: mockUser }),
}));

/* Router mock’u —> KISMİ MOCK (gerçek modülü yayıp sadece 2 şeyi ez) */
const navigateMock = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual, // MemoryRouter, Routes, Route vs. aynen kalsın
    Link: ({ to, children }: any) => (
      <a href={to} data-testid="mock-link">
        {children}
      </a>
    ),
    useNavigate: () => navigateMock,
  };
});

/* Ürün tipinde zorunlu alanlar */
const baseUrun = {
  altKategoriId: "",
  altKategori: "",
  adet: 1,
  ozellikler: {},
} as const;

describe("Favoriler Sayfası", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    navigateMock.mockReset();
    mockUser = { uid: "u1", email: "test@example.com" };
    mockFavoriler = [];

    Object.defineProperty(window, "innerWidth", {
      value: 1280,
      writable: true,
      configurable: true,
    });
  });

  it("kullanıcı yoksa /giris'e yönlendirir", async () => {
    mockUser = null;
    render(<Favoriler />);

    // useEffect -> navigate asenkron olabilir; bekle
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/giris");
    });
  });

  it(
    "favorileri listeler; arama ve kategori filtresi çalışır",
    async () => {
      mockFavoriler = [
        {
          id: "p1",
          ad: "iPhone 15",
          aciklama: "Apple telefon",
          fiyat: 65000,
          gorsel: "/iphone.png",
          kategori: "Elektronik",
          ...baseUrun,
        },
        {
          id: "p2",
          ad: "Çamaşır Makinesi Z",
          aciklama: "Beyaz eşya",
          fiyat: 18000,
          gorsel: "/wash.png",
          kategori: "Beyaz Eşya",
          kategoriId: "kat2",
          ...baseUrun,
        },
      ];

      const { container } = render(<Favoriler />);
      await tick(0);

      // Başlık + iki ürün
      expect(container.textContent).toContain("Favorilerim");
      expect(container.textContent).toContain("iPhone 15");
      expect(container.textContent).toContain("Çamaşır Makinesi Z");

      // Kategori seçenekleri
      const katSelect = container.querySelector("select") as HTMLSelectElement;
      const katOptions = Array.from(katSelect.querySelectorAll("option")).map(
        (o) => o.textContent?.trim()
      );
      expect(katOptions).toContain("Tümü");
      expect(katOptions).toContain("Elektronik");
      expect(katOptions).toContain("Beyaz Eşya");

      // Arama ile filtre
      const search = container.querySelector(
        'input[placeholder="Ürün ara..."]'
      ) as HTMLInputElement;
      const user = userEvent.setup();

      await user.clear(search);
      await user.type(search, "iphone");

      await waitFor(() => {
        expect(container.textContent).toContain("iPhone 15");
        expect(container.textContent).not.toContain("Çamaşır Makinesi Z");
      });

      // Aramayı temizle, kategori seç
      await user.clear(search);
      await user.selectOptions(katSelect, "Beyaz Eşya");

      await waitFor(() => {
        expect(container.textContent).toContain("Çamaşır Makinesi Z");
        expect(container.textContent).not.toContain("iPhone 15");
      });
    },
    15000
  );

  it("mobil menü küçük ekranda toggle ile açılır", async () => {
    Object.defineProperty(window, "innerWidth", {
      value: 375,
      writable: true,
      configurable: true,
    });

    mockFavoriler = [
      {
        id: "p1",
        ad: "iPhone 15",
        aciklama: "",
        fiyat: 1,
        kategori: "Elektronik",
        ...baseUrun,
      },
    ];

    const { container } = render(<Favoriler />);
    await tick(0);

    const toggleBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Menüyü Göster"
    )!;
    expect(toggleBtn).toBeTruthy();

    click(toggleBtn);
    await tick(0);

    expect(container.textContent).toContain("Pasaj Limitini Öğren");

    const hideBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Menüyü Gizle"
    )!;
    expect(hideBtn).toBeTruthy();
  });

  it("RelatedProducts stub bileşeni render olur", async () => {
    mockFavoriler = [
      {
        id: "p1",
        ad: "iPhone 15",
        aciklama: "",
        fiyat: 1,
        kategori: "Elektronik",
        ...baseUrun,
      },
    ];

    const { getByTestId } = render(<Favoriler />);
    await tick(0);

    const related = getByTestId("related-products-stub");
    expect(related).toBeTruthy();
  });

  it("ürün kartında fiyat ve sarı kalp görünür", async () => {
    mockFavoriler = [
      {
        id: "p1",
        ad: "iPhone 15",
        aciklama: "Apple telefon",
        fiyat: 65000,
        gorsel: "/iphone.png",
        kategori: "Elektronik",
        ...baseUrun,
      },
    ];

    const { container } = render(<Favoriler />);
    await tick(0);

    expect(container.textContent).toContain(
      `${(65000).toLocaleString("tr-TR")}₺`
    );
    const yellowHeart = container.querySelector(".text-yellow-400");
    expect(yellowHeart).toBeTruthy();
  });
});

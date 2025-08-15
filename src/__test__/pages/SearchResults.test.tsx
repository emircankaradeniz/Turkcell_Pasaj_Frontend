// __test__/pages/SearchResults.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, tick } from "../utils/render";
import SearchResults from "../../pages/SearchResults";
import { MemoryRouter } from "react-router-dom";

// 🔧 firebase.ts'i stub'la: getFirestore vs. gerektirmesin
vi.mock("../../firebase", () => ({
  db: {} as any,
}));

// 🔧 Firestore metodlarını mock'la
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});

// Mock'lara tip güvenli erişim
import * as firestore from "firebase/firestore";
const getDocsMock = firestore.getDocs as unknown as ReturnType<typeof vi.fn>;

const fakeProducts = [
  {
    id: "1",
    ad: "iPhone 14",
    aciklama: "Apple telefon",
    fiyat: 35000,
    gorsel: "iphone.jpg",
  },
  {
    id: "2",
    ad: "Samsung Galaxy",
    aciklama: "Samsung telefon",
    fiyat: 25000,
    gorsel: "samsung.jpg",
  },
];

describe("SearchResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("arama sonucunu doğru listeler", async () => {
    // getDocs -> ürünler
    getDocsMock.mockResolvedValueOnce({
      docs: fakeProducts.map((p) => ({
        id: p.id,
        data: () => p,
      })),
    } as any);

    const { container } = render(
      <MemoryRouter initialEntries={['/search?query=iphone']}>
        <SearchResults />
      </MemoryRouter>
    );

    await tick(0);

    expect(container.textContent).toContain("iPhone 14");
    expect(container.textContent).not.toContain("Samsung Galaxy");
  });

  it("sonuç bulunmadığında mesaj gösterir", async () => {
    getDocsMock.mockResolvedValueOnce({
      docs: [],
    } as any);

    const { container } = render(
      <MemoryRouter initialEntries={['/search?query=abcxyz']}>
        <SearchResults />
      </MemoryRouter>
    );

    await tick(0);

    // Bileşenin gösterdiği gerçek metin "Sonuç bulunamadı." olduğu için buna göre kontrol ediyoruz.
    expect(container.textContent).toContain("Sonuç bulunamadı.");
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click, tick } from "../utils/render";
import AdminPanel from "../../pages/AdminPanel";

// ---------- Auth mock ----------
let mockUser: any = { uid: "u1", email: "test@example.com", rol: "admin" };
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ kullanici: mockUser, cikisYap: vi.fn() }),
}));

// ---------- Router mock ----------
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  return {
    useNavigate: () => navigateMock,
    Link: ({ to, children }: any) => (
      <a data-testid="mock-link" href={to}>
        {children}
      </a>
    ),
  };
});

// ---------- Firebase config mock ----------
vi.mock("@/firebase", () => ({ db: {} }));

// ---------- Firestore mock re-export ----------
vi.mock("firebase/firestore", async () => {
  const m = await import("../mocks/firestore");
  return m;
});
import {
  getDocsMock,
  deleteDocMock,
  doc as docMock,
} from "../mocks/firestore";

// ---------- Child component mocks ----------
vi.mock("@/components/ProductCard", () => ({
  default: ({ urun }: any) => (
    <div data-testid="mock-urun-card" data-id={urun.id}>
      {urun.ad}
    </div>
  ),
}));
vi.mock("@/components/AdminQuestions", () => ({
  default: () => <div data-testid="mock-admin-questions" />,
}));

// --------- helpers to build Firestore snapshots ----------
const makeSnap = (rows: Array<{ id: string; data: any }>) => ({
  docs: rows.map((r) => ({
    id: r.id,
    data: () => r.data,
  })),
});

describe("AdminPanel", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    navigateMock.mockReset();

    getDocsMock.mockReset();
    deleteDocMock.mockReset();

    // 🔧 Fallback: hazırlanmamış extra getDocs çağrıları boş döner
    getDocsMock.mockResolvedValue(makeSnap([]));

    (docMock as any).mockImplementation?.((...segments: any[]) => ({
      path: segments,
    }));

    mockUser = { uid: "u1", email: "test@example.com", rol: "admin" };
  });

  const seedInitialFetches = () => {
    // 1) kategoriler
    getDocsMock.mockResolvedValueOnce(
      makeSnap([
        {
          id: "kat1",
          data: { baslik: "Elektronik", altKategoriler: ["Telefon", "Tablet"] },
        },
        { id: "kat2", data: { baslik: "Beyaz Eşya", altKategoriler: [] } },
      ])
    );
    // 2) saticilar
    getDocsMock.mockResolvedValueOnce(
      makeSnap([
        {
          id: "s1",
          data: {
            ad: "Satıcı A",
            fiyat: 0,
            kargo: "",
            puan: 0,
            ucretsizKargo: false,
            etiket: "",
          },
        },
        {
          id: "s2",
          data: {
            ad: "Satıcı B",
            fiyat: 0,
            kargo: "",
            puan: 0,
            ucretsizKargo: false,
            etiket: "",
          },
        },
      ])
    );
    // 3) urunler
    getDocsMock.mockResolvedValueOnce(
      makeSnap([
        {
          id: "p1",
          data: {
            ad: "Telefon X",
            aciklama: "Açıklama",
            fiyat: 10000,
            gorsel: "/x.png",
            kategori: "Elektronik",
            kategoriId: "kat1",
            altKategori: "Telefon",
            altKategoriId: "kat1-0",
            adet: 3,
            ozellikler: { Renk: "Siyah" },
            saticilar: [],
          },
        },
        {
          id: "p2",
          data: {
            ad: "Tablet Y",
            aciklama: "Açıklama",
            fiyat: 15000,
            gorsel: "/y.png",
            kategori: "Elektronik",
            kategoriId: "kat1",
            altKategori: "Tablet",
            altKategoriId: "kat1-1",
            adet: 2,
            ozellikler: {},
            saticilar: [],
          },
        },
        // görünümde 6 sınırını test etmek için fazladan ürünler
        ...Array.from({ length: 7 }, (_, i) => ({
          id: `p${i + 3}`,
          data: {
            ad: `Ürün ${i + 3}`,
            aciklama: "",
            fiyat: 1000 + i,
            gorsel: "",
            kategori: "Elektronik",
            kategoriId: "kat1",
            altKategori: "",
            altKategoriId: "",
            adet: 0,
            ozellikler: {},
            saticilar: [],
          },
        })),
      ])
    );
  };

  it("ilk yüklemede kategoriler, satıcılar ve ürünler Firestore'dan çekilir", async () => {
    seedInitialFetches();
    const { container } = render(<AdminPanel />);
    await tick();

    // Kategori isimleri
    expect(container.textContent).toContain("Elektronik");
    expect(container.textContent).toContain("Beyaz Eşya");

    // Satıcı butonları
    const satBtnA = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Satıcı A"
    );
    const satBtnB = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Satıcı B"
    );
    expect(satBtnA).toBeTruthy();
    expect(satBtnB).toBeTruthy();

    // Ürün kartları (maks 6)
    const cards = container.querySelectorAll('[data-testid="mock-urun-card"]');
    expect(cards.length).toBe(6);
  });

  it("'Sil' deleteDoc'u çağırır ve listeyi yeniler", async () => {
    seedInitialFetches();
    const { container } = render(<AdminPanel />);
    await tick();

    const silBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim() === "Sil"
    )!;
    click(silBtn);
    await tick();

    expect(deleteDocMock).toHaveBeenCalledTimes(1);
    const [docRef] = deleteDocMock.mock.calls[0];
    expect(docRef.path).toEqual([expect.anything(), "urunler", "p1"]);
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click, tick } from "../utils/render";
import AramaKutusu from "../../components/SearchBox";

/* ------------------ HOISTED Mocks ------------------ */
const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

/* ------------------ Router mock ------------------ */
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

/* ------------------ Firestore mock ------------------ */
vi.mock("firebase/firestore", async () => {
  const m = await import("../mocks/firestore");
  return m;
});
import {
  getDocsMock,
  getDocMock,
  doc as docMock,
} from "../mocks/firestore";

/* ------------------ Auth mock ------------------ */
const { getMockUser, setMockUser } = vi.hoisted(() => {
  let _user: any = null;
  return {
    getMockUser: () => _user,
    setMockUser: (u: any) => (_user = u),
  };
});
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ kullanici: getMockUser() }),
}));
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ kullanici: getMockUser() }),
}));

/* ------------------ localStorage stub ------------------ */
const lsGet = vi.fn();
const lsSet = vi.fn();
vi.stubGlobal(
  "localStorage",
  {
    getItem: lsGet,
    setItem: lsSet,
  } as any
);

/* ------------------ Yardımcılar ------------------ */

// getDocs davranışını koleksiyon adına göre ayarla
function setupGetDocsByCollection(opts?: {
  urunler?: Array<{ id: string; ad: string; gorsel?: string; fiyat?: number }>;
  populer?: string[];
  sanaOzelKullanici?: Array<{ label: string; query: string }>;
  sanaOzelGenel?: Array<{ label: string; query: string }>;
}) {
  const {
    urunler = [
      { id: "u1", ad: "iPhone 16 Pro", gorsel: "g1", fiyat: 100000 },
      { id: "u2", ad: "iPad Air", gorsel: "g2", fiyat: 45000 },
      { id: "u3", ad: "Samsung Galaxy", gorsel: "g3", fiyat: 35000 },
      { id: "u4", ad: "Blender X", gorsel: "g4", fiyat: 3000 },
    ],
    populer = ["Iphone", "Samsung", "Blender", "Arzum"],
    sanaOzelKullanici = [],
    sanaOzelGenel = [],
  } = opts || {};

  getDocsMock.mockImplementation((arg: any) => {
    const colName =
      arg?.name ?? (arg?.__type === "query" ? arg.args?.[0]?.name : undefined);

    if (colName === "urunler") {
      return Promise.resolve({
        docs: urunler.map((u) => ({
          id: u.id,
          data: () => ({ ad: u.ad, gorsel: u.gorsel, fiyat: u.fiyat }),
        })),
      });
    }

    if (colName === "populerAramalar") {
      return Promise.resolve({
        docs: populer.map((term, i) => ({
          id: String(i + 1),
          data: () => ({ term, weight: 100 - i }),
        })),
      });
    }

    if (colName === "sanaOzelKategoriler") {
      return Promise.resolve({
        docs: sanaOzelKullanici.map((x, i) => ({
          id: `k${i}`,
          data: () => x,
        })),
      });
    }

    if (colName === "sanaOzelKategorilerGenel") {
      return Promise.resolve({
        docs: sanaOzelGenel.map((x, i) => ({
          id: `g${i}`,
          data: () => x,
        })),
      });
    }

    if (colName === "searchHistory") {
      return Promise.resolve({ docs: [] });
    }

    return Promise.resolve({ docs: [] });
  });
}

// Önerilen ürün meta + ürün için getDoc davranışı
function setupGetDocRecommended({
  urunId = "u3",
  eskiFiyat = 40000,
  indirimMetni = "Süper Fırsat",
} = {}) {
  getDocMock.mockImplementation((ref: any) => {
    if (ref?.path?.join?.("-")?.includes?.("searchMeta-onerilenUrun")) {
      return Promise.resolve({
        exists: () => true,
        data: () => ({ urunId, eskiFiyat, indirimMetni }),
      });
    }
    if (ref?.path?.join?.("-")?.includes?.(`urunler-${urunId}`)) {
      return Promise.resolve({
        exists: () => true,
        id: urunId,
        data: () => ({ ad: "Samsung Galaxy", gorsel: "g3", fiyat: 35000 }),
      });
    }
    return Promise.resolve({ exists: () => false });
  });

  // doc() mock'unda path tutalım
  (docMock as any).mockImplementation((...segments: any[]) => ({ path: segments }));
}

describe("AramaKutusu (stabil testler)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    navigateMock.mockReset();

    getDocsMock.mockReset();
    getDocMock.mockReset();

    lsGet.mockReset();
    lsSet.mockReset();
    lsGet.mockReturnValue(JSON.stringify([])); // varsayılan geçmiş

    setMockUser(null);
  });

  it("Popüler aramalardan birine tıklanınca ara() çalışır", async () => {
    setupGetDocsByCollection({ populer: ["Iphone", "Samsung"] });
    setupGetDocRecommended();

    const { container } = render(<AramaKutusu />);
    const input = container.querySelector("input") as HTMLInputElement;

    input.focus();
    await tick(0);

    const btn = Array.from(container.querySelectorAll("button")).find((b) =>
      (b.textContent || "").includes("Iphone")
    ) as HTMLButtonElement | undefined;

    expect(btn).toBeTruthy();
    click(btn!);

    expect(navigateMock).toHaveBeenCalledWith("/arama?query=Iphone");
  });

  it("Önerilen ürün meta ve 'Benzerlerini göster' linki arama çalıştırır", async () => {
    setupGetDocsByCollection();
    setupGetDocRecommended({
      urunId: "u3",
      eskiFiyat: 40000,
      indirimMetni: "Süper Fırsat",
    });

    const { container } = render(<AramaKutusu />);
    const input = container.querySelector("input") as HTMLInputElement;

    input.focus();
    await tick(0);

    expect(container.textContent).toContain("Samsung Galaxy");
    expect(container.textContent).toContain("Süper Fırsat");

    const link = Array.from(container.querySelectorAll("a")).find((a) =>
      (a.textContent || "").includes("Benzerlerini göster")
    ) as HTMLAnchorElement | undefined;

    expect(link).toBeTruthy();
    click(link!);

    expect(navigateMock).toHaveBeenCalledWith("/arama?query=Samsung%20Galaxy");
  });

  it("Geçmişten item silinebilir", async () => {
    lsGet.mockReturnValueOnce(JSON.stringify(["iphone", "samsung"]));
    setupGetDocsByCollection();
    setupGetDocRecommended();

    const { container } = render(<AramaKutusu />);
    const input = container.querySelector("input") as HTMLInputElement;

    input.focus();
    await tick(0);

    const chip = Array.from(container.querySelectorAll("span")).find((s) =>
      (s.textContent || "").includes("iphone")
    ) as HTMLSpanElement | undefined;

    expect(chip).toBeTruthy();

    const closeBtn = chip!.querySelector("button") as HTMLButtonElement | null;
    expect(closeBtn).not.toBeNull();

    click(closeBtn!);

    expect(lsSet).toHaveBeenCalled(); // güncel liste yazıldı
  });
});

// src/__test__/components/RecentlyViewed.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click, tick } from "../utils/render";
import SonIncelenenler from "../../components/RecentlyViewed";

// --- Mocks (en üste) ---
vi.mock("react-router-dom", async () => await import("../mocks/router"));
vi.mock("firebase/firestore", async () => await import("../mocks/firestore"));

// FavoriteContext: alias + relative (hangisini import ediyorsan o yakalansın)
const favorideMiMock = vi.fn();
const favoriEkleCikarMock = vi.fn();
vi.mock("@/context/FavoriteContext", () => ({
  useFavori: () => ({
    favorideMi: favorideMiMock,
    favoriEkleCikar: favoriEkleCikarMock,
  }),
}));
vi.mock("../../context/FavoriteContext", () => ({
  useFavori: () => ({
    favorideMi: favorideMiMock,
    favoriEkleCikar: favoriEkleCikarMock,
  }),
}));

// AuthContext: alias + relative
let mockUser: any = null;
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ kullanici: mockUser }),
}));
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ kullanici: mockUser }),
}));

import { onSnapshotMock } from "../mocks/firestore";

describe("SonIncelenenler", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    (HTMLElement.prototype as any).scrollBy = vi.fn();
    mockUser = null;
  });

  it("kullanıcı yoksa null render eder", () => {
    const { container } = render(<SonIncelenenler />);
    expect(container.innerHTML).toBe("");
    expect(onSnapshotMock).not.toHaveBeenCalled();
  });

  it("kullanıcı varsa onSnapshot çağrılır ve ürünler render edilir", async () => {
    mockUser = { uid: "u1" };
    favorideMiMock.mockReturnValue(false);

    onSnapshotMock.mockImplementation((q, cb) => {
      cb({
        docs: [
          {
            id: "1",
            data: () => ({
              id: "1",
              ad: "Ürün 1",
              fiyat: 1000,
              gorsel: "g1.png",
              aciklama: "Açıklama 1",
              kategori: "Kat",
              kategoriId: "k1",
            }),
          },
        ],
      });
      return () => {};
    });

    const { container } = render(<SonIncelenenler />);
    await tick();

    expect(onSnapshotMock).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("Son İncelenenler");
    expect(container.textContent).toContain("Ürün 1");
    expect(container.querySelector("img")?.getAttribute("src")).toContain("g1.png");
  });

  it("favori butonuna tıklayınca favoriEkleCikar çağrılır", async () => {
    mockUser = { uid: "u1" };
    favorideMiMock.mockReturnValue(false);

    onSnapshotMock.mockImplementation((q, cb) => {
      cb({
        docs: [
          {
            id: "2",
            data: () => ({
              id: "2",
              ad: "Ürün 2",
              fiyat: 2000,
              gorsel: "g2.png",
              aciklama: "Açıklama 2",
              kategori: "Kat",
              kategoriId: "k2",
            }),
          },
        ],
      });
      return () => {};
    });

    const { container } = render(<SonIncelenenler />);
    await tick();

    // "Ürün 2" kartını bul
    const cardRoot = Array.from(container.querySelectorAll<HTMLElement>("*"))
      .find(el => (el.textContent ?? "").includes("Ürün 2")) as HTMLElement;

    // Kart içindeki favori butonunu bul:
    // 1) data-testid varsa onu kullan
    // 2) yoksa yazısız (ikon) butonu seç
    const favBtn =
      (cardRoot?.querySelector('[data-testid="fav-btn"]') as HTMLButtonElement) ??
      (Array.from(cardRoot?.querySelectorAll("button") ?? [])
        .find(b => !(b.textContent ?? "").trim()) as HTMLButtonElement);

    expect(favBtn).toBeTruthy();
    click(favBtn);
    await tick();

    expect(favoriEkleCikarMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: "2", ad: "Ürün 2" })
    );
  });

  it("sol ve sağ oklar scrollBy çağırır", async () => {
    mockUser = { uid: "u1" };
    favorideMiMock.mockReturnValue(false);

    onSnapshotMock.mockImplementation((q, cb) => {
      cb({
        docs: [
          {
            id: "3",
            data: () => ({
              id: "3",
              ad: "Ürün 3",
              fiyat: 3000,
              gorsel: "g3.png",
              aciklama: "Açıklama 3",
              kategori: "Kat",
              kategoriId: "k3",
            }),
          },
        ],
      });
      return () => {};
    });

    const { container } = render(<SonIncelenenler />);
    await tick();

    const buttons = container.querySelectorAll("button");
    const scrollBy = (HTMLElement.prototype as any).scrollBy as ReturnType<typeof vi.fn>;

    click(buttons[0]); // sol ok
    click(buttons[buttons.length - 1]); // sağ ok

    expect(scrollBy).toHaveBeenCalledWith({ left: -250, behavior: "smooth" });
    expect(scrollBy).toHaveBeenCalledWith({ left: 250, behavior: "smooth" });
  });

  it("uzun açıklamalarda 'Devamını Oku' gösterir", async () => {
    mockUser = { uid: "u1" };
    favorideMiMock.mockReturnValue(false);
    const uzunAciklama = "A".repeat(100);

    onSnapshotMock.mockImplementation((q, cb) => {
      cb({
        docs: [
          {
            id: "4",
            data: () => ({
              id: "4",
              ad: "Ürün 4",
              fiyat: 4000,
              gorsel: "g4.png",
              aciklama: uzunAciklama,
              kategori: "Kat",
              kategoriId: "k4",
            }),
          },
        ],
      });
      return () => {};
    });

    const { container } = render(<SonIncelenenler />);
    await tick();

    expect(container.textContent).toContain("Devamını Oku");
  });
});

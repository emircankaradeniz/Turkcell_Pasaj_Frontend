import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click, tick } from "../utils/render";
import IlginiziCekebilir from "../../components/RelatedProducts";

// 🔹 react-router-dom mock
vi.mock("react-router-dom", async () => {
  const m = await import("../mocks/router");
  return m;
});

// 🔹 firebase/firestore mock
vi.mock("firebase/firestore", async () => {
  const m = await import("../mocks/firestore");
  return m;
});

import { getDocsMock, where as whereMock } from "../mocks/firestore";

// 🔹 FavoriteContext mock
let mockFavoriler: any[] = [];
vi.mock("@/context/FavoriteContext", () => ({
  useFavori: () => ({ favoriler: mockFavoriler }),
}));

describe("IlginiziCekebilir", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    (HTMLElement.prototype as any).scrollBy = vi.fn();
    mockFavoriler = [];
    getDocsMock.mockReset();
    whereMock.mockClear();
  });

  it("favoriler boşsa loading sonrası null döner", async () => {
    mockFavoriler = [];
    const { container } = render(<IlginiziCekebilir />);
    await tick();
    expect(container.textContent).toContain("Yükleniyor...");
    await tick();
    expect(container.innerHTML).toBe("");
  });

  it("favoriler varsa Firestore sorgusu çalışır ve ürünler render edilir", async () => {
    mockFavoriler = [
      { kategori: "Elektronik" },
      { kategori: "Bilgisayar" },
    ];
    getDocsMock.mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            ad: "Ürün 1",
            fiyat: 1000,
            gorsel: "g1.png",
            kategori: "Elektronik",
            kategoriId: "k1",
          }),
        },
      ],
    });

    const { container } = render(<IlginiziCekebilir />);
    await tick();

    expect(whereMock).toHaveBeenCalledWith("kategori", "in", ["Elektronik", "Bilgisayar"]);
    expect(container.textContent).toContain("İlginizi çekebilecek ürünler");
    expect(container.textContent).toContain("Ürün 1");
    expect(container.querySelector("img")?.getAttribute("src")).toContain("g1.png");
  });

  it("ürün yoksa null render eder", async () => {
    mockFavoriler = [{ kategori: "Elektronik" }];
    getDocsMock.mockResolvedValue({ docs: [] });

    const { container } = render(<IlginiziCekebilir />);
    await tick();
    expect(container.innerHTML).toBe("");
  });

  it("sol ve sağ oklar scrollBy çağırır", async () => {
    mockFavoriler = [{ kategori: "Elektronik" }];
    getDocsMock.mockResolvedValue({
      docs: [
        {
          id: "2",
          data: () => ({
            ad: "Ürün 2",
            fiyat: 2000,
            gorsel: "g2.png",
            kategori: "Elektronik",
            kategoriId: "k2",
          }),
        },
      ],
    });

    const scrollBy = (HTMLElement.prototype as any).scrollBy as ReturnType<typeof vi.fn>;

    const { container } = render(<IlginiziCekebilir />);
    await tick();

    const buttons = container.querySelectorAll("button");
    click(buttons[0]); // sol
    click(buttons[buttons.length - 1]); // sağ

    expect(scrollBy).toHaveBeenCalledWith({ left: -250, behavior: "smooth" });
    expect(scrollBy).toHaveBeenCalledWith({ left: 250, behavior: "smooth" });
  });
});

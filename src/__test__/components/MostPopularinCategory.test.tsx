import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click, tick } from "../utils/render";
import MostPopulerCategory from "../../components/MostPopularinCategory";

// 🔹 Mock: react-router-dom Link (senin basit <a> mock’un)
vi.mock("react-router-dom", async () => {
  const m = await import("../mocks/router");
  return m;
});

// 🔹 Mock: firebase/firestore (senin mocks/firestore dosyana yönlendir)
vi.mock("firebase/firestore", async () => {
  const m = await import("../mocks/firestore");
  return m;
});

import {
  getDocsMock,
  collection,
  query as queryMock,
  where as whereMock,
} from "../mocks/firestore";

// JSDOM'da scrollBy yok -> polyfill
beforeEach(() => {
  (HTMLElement.prototype as any).scrollBy = vi.fn();
  getDocsMock.mockReset();
  (queryMock as any).mockClear?.();
  (whereMock as any).mockClear?.();
});

const ürünler = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  kategori: i % 2 === 0 ? "Bilgisayar-Tablet" : "Cep Telefonu-Aksesuar",
  altKategori: i % 3 === 0 ? "Dizüstü Bilgisayarlar" : "Apple Telefonlar",
  ad: `Ürün ${i + 1}`,
  aciklama: `Açıklama ${i + 1}`,
  fiyat: 1000 * (i + 1),
  gorsel: `gorsel-${i + 1}.png`,
}));

function mockGetDocsReturn(data = ürünler) {
  getDocsMock.mockResolvedValue({
    docs: data.map((u) => ({
      id: u.id,
      data: () => {
        const { id, ...rest } = u;
        return rest;
      },
    })),
  });
}

describe("MostPopulerCategory", () => {
  it("yüklenirken 'Yükleniyor...' gösterir ve sonra 10 ürüne sınırlar", async () => {
    mockGetDocsReturn();
    const { container } = render(<MostPopulerCategory />);
    // İlk render: loading
    expect(container.textContent).toContain("Yükleniyor...");
    await tick();

    // 12 ürün gelse de 10’a düşürülmeli
    const kartlar = container.querySelectorAll("[class*='min-w-'][class*='border']");
    expect(kartlar.length).toBe(10);

    // Bazı ürün adları görünmeli
    expect(container.textContent).toContain("Ürün 1");
    expect(container.textContent).toContain("Ürün 10");

    // Link href kontrolü
    const ilkLink = container.querySelector('a[href="/urun/1"]');
    expect(ilkLink).toBeTruthy();
  });

  it("kategori prop’u varken kategori filtresi ile getDocs çağrılır", async () => {
    mockGetDocsReturn();
    const kategori = "Bilgisayar-Tablet";
    const { container } = render(<MostPopulerCategory kategori={kategori} />);
    await tick();

    // where('kategori', '==', kategori) kullanılmış olmalı
    expect(whereMock).toHaveBeenCalledWith("kategori", "==", kategori);
    expect(getDocsMock).toHaveBeenCalledTimes(1);

    // Render edilmiş ürünlerden en az birinin kategori eşleşmesi olmalı
    expect(container.textContent).toContain("Ürün 1"); // test verisinde var
  });

  it("altKategori prop’u varken altKategori filtresi ile getDocs çağrılır", async () => {
    mockGetDocsReturn();
    const altKategori = "Apple Telefonlar";
    const { container } = render(<MostPopulerCategory altKategori={altKategori} />);
    await tick();

    expect(whereMock).toHaveBeenCalledWith("altKategori", "==", altKategori);
    expect(getDocsMock).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("Ürün 2"); // test verisinde Apple Telefonlar çıkıyor
  });

  it("ürün yoksa boş durum mesajını gösterir", async () => {
    mockGetDocsReturn([]); // boş
    const { container } = render(<MostPopulerCategory kategori="YokKategori" />);
    await tick();

    expect(container.textContent).toContain("Bu kategoride ürün bulunamadı.");
  });

  it("sol/sağ oklar scrollBy çağırır", async () => {
    mockGetDocsReturn();
    const { container } = render(<MostPopulerCategory />);
    await tick();

    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    const solOk = buttons[0] as HTMLButtonElement;
    const sagOk = buttons[buttons.length - 1] as HTMLButtonElement;

    click(solOk);
    click(sagOk);

    const scrollBy = (HTMLElement.prototype as any).scrollBy as ReturnType<typeof vi.fn>;
    expect(scrollBy).toHaveBeenCalledWith({ left: -250, behavior: "smooth" });
    expect(scrollBy).toHaveBeenCalledWith({ left: 250, behavior: "smooth" });
  });

  it("fiyatlar 'TL' ile birlikte ve tr-TR formatında gösterilir", async () => {
    mockGetDocsReturn([
      {
        id: "x1",
        kategori: "Test",
        altKategori: "Alt",
        ad: "Format Test",
        aciklama: "Açıklama",
        fiyat: 1234567.89,
        gorsel: "g.png",
      },
    ] as any);

    const { container } = render(<MostPopulerCategory kategori="Test" />);
    await tick();

    // 1.234.567,89 TL gibi bir ifade beklenir
    expect(container.textContent).toMatch(/1\.234\.567,89\s*TL/);
  });
});

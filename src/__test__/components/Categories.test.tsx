// src/__test__/components/Categories.test.tsx
import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { act } from "react"; // ÖNEMLİ: react-dom/test-utils değil
import { renderWithRouter, tick } from "../utils/render";
import Kategoriler from "../../components/Categories";
import { getDocsMock } from "../mocks/firestore";

const mockUrunler = [
  {
    id: "1",
    kategori: "Cep Telefonu-Aksesuar",
    altKategori: "Apple Telefonlar",
    kategoriId: "kat-cep-aksesuar",
    ad: "iPhone 15",
    aciklama: "Son model iPhone",
    fiyat: 50000,
    gorsel: "iphone.jpg",
  },
  {
    id: "2",
    kategori: "Bilgisayar-Tablet",
    altKategori: "Dizüstü Bilgisayarlar",
    kategoriId: "kat-bilgisayar-tablet",
    ad: "MacBook Pro",
    aciklama: "M2 işlemcili",
    fiyat: 80000,
    gorsel: "macbook.jpg",
  },
];

async function waitForText(container: HTMLElement, text: string, timeout = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const content = (container.textContent ?? "").replace(/\s+/g, " ");
    if (content.includes(text)) return;
    await act(async () => { await new Promise(r => setTimeout(r, 25)); });
  }
  throw new Error(`waitForText timeout: "${text}" DOM'da bulunamadı`);
}

function mockMatchMedia() {
  (window as any).matchMedia = (query: string) => ({
    matches:
      /\(min-width:\s*1024px\)/.test(query) ||
      /\(hover:\s*(fine|hover)\)/.test(query) ||
      /\(any-hover:\s*hover\)/.test(query) ||
      /\(pointer:\s*fine\)/.test(query),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  });
}

describe("Kategoriler Component", () => {
  beforeEach(() => {
    mockMatchMedia();
    (window as any).innerWidth = 1920;

    getDocsMock.mockReset();
    getDocsMock.mockResolvedValue({
      docs: mockUrunler.map((u) => ({
        id: u.id,
        data: () => {
          const { id, ...rest } = u;
          return rest;
        },
      })),
    });
  });

  it("üst kategori linklerini render eder", async () => {
    const { container } = renderWithRouter(<Kategoriler initialUrunler={mockUrunler} />);;
    await act(async () => {
      await tick();
      await tick();
    });

    expect(container.textContent).toContain("Cep Telefonu-Aksesuar");
    expect(container.textContent).toContain("Bilgisayar-Tablet");
  });

  it("hover ile panel açar ve alt kategoriye gelince ilgili ürünleri gösterir", async () => {
    const { container } = renderWithRouter(<Kategoriler initialUrunler={mockUrunler} />);

    await act(async () => {
      await tick(); // render
      await tick(); // ürün verisi state'e aktı
    });

    // 1) Ana nav ve paneli barındıran <li> tarafını bul
    const nav = container.querySelector('[data-testid="kategori-nav"]') as HTMLElement | null;
    expect(nav).toBeTruthy();

    // 2) Ana kategori linkini bul
    const anaKategori = "Cep Telefonu-Aksesuar";
    const anaKategoriHrefParca = encodeURIComponent(anaKategori);
    const link = container.querySelector(
      `a[href*='${anaKategoriHrefParca}']`
    ) as HTMLElement | null;
    expect(link).toBeTruthy();

    // 3) Hover tetikle (li ve link üzerinde)
    const li = link?.closest("li") as HTMLElement | null;
    const hoverTargets: HTMLElement[] = [];
    if (link) hoverTargets.push(link);
    if (li) hoverTargets.push(li);

    for (const t of hoverTargets) {
      t.dispatchEvent(new MouseEvent("pointerenter", { bubbles: true }));
      t.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      t.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    }
    await act(async () => { await tick(80); });

    // 4) Panelin açıldığını doğrula
    const panel = container.querySelector('[data-testid="kategori-panel"]') as HTMLElement | null;
    expect(panel).toBeTruthy();

    // 5) Alt kategori düğümünü bul ve hover et
    //  - data-testid: alt-apple-telefonlar (küçük harf + tire)
    const altTestId = "alt-apple-telefonlar";
    const altNode = container.querySelector(`[data-testid="${altTestId}"]`) as HTMLElement | null
      ?? Array.from(container.querySelectorAll<HTMLElement>("*")).find(el =>
          (el.textContent ?? "").replace(/\s+/g, " ").includes("Apple Telefonlar")
        ) ?? null;

    expect(altNode).toBeTruthy();

    const altLi = altNode?.closest("li") as HTMLElement | null;
    const altTargets: HTMLElement[] = [];
    if (altNode) altTargets.push(altNode);
    if (altLi) altTargets.push(altLi);

    for (const t of altTargets) {
      t.dispatchEvent(new MouseEvent("pointerenter", { bubbles: true }));
      t.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      t.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    }
    await act(async () => { await tick(120); });

    // 6) Ürün gerçekten DOM'da var mı?
    await waitForText(container, "iPhone 15");
    expect(container.textContent).not.toContain("MacBook Pro");
  });
});

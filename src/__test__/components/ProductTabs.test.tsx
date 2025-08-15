// src/__test__/components/ProductTabs.test.tsx

// 1) MOCKLAR (EN ÜSTE!)
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("react-router-dom", async () => await import("../../__test__/mocks/router"));
vi.mock("firebase/firestore", async () => await import("../../__test__/mocks/firestore"));
vi.mock("../../context/AuthContext", async () => await import("../mocks/auth"));

// 2) SONRA importlar
import React from "react";
import { render, tick } from "../utils/render";
import ProductTabs from "../../components/ProductTabs";
import { getDocsMock, serverTimestamp } from "../../__test__/mocks/firestore";
import { __setMockUser as setAuthUser } from "../../__test__/mocks/auth";

// ---- Yardımcı veri ----
const fakeSaticilar = [
  { id: "s1", ad: "Satıcı A" },
  { id: "s2", ad: "Satıcı B" },
];

const fakeYorumlar = [
  { urunId: "U1", kullanici: "ali", yorum: "Güzel", puan: 5, tarih: 1 },
  { urunId: "U1", kullanici: "veli", yorum: "İdare eder", puan: 4, tarih: 2 },
];

const fakeSorular = [
  { urunId: "U1", saticiAd: "Satıcı A", kullaniciAd: "ayse", soru: "Kargosu hızlı mı?", cevap: null, tarih: 3 },
];

// getDocs'u koleksiyona göre yönlendir
function mockGetDocsByCollection() {
  getDocsMock.mockImplementation((arg: any) => {
    const colName =
      arg?.__type === "collection"
        ? arg.name
        : arg?.__type === "query"
        ? arg.args?.[0]?.name
        : undefined;

    if (colName === "saticilar") {
      return Promise.resolve({
        docs: fakeSaticilar.map((s) => ({
          id: s.id,
          data: () => ({ ad: s.ad }),
        })),
      });
    }

    if (colName === "yorumlar") {
      return Promise.resolve({
        docs: fakeYorumlar.map((y, i) => ({
          id: String(i + 1),
          data: () => y,
        })),
      });
    }

    if (colName === "sorular") {
      return Promise.resolve({
        docs: fakeSorular.map((s, i) => ({
          id: String(i + 1),
          data: () => s,
        })),
      });
    }

    return Promise.resolve({ docs: [] });
  });
}

describe("ProductTabs", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
    (serverTimestamp as any).mockClear?.();
    setAuthUser(null);
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("ilk açılışta açıklama sekmesi aktif ve metni gösterir; sayımlar sekme etiketinde görünür", async () => {
    mockGetDocsByCollection();

    const { container } = render(
      <ProductTabs
        urunId="U1"
        aciklama="Bu ürün harikadır."
        ozellikler={{ Renk: "Siyah", Ağırlık: "1kg" }}
      />
    );
    await tick();

    expect(container.textContent).toContain("Ürün Açıklaması");
    expect(container.textContent).toContain("Bu ürün harikadır.");
    expect(container.textContent).toContain(`Değerlendirmeler (${fakeYorumlar.length})`);
    expect(container.textContent).toContain(`Ürün Soru&Cevapları (${fakeSorular.length})`);
  });

  it("Özellikler sekmesine tıklayınca tablo satırları render olur", async () => {
    mockGetDocsByCollection();

    const ozellikler = { Renk: "Siyah", Ağırlık: "1kg", Güç: "65W" };

    const { container } = render(
      <ProductTabs urunId="U1" aciklama="Açıklama" ozellikler={ozellikler} />
    );
    await tick();

    const ozBtn = Array.from(container.querySelectorAll("button"))
      .find(b => b.textContent?.includes("Ürün Özellikleri")) as HTMLButtonElement;
    ozBtn.click();
    await tick();

    const rows = container.querySelectorAll("table tbody tr");
    expect(rows.length).toBe(Object.keys(ozellikler).length);
    expect(container.textContent).toContain("Renk");
    expect(container.textContent).toContain("Siyah");
  });

  it("Yorumlar sekmesinde mevcut yorumlar listelenir", async () => {
    mockGetDocsByCollection();

    const { container } = render(
      <ProductTabs urunId="U1" aciklama="Açıklama" ozellikler={{}} />
    );
    await tick();

    const yorumBtn = Array.from(container.querySelectorAll("button"))
      .find(b => b.textContent?.includes("Değerlendirmeler")) as HTMLButtonElement;
    yorumBtn.click();
    await tick();

    expect(container.textContent).toContain("ali");
    expect(container.textContent).toContain("Güzel");
  });
});

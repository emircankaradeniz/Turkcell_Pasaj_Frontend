import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../utils/render";
import SanaOzelUrunler from "../../components/SpecialProductsForYou";

// 🔹 react-router-dom Link mock
vi.mock("react-router-dom", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a data-testid="mock-link" href={to}>
      {children}
    </a>
  ),
}));

// 🔹 firestore mock
const mockDocs = Array.from({ length: 10 }, (_, i) => ({
  id: `id-${i}`,
  data: () => ({
    ad: `Ürün ${i}`,
    aciklama: `Açıklama ${i}`,
    fiyat: 100 + i,
    gorsel: `/img${i}.png`,
  }),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: mockDocs })),
}));

vi.mock("@/firebase", () => ({
  db: {},
}));

describe("SanaOzelUrunler", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("10 ürün render eder", async () => {
    const { getAllByTestId } = render(<SanaOzelUrunler />);
    // async render olduğu için biraz bekle
    await new Promise((r) => setTimeout(r, 0));

    const links = getAllByTestId("mock-link");
    expect(links.length).toBe(10);
    expect(links[0].getAttribute("href")).toBe("/urun/id-0");
  });
});

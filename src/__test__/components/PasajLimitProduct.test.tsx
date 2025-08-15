import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "../utils/render";
import PasajLimitProduct from "../../components/PasajLimitProduct";

describe("PasajLimitProduct", () => {
  it("resmi ve linki doğru render eder", () => {
    const { container } = render(<PasajLimitProduct />);

    const link = container.querySelector("a") as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.href).toContain(
      "https://www.turkcell.com.tr/pasaj/hesabim/bana-ozel-teklifler"
    );
    expect(link.target).toBe("_blank");
    expect(link.rel).toBe("noopener noreferrer");

    const img = container.querySelector("img") as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain("/images/PasajLimitUrUnleri.png");
    expect(img.alt).toBe("Pasaj Limit Ürünleri");
  });

  it("container sınıflarını uygular", () => {
    const { container } = render(<PasajLimitProduct />);
    const div = container.querySelector("div");
    expect(div?.className).toContain("max-w-screen-xl");
    expect(div?.className).toContain("mx-auto");
  });
});

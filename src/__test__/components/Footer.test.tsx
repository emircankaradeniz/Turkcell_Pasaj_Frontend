import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../utils/render";
import Footer from "../../components/Footer";

// 🔹 react-router-dom'daki Link'i basit <a> ile mockla (senin mocks/router.tsx dosyana yönlendiriyoruz)
vi.mock("react-router-dom", async () => {
  const mod = await import("../mocks/router");
  return mod;
});

// 🔹 react-social-icons paketini testte basit bir span ile stub'layalım
vi.mock("react-social-icons", () => {
  return {
    SocialIcon: (props: { url: string }) =>
      React.createElement("span", { "data-testid": "social-icon", "data-url": props.url }),
  };
});

describe("Footer", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("render olur ve temel bölümleri gösterir", () => {
    const { container } = render(<Footer />);

    // footer kök elemanı
    const footer = container.querySelector("footer");
    expect(footer).toBeTruthy();

    // Üst logo
    const logo = container.querySelector('img[alt="logo"]') as HTMLImageElement;
    expect(logo).toBeTruthy();
    expect(logo.src).toContain("/images/PasajLogoWhite.png");

    // QR alanı ve görseli
    const qrImg = container.querySelector('img[alt="QR Kod"]') as HTMLImageElement;
    expect(qrImg).toBeTruthy();
    expect(qrImg.className).toContain("w-24");

    // Alt kısım telif yazısı
    expect(container.textContent).toContain("© 2025 Pasaj");
  });

  it("sosyal medya ikonlarını gösterir (5 adet)", () => {
    const { container } = render(<Footer />);
    const icons = container.querySelectorAll('[data-testid="social-icon"]');
    expect(icons.length).toBe(5);

    // URL'ler doğru mu? (stub'ta data-url attribute'u var)
    const urls = Array.from(icons).map((el) => (el as HTMLElement).getAttribute("data-url"));
    expect(urls).toEqual([
      "https://x.com",
      "https://facebook.com",
      "https://instagram.com",
      "https://youtube.com",
      "https://linkedin.com",
    ]);
  });

  it("link grupları başlıklarını ve bazı öğeleri gösterir", () => {
    const { container } = render(<Footer />);

    // 6 grup başlığı var
    const groupTitles = Array.from(container.querySelectorAll("h3")).map((h) => h.textContent?.trim());
    expect(groupTitles).toEqual([
      "Hakkımızda",
      "Popüler Kategoriler",
      "Yardım",
      "Markalar",
      "Kampanyalar",
      "Popüler Ürünler",
    ]);

    // Bazı örnek link metinlerini kontrol et
    expect(container.textContent).toContain("Pasaj Genel Bakış");
    expect(container.textContent).toContain("Cep Telefonu");
    expect(container.textContent).toContain("Yardım Merkezi");
    expect(container.textContent).toContain("Apple");
    expect(container.textContent).toContain("Fırsatlar");
    expect(container.textContent).toContain("iPhone 15 Pro");
  });

  it("logo tıklanabilir link içinde yer alır ve /'a gider", () => {
    const { container } = render(<Footer />);
    const logoLink = container.querySelector('a[href="/"]');
    expect(logoLink).toBeTruthy();
    const logoImg = logoLink?.querySelector('img[alt="logo"]');
    expect(logoImg).toBeTruthy();
  });

  it("alt kısımda gizlilik linki ve iş ortakları logoları görünür", () => {
    const { container } = render(<Footer />);

    const privacy = Array.from(container.querySelectorAll("a")).find(
      (a) => a.textContent?.trim() === "Gizlilik ve Güvenlik"
    ) as HTMLAnchorElement | undefined;
    expect(privacy).toBeTruthy();
    expect(privacy?.getAttribute("href")).toBe("#");

    const fizyLogo = container.querySelector('img[alt="Fizy"]') as HTMLImageElement;
    const tvLogo = container.querySelector('img[alt="TV"]') as HTMLImageElement;
    expect(fizyLogo).toBeTruthy();
    expect(tvLogo).toBeTruthy();
    expect(fizyLogo.src).toContain("Fizy_logo.svg");
    expect(tvLogo.src).toContain("TV_logo.png");
  });
});

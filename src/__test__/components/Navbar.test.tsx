import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click } from "../utils/render";
import Navbar from "../../components/Navbar";

/* -----------------------------
   HOISTED navigate spy
   (vi.mock hoisted olduğundan aynı mock'u içeride kullanacağız)
-------------------------------- */
const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

/* -----------------------------
   react-router-dom mock
   - Test router yardımcılarını (Link vs) kendi mock dosyandan al
   - useNavigate: hoisted navigateMock
-------------------------------- */
vi.mock("react-router-dom", async () => {
  const mod = await import("../mocks/router");
  return {
    ...mod,
    useNavigate: () => navigateMock,
  };
});

/* -----------------------------
   Context mock'ları (Vitest ile)
-------------------------------- */
const mockUseSepet = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("@/context/BasketContext", () => ({
  useSepet: () => mockUseSepet(),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

/* -----------------------------
   Alt bileşen stub'ları
-------------------------------- */
vi.mock("@/components/SearchBox", () => ({
  default: () => <div data-testid="search-box">SearchBox</div>,
}));
vi.mock("@/components/Categories", () => ({
  default: () => <div data-testid="categories">Categories</div>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    navigateMock.mockReset();
    mockUseSepet.mockReset();
    mockUseAuth.mockReset();
  });

  it("kullanıcı yoksa 'Giriş Yap' linki gösterir", () => {
    mockUseSepet.mockReturnValue({ sepet: [] });
    mockUseAuth.mockReturnValue({ kullanici: null });

    const { container } = render(<Navbar />);
    const loginLink = container.querySelector('a[href="/giris"]');
    expect(loginLink).toBeTruthy();
    expect(loginLink?.textContent).toContain("Giriş Yap");
  });

  it("kullanıcı varsa 'Hesabım' linki gösterir", () => {
    mockUseSepet.mockReturnValue({ sepet: [] });
    mockUseAuth.mockReturnValue({ kullanici: { ad: "Ahmet" } });

    const { container } = render(<Navbar />);
    const accountLink = container.querySelector('a[href="/hesap"]');
    expect(accountLink).toBeTruthy();
    expect(accountLink?.textContent).toContain("Hesabım");
  });

  it("sepet adedi > 0 ise sayacı gösterir", () => {
    mockUseSepet.mockReturnValue({
      sepet: [
        { id: 1, adet: 2 },
        { id: 2, adet: 3 },
      ],
    });
    mockUseAuth.mockReturnValue({ kullanici: { ad: "Ali" } });

    const { container } = render(<Navbar />);
    const badge = container.querySelector("span.absolute");
    expect(badge).toBeTruthy();
    expect(badge?.textContent).toBe("5");
  });

  it("sepet butonu tıklanınca kullanıcı yoksa /giris'e yönlendirir", () => {
    mockUseSepet.mockReturnValue({ sepet: [] });
    mockUseAuth.mockReturnValue({ kullanici: null });

    const { container } = render(<Navbar />);
    const button = container.querySelector("button");
    click(button as HTMLButtonElement);

    expect(navigateMock).toHaveBeenCalledWith("/giris");
  });

  it("sepet butonu tıklanınca kullanıcı varsa /sepet'e yönlendirir", () => {
    mockUseSepet.mockReturnValue({ sepet: [] });
    mockUseAuth.mockReturnValue({ kullanici: { ad: "Ayşe" } });

    const { container } = render(<Navbar />);
    const button = container.querySelector("button");
    click(button as HTMLButtonElement);

    expect(navigateMock).toHaveBeenCalledWith("/sepet");
  });

  it("logo tıklanabilir ve /'a yönlendirir", () => {
    mockUseSepet.mockReturnValue({ sepet: [] });
    mockUseAuth.mockReturnValue({ kullanici: null });

    const { container } = render(<Navbar />);
    const logoLink = container.querySelector('a[href="/"]');
    expect(logoLink).toBeTruthy();
    expect(logoLink?.querySelector('img[alt="logo"]')).toBeTruthy();
  });

  it("arama kutusu ve kategoriler alt bileşenleri render edilir", () => {
    mockUseSepet.mockReturnValue({ sepet: [] });
    mockUseAuth.mockReturnValue({ kullanici: null });

    const { container } = render(<Navbar />);
    expect(container.querySelector('[data-testid="search-box"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="categories"]')).toBeTruthy();
  });
});

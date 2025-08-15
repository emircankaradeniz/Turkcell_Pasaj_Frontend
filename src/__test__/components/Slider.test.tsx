import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../utils/render";
import Slider from "../../components/Slider";

// Swiper ve SwiperSlide'ı basit mock ile sahte element yapıyoruz
vi.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-swiper-slide">{children}</div>
  ),
}));

vi.mock("swiper/modules", () => ({
  Autoplay: {},
  Pagination: {},
}));

describe("Slider", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("tüm slider resimlerini doğru şekilde render eder", () => {
    const { container, getAllByTestId } = render(<Slider />);

    // Swiper mock'unun çalıştığını kontrol edelim
    expect(container.querySelector("[data-testid='mock-swiper']")).toBeTruthy();

    // Kaç slide var?
    const slides = getAllByTestId("mock-swiper-slide");
    expect(slides.length).toBe(15);

    // İlk resmin src ve alt değerlerini kontrol edelim
    const firstImg = slides[0].querySelector("img")!;
    expect(firstImg.getAttribute("src")).toBe("/images/slider1.png");
    expect(firstImg.getAttribute("alt")).toBe("slide-0");

    // Son resmin de kontrolünü yapalım
    const lastImg = slides[14].querySelector("img")!;
    expect(lastImg.getAttribute("src")).toBe("/images/slider15.png");
    expect(lastImg.getAttribute("alt")).toBe("slide-14");
  });
});

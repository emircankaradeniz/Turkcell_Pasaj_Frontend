import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "../utils/render";
import KacirilmayacakFirsatlar from "../../components/UnmissableOpportunities";

// react-slick'i mockla: props'ları data-* ile dışarı ver, okları ve çocukları render et
vi.mock("react-slick", () => {
  const Slider = ({ children, ...props }: any) => (
    <div
      data-testid="mock-slick"
      data-dots={String(!!props.dots)}
      data-infinite={String(!!props.infinite)}
      data-speed={String(props.speed)}
      data-slides-to-show={String(props.slidesToShow)}
      data-slides-to-scroll={String(props.slidesToScroll)}
      data-responsive={JSON.stringify(props.responsive ?? [])}
    >
      {/* oklar da görünür olsun */}
      <div data-testid="mock-prev">{props.prevArrow}</div>
      <div data-testid="mock-next">{props.nextArrow}</div>
      <div data-testid="mock-track">{children}</div>
    </div>
  );
  return { default: Slider };
});

describe("KacirilmayacakFirsatlar", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("başlığı ve slick container'ı render eder", () => {
    const { container, getByTestId } = render(<KacirilmayacakFirsatlar />);
    expect(container.textContent).toContain("Kaçırılmayacak Fırsatlar");
    expect(getByTestId("mock-slick")).toBeTruthy();
  });

  it("tüm kampanya görsellerini ve linklerini doğru render eder (8 adet)", () => {
    const { getByTestId } = render(<KacirilmayacakFirsatlar />);
    const track = getByTestId("mock-track")!;
    const imgs = track.querySelectorAll("img");
    const anchors = track.querySelectorAll("a");

    expect(imgs.length).toBe(8);
    expect(anchors.length).toBe(8);

    // İlk ve son görsel alt/src kontrolü
    expect(imgs[0].getAttribute("src")).toBe("/images/firsat1.png");
    expect(imgs[0].getAttribute("alt")).toBe("Fırsat 1");
    expect(imgs[7].getAttribute("src")).toBe("/images/firsat8.png");
    expect(imgs[7].getAttribute("alt")).toBe("Fırsat 8");

    // Link target ve rel
    anchors.forEach((a) => {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });

  it("react-slick ayarlarını mock üzerinden doğrular (slidesToShow, infinite, dots, responsive)", () => {
    const { getByTestId } = render(<KacirilmayacakFirsatlar />);
    const slick = getByTestId("mock-slick") as HTMLElement;

    expect(slick.getAttribute("data-slides-to-show")).toBe("4");
    expect(slick.getAttribute("data-slides-to-scroll")).toBe("1");
    expect(slick.getAttribute("data-infinite")).toBe("true");
    expect(slick.getAttribute("data-dots")).toBe("false");

    const responsive = JSON.parse(slick.getAttribute("data-responsive") || "[]");
    // 1024 -> 2, 640 -> 1
    const bp1024 = responsive.find((r: any) => r.breakpoint === 1024);
    const bp640 = responsive.find((r: any) => r.breakpoint === 640);
    expect(bp1024?.settings?.slidesToShow).toBe(2);
    expect(bp640?.settings?.slidesToShow).toBe(1);
  });

  it("özel ok bileşenleri render olur", () => {
    const { getByTestId } = render(<KacirilmayacakFirsatlar />);
    const prevWrap = getByTestId("mock-prev")!;
    const nextWrap = getByTestId("mock-next")!;

    // İçlerinde buton olmalı
    expect(prevWrap.querySelector("button")).toBeTruthy();
    expect(nextWrap.querySelector("button")).toBeTruthy();
    // Icon svg'leri de render olur (react-icons)
    expect(prevWrap.querySelector("svg")).toBeTruthy();
    expect(nextWrap.querySelector("svg")).toBeTruthy();
  });
});

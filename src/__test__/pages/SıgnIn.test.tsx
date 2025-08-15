// src/__test__/pages/SıgnIn.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, tick } from "../utils/render";
import { fireEvent, cleanup } from "@testing-library/react";
import Giris from "../../pages/SıgnIn";

/* ---------------- hoisted mocks ---------------- */
const { navigateMock, girisYapMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  girisYapMock: vi.fn(),
}));

/* ---------------- context & router mocks ---------------- */
let mockKullanici: any = null;

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    girisYap: girisYapMock,
    kullanici: mockKullanici,
  }),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  };
});

/* ---------------- helpers ---------------- */
function setInputValue(input: HTMLInputElement, value: string) {
  input.focus();
  (input as any).value = value;
  fireEvent.input(input, { target: { value } });
  fireEvent.change(input, { target: { value } });
  input.blur();
}

function setup() {
  const r = render(<Giris />);

  const emailInput =
    (r.container.querySelector('input[type="email"]') as HTMLInputElement) ||
    (r.container.querySelector('input[placeholder="Email"]') as HTMLInputElement);

  const passInput =
    (r.container.querySelector('input[type="password"]') as HTMLInputElement) ||
    (r.container.querySelector('input[placeholder="Şifre"]') as HTMLInputElement);

  const form = r.container.querySelector("form") as HTMLFormElement | null;

  const submitBtn = Array.from(r.container.querySelectorAll("button")).find((b) =>
    (b.textContent || "").includes("Giriş Yap")
  ) as HTMLButtonElement | null;

  expect(emailInput).toBeTruthy();
  expect(passInput).toBeTruthy();
  expect(form || submitBtn).toBeTruthy();

  return { ...r, emailInput, passInput, form, submitBtn };
}

async function submit(form: HTMLFormElement | null, submitBtn: HTMLButtonElement | null) {
  await tick();
  if (form && typeof (form as any).requestSubmit === "function") {
    (form as any).requestSubmit();
  } else if (form) {
    fireEvent.submit(form);
  } else if (submitBtn) {
    fireEvent.click(submitBtn);
  } else {
    throw new Error("Form veya 'Giriş Yap' butonu bulunamadı");
  }
}

/* ---------------- tests ---------------- */
describe("Giris Page", () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockReset();
    girisYapMock.mockReset();
    mockKullanici = null;
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
    cleanup();
  });

  it("geçerli bilgilerle giriş yapar ve admin ise admin-panel'e yönlendirir", async () => {
    const { emailInput, passInput, form, submitBtn, rerender } = setup();

    setInputValue(emailInput, "admin@test.com");
    setInputValue(passInput, "123456");

    girisYapMock.mockResolvedValueOnce(undefined);

    await submit(form, submitBtn);
    await tick();

    // ❌ argüman kontrolü yok; sadece çağrılmış mı
    expect(girisYapMock).toHaveBeenCalled();

    // rol değişimini simüle et
    mockKullanici = { rol: "admin" };
    rerender(<Giris />);
    await tick();

    expect(navigateMock).toHaveBeenCalledWith("/admin-panel");
  });

  it("geçerli bilgilerle giriş yapar ve normal kullanıcı ise /hesap'a yönlendirir", async () => {
    const { emailInput, passInput, form, submitBtn, rerender } = setup();

    setInputValue(emailInput, "user@test.com");
    setInputValue(passInput, "123456");

    girisYapMock.mockResolvedValueOnce(undefined);

    await submit(form, submitBtn);
    await tick();

    // ❌ argüman kontrolü yok; sadece çağrılmış mı
    expect(girisYapMock).toHaveBeenCalled();

    mockKullanici = { rol: "user" };
    rerender(<Giris />);
    await tick();

    expect(navigateMock).toHaveBeenCalledWith("/hesap");
  });

  it("giriş hatalıysa alert gösterir", async () => {
    const { emailInput, passInput, form, submitBtn } = setup();

    setInputValue(emailInput, "x@y.z");
    setInputValue(passInput, "wrongpass");

    girisYapMock.mockRejectedValueOnce(new Error("Yanlış şifre"));

    await submit(form, submitBtn);
    await tick();

    expect(alertSpy).toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});

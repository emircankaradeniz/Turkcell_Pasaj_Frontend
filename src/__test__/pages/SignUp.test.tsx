// __test__/pages/SignUp.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, tick } from "../utils/render";
import { fireEvent, cleanup } from "@testing-library/react";
import SignUp from "../../pages/SignUp";

/* -------------------------- HOISTED MOCK'LAR -------------------------- */
const { navigateMock, kayitOlMock, cuwMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  kayitOlMock: vi.fn(),
  cuwMock: vi.fn(),
}));

/* -------------------------- MODÜL MOCK'LARI --------------------------- */
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("@/context/AuthContext", () => ({ useAuth: () => ({ kayitOl: kayitOlMock }) }));
vi.mock("../../context/AuthContext", () => ({ useAuth: () => ({ kayitOl: kayitOlMock }) }));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  createUserWithEmailAndPassword: (...args: any[]) => cuwMock(...args),
}));

/* --------------------------- HELPER FONKSİYON -------------------------- */
function setInputValue(input: HTMLInputElement, value: string) {
  input.focus();
  (input as any).value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.blur();
}

function prepareForm(container: HTMLElement, email = "test@example.com", pass = "12345") {
  const emailInput =
    (container.querySelector('input[type="email"]') as HTMLInputElement) ||
    (container.querySelector('input[placeholder="Email"]') as HTMLInputElement);
  if (emailInput) setInputValue(emailInput, email);

  const passInput =
    (container.querySelector('input[type="password"]') as HTMLInputElement) ||
    (container.querySelector('input[placeholder="Şifre"]') as HTMLInputElement);
  if (passInput) setInputValue(passInput, pass);

  const form = container.querySelector("form") as HTMLFormElement | null;
  const submitBtn = Array.from(container.querySelectorAll("button")).find((b) =>
    (b.textContent || "").toLowerCase().includes("kaydol")
  ) as HTMLButtonElement | null;

  return { form, submitBtn };
}

function submit(container: HTMLElement) {
  const { form, submitBtn } = prepareForm(container);
  if (form && typeof (form as any).requestSubmit === "function") {
    (form as any).requestSubmit();
  } else if (form) {
    fireEvent.submit(form);
  } else if (submitBtn) {
    fireEvent.click(submitBtn);
  } else {
    throw new Error("Form veya Kaydol butonu bulunamadı");
  }
}

/* -------------------------------- TEST -------------------------------- */
describe("SignUp Page (sade)", () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock.mockReset();
    kayitOlMock.mockReset();
    cuwMock.mockReset();
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
    cleanup();
  });

  it("şifre 6 karakterden kısa ise alert verir ve kayıt denemez", async () => {
    const { container } = render(<SignUp />);

    // kısa şifre ile formu hazırla ve gönder
    prepareForm(container, "test@example.com", "12345");
    submit(container);

    await tick(0);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    const msg = String(alertSpy.mock.calls[0]?.[0] ?? "");
    expect(msg.includes("Şifre en az 6 karakter")).toBe(true);

    // erken validasyon nedeniyle kayıt/girişimler olmamalı
    expect(kayitOlMock).not.toHaveBeenCalled();
    expect(cuwMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});

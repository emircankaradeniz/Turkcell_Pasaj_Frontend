import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, click, typeInto, tick } from "../utils/render";
import HesapSayfasi from "../../pages/AccountPage";

// ---------- AuthContext mock ----------
let mockUser: any = { uid: "u1", email: "test@example.com", rol: "user" };
const cikisYapMock = vi.fn();

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ kullanici: mockUser, cikisYap: cikisYapMock }),
}));

// ---------- Router mock ----------
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  // Projede daha önce kullandığımız basit Link mock’un varsa oradan da çekebilirsin
  // burada inline veriyorum:
  return {
    Link: ({ to, children }: any) => <a href={to} data-testid="link">{children}</a>,
    useNavigate: () => navigateMock,
  };
});

// ---------- Firestore mock (kendi mocks/firestore dosyanla uyumlu) ----------
vi.mock("firebase/firestore", async () => {
  const m = await import("../mocks/firestore");
  return m;
});
import {
  getDocMock,
  setDocMock,
  doc as docMock,
} from "../mocks/firestore";

// Not: db parametresine ihtiyacımız yok; doc mock'u zaten db'yi önemsemiyor.
// import edilen "../firebase" gerçek dosyada kalsın; doc(db,...) çağrısında db'nin değeri önemli değil.

describe("HesapSayfasi", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    navigateMock.mockReset();
    getDocMock.mockReset();
    setDocMock.mockReset();
    cikisYapMock.mockReset();
    mockUser = { uid: "u1", email: "test@example.com", rol: "user" };
    // doc mock'u path bilgisi döndürsün (mocks/firestore zaten böyle)
    (docMock as any).mockImplementation?.((...segments: any[]) => ({ path: segments }));
  });

  it("kullanıcı yoksa /giris'e yönlendirir ve getDoc çağrılmaz", async () => {
    mockUser = null;

    render(<HesapSayfasi />);
    await tick();

    expect(navigateMock).toHaveBeenCalledWith("/giris");
    expect(getDocMock).not.toHaveBeenCalled();
  });

  it("Firestore'dan gelen verileri inputlara yazar", async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({
        ad: "Ali",
        soyad: "Yılmaz",
        dogumTarihi: "2000-01-01",
        meslek: "Mühendis",
        telefon: "5551234567",
        izinVer: true,
      }),
    });

    const { container } = render(<HesapSayfasi />);
    await tick();

    const ad = container.querySelector('input[placeholder="Ad"]') as HTMLInputElement;
    const soyad = container.querySelector('input[placeholder="Soyad"]') as HTMLInputElement;
    const tarih = container.querySelector('input[type="date"]') as HTMLInputElement;
    const meslek = container.querySelector("select") as HTMLSelectElement;
    const email = container.querySelector('input[placeholder="E-posta Adresi"]') as HTMLInputElement;
    const telefon = container.querySelector('input[placeholder="Telefon Numarası"]') as HTMLInputElement;

    expect(ad?.value).toBe("Ali");
    expect(soyad?.value).toBe("Yılmaz");
    expect(tarih?.value).toBe("2000-01-01");
    expect(meslek?.value).toBe("Mühendis");
    // email state başlangıçta kullanıcı email’iyle (mockUser.email) geliyor
    expect(email?.value).toBe("test@example.com");
    expect(telefon?.value).toBe("5551234567");

    // izin checkbox'larından biri true olmalı (ilk izin bloğu)
    const izinCheck = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(izinCheck?.checked).toBe(true);
  });

  it("Kaydet'e basınca setDoc merge:true ve form değerleriyle çağrılır", async () => {
    // Veri yok gibi davran (exists false) -> inputlar boş başlayabilir
    getDocMock.mockResolvedValue({ exists: () => false });

    const { container } = render(<HesapSayfasi />);
    await tick();

    const ad = container.querySelector('input[placeholder="Ad"]') as HTMLInputElement;
    const soyad = container.querySelector('input[placeholder="Soyad"]') as HTMLInputElement;
    const tarih = container.querySelector('input[type="date"]') as HTMLInputElement;
    const meslek = container.querySelector("select") as HTMLSelectElement;
    const email = container.querySelector('input[placeholder="E-posta Adresi"]') as HTMLInputElement;
    const telefon = container.querySelector('input[placeholder="Telefon Numarası"]') as HTMLInputElement;

    typeInto(ad, "Veli");
    typeInto(soyad, "Demir");
    // date input'a direkt value atayıp change event gönderelim:
    tarih.value = "1999-12-31";
    tarih.dispatchEvent(new Event("input", { bubbles: true }));

    // select
    meslek.value = "Öğretmen";
    meslek.dispatchEvent(new Event("change", { bubbles: true }));

    typeInto(email, "veli@example.com");
    typeInto(telefon, "5300000000");

    // izin checkbox'ını açalım (ilk checkbox)
    const izinCheck = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    click(izinCheck);

    // Kaydet
    const kaydetBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim().toLowerCase() === "kaydet"
    )!;
    click(kaydetBtn);
    await tick();

    expect(setDocMock).toHaveBeenCalledTimes(1);
    const [docRefArg, dataArg, optionArg] = setDocMock.mock.calls[0];

    // merge:true
    expect(optionArg).toMatchObject({ merge: true });

    // Gönderilen veriler
    expect(dataArg).toMatchObject({
      ad: "Veli",
      soyad: "Demir",
      dogumTarihi: "1999-12-31",
      meslek: "Öğretmen",
      email: "veli@example.com",
      telefon: "5300000000",
      izinVer: true,
    });

    // docRef path kontrol (db, "users", uid)
    expect(docRefArg?.path).toEqual([expect.anything(), "users", "u1"]);
  });

  it("Çıkış Yap butonu cikisYap ve navigate('/') çağırır", async () => {
    getDocMock.mockResolvedValue({ exists: () => false });

    const { container } = render(<HesapSayfasi />);
    await tick();

    const cikisBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim().toLowerCase() === "çıkış yap"
    )!;
    click(cikisBtn);

    expect(cikisYapMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("kullanıcı admin ise Admin Panel butonu görünür ve tıklanınca /admin-panel'e gider", async () => {
    mockUser = { uid: "admin1", email: "admin@ex.com", rol: "admin" };
    getDocMock.mockResolvedValue({ exists: () => false });

    const { container } = render(<HesapSayfasi />);
    await tick();

    const adminBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.trim().toLowerCase() === "admin panel"
    )!;
    expect(adminBtn).toBeTruthy();

    click(adminBtn);
    expect(navigateMock).toHaveBeenCalledWith("/admin-panel");
  });
});

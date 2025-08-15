// src/__test__/contextMocks.ts
import { vi } from "vitest";

// ---- Paylaşılan mock durumları (testten değiştirilebilir) ----
let mockUser: any = { uid: "u1", email: "test@example.com" };
let mockFavoriler: any[] = [
  { id: "1", ad: "Ürün 1", kategori: "Elektronik", fiyat: 100 },
  { id: "2", ad: "Ürün 2", kategori: "Moda",        fiyat: 200 },
];

// ---- Testlerden kontrol için setter'lar ----
export const setMockUser = (u: any) => {
  mockUser = u;
};
export const setMockFavoriler = (arr: any[]) => {
  mockFavoriler = arr;
};

// ---- AuthContext mock'u ----
// Not: Projede '@' alias'ı src klasörüne işaret etmeli (tsconfig.paths)
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ kullanici: mockUser }),
}));

// ---- FavoriteContext mock'u ----
// DİKKAT: Burada İÇERİDE tekrar "const mockFavoriler = ..." YAZMIYORUZ!
// Aksi halde dışarıdan set ettiğin değerler görünmez (shadowing olur).
vi.mock("@/context/FavoriteContext", () => ({
  useFavori: () => ({
    favoriler: mockFavoriler,        // her çağrıda güncel referans
    favoriEkleCikar: vi.fn(),
    favorideMi: vi.fn(() => false),
  }),
}));

// ---- İstersen testlerde doğrudan okumak için export et ----
export { mockUser, mockFavoriler };

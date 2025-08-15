// src/__test__/mocks/firestore.ts
import { vi, Mock } from "vitest";

/** ===========================
 *  Basit yardımcı tip/objeler
 *  =========================== */
type AnyObj = Record<string, any>;
const ref = (type: string, extra: AnyObj = {}) => ({ __type: type, ...extra });

/** ===========================
 *  Firestore çekirdek API mock'ları
 *  =========================== */

// getFirestore
export const getFirestore = vi.fn(() => ref("firestore"));

// collection(db, name)
export const collection = vi.fn((db: unknown, name: string) =>
  ref("collection", { name })
);

// query(ref, ...constraints)
export const query = vi.fn((...args: unknown[]) =>
  ref("query", { args })
);

// where(field, op, value)
export const where = vi.fn((field: string, op: string, value: unknown) =>
  ref("where", { field, op, value })
);

// ⚠️ Eksik olan: or(...constraints)
export const or = vi.fn((...constraints: unknown[]) =>
  ref("or", { constraints })
);

// limit(n)
export const limit = vi.fn((n: number) =>
  ref("limit", { n })
);

// orderBy(field, dir?)
export const orderBy = vi.fn((field: string, dir?: "asc" | "desc") =>
  ref("orderBy", { field, dir })
);

// doc(db, col, id) veya doc(path...)
export const doc = vi.fn((...segments: string[]) =>
  ref("doc", { path: segments })
);

// serverTimestamp()
export const serverTimestamp = vi.fn(() =>
  ref("serverTimestamp")
);

/** ===========================
 *  CRUD / Snapshot mock'ları
 *  =========================== */

// getDocs
export const getDocsMock: Mock = vi.fn();
export const getDocs = (...args: unknown[]) => getDocsMock(...args);

// getDoc
export const getDocMock: Mock = vi.fn();
export const getDoc = (...args: unknown[]) => getDocMock(...args);

// updateDoc
export const updateDocMock: Mock = vi.fn();
export const updateDoc = (...args: unknown[]) => updateDocMock(...args);

// deleteDoc  ✅ (önceden yanlışlıkla updateDocMock çağrılıyordu)
export const deleteDocMock: Mock = vi.fn();
export const deleteDoc = (...args: unknown[]) => deleteDocMock(...args);

// addDoc
export const addDocMock: Mock = vi.fn();
export const addDoc = (...args: unknown[]) => addDocMock(...args);

// onSnapshot
export const onSnapshotMock: Mock = vi.fn();
export const onSnapshot = (...args: unknown[]) => onSnapshotMock(...args);

// setDoc
export const setDocMock: Mock = vi.fn();
export const setDoc = (...args: unknown[]) => setDocMock(...args);

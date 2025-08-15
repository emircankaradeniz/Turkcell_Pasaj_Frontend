import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, tick, click } from '../utils/render';

const favoriSpy = vi.fn();

vi.mock('@/context/FavoriteContext', () => ({
  useFavori: () => ({
    favoriler: [],           // .some güvenli
    favoriEkleCikar: favoriSpy, // ✅ hep aynı spy
  }),
}));
// --- Ortak modül mock'ları ---
vi.mock('react-router-dom', () => import('../mocks/router'));
vi.mock('firebase/firestore', () => import('../mocks/firestore'));

// 🔧 ÖNEMLİ: firebase db için hem mutlak hem göreli modül kimliklerini mock’la
// Bileşenindeki import: `import { db } from "../firebase"`
vi.mock('/src/firebase', () => ({ db: {} as any }));
vi.mock('../../firebase', () => ({ db: {} as any }));

// FavoriteContext: test başına dinamik mock (hem mutlak hem göreli güvence)
beforeEach(() => {
  favoriSpy.mockReset();
  vi.doMock('/src/context/FavoriteContext', () => ({
    useFavori: () => ({
      favoriler: [{ id: 'p1' }],
      favoriEkleCikar: favoriSpy,
    }),
  }));
  vi.doMock('../../context/FavoriteContext', () => ({
    useFavori: () => ({
      favoriler: [{ id: 'p1' }],
      favoriEkleCikar: favoriSpy,
    }),
  }));
});

// Firestore mock çağrılarını içe al
import { getDocsMock } from '../mocks/firestore';

// Bileşen importu (mocklardan SONRA)
import EnIyiTeklifler from '../../components/BestOffers';

describe('EnIyiTeklifler', () => {
  it('başlık ve ürünler render edilir', async () => {
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'p1', data: () => ({ ad: 'Ürün 1', gorsel: 'http://img1', fiyat: 19999 }) },
        { id: 'p2', data: () => ({ ad: 'Ürün 2', gorsel: 'http://img2', fiyat: 3499 }) },
      ],
    });

    const { container } = render(<EnIyiTeklifler />);
    await tick(0);

    expect(container.textContent).toContain('En İyi Teklifler');
    expect(container.textContent).toContain('Ürün 1');
    expect(container.textContent).toContain('Ürün 2');

    const links = Array.from(container.querySelectorAll('a')).map(a => a.getAttribute('href'));
    expect(links).toContain('/urun/p1');
    expect(links).toContain('/urun/p2');

    // Fiyatlar (tr-TR)
    expect(container.textContent).toContain('19.999');
    expect(container.textContent).toContain('3.499');
  });

  it('favori butonuna basınca doğru ürünle çağrılır', async () => {
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'p1', data: () => ({ ad: 'Ürün 1', gorsel: 'http://img1', fiyat: 1000 }) },
        { id: 'p2', data: () => ({ ad: 'Ürün 2', gorsel: 'http://img2', fiyat: 2000 }) },
        { id: 'p3', data: () => ({ ad: 'Ürün 3', gorsel: 'http://img3', fiyat: 3000 }) },
        { id: 'p4', data: () => ({ ad: 'Ürün 4', gorsel: 'http://img4', fiyat: 4000 }) },
      ],
    });

    const { container } = render(<EnIyiTeklifler />);
    await tick(0);

    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.length).toBe(4);

    click(buttons[0]);
    expect(favoriSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1', ad: 'Ürün 1' }));

    click(buttons[2]);
    expect(favoriSpy).toHaveBeenCalledWith(expect.objectContaining({ id: 'p3', ad: 'Ürün 3' }));
  });

  it('Firestore hata atarsa konsola yazar, crash olmaz', async () => {
    const err = new Error('boom');
    getDocsMock.mockRejectedValueOnce(err);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<EnIyiTeklifler />);
    await tick(0);

    expect(container.textContent).toContain('En İyi Teklifler');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

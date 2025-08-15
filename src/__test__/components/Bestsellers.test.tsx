import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, click, tick } from '../utils/render';

export const favoriEkleCikarSpy = vi.fn();
export const favorideMiMock = vi.fn((id: string) => false); 
// istersen belirli id'leri true yap:
// const favoriSet = new Set(['u1', 'u3']);
// export const favorideMiMock = vi.fn((id:string)=> favoriSet.has(id));

vi.mock('@/context/FavoriteContext', () => ({
  useFavori: () => ({
    favoriler: [],                 // güvenli başlangıç
    favoriEkleCikar: favoriEkleCikarSpy,
    favorideMi: favorideMiMock,    // ✅ eksik olan buydu
  }),
}));
// Ortak mock'lar
vi.mock('react-router-dom', () => import('../mocks/router'));
vi.mock('firebase/firestore', () => import('../mocks/firestore'));

// db mock'u (hem mutlak hem göreli yol için)
vi.mock('/src/firebase', () => ({ db: {} as any }));
vi.mock('../../firebase', () => ({ db: {} as any }));

// Firestore mock fonksiyonları
import { getDocsMock } from '../mocks/firestore';

// Context mock (her testte güncellenecek)
const favorideMiSpy = vi.fn();
beforeEach(() => {
  favoriEkleCikarSpy.mockReset();
  favorideMiSpy.mockReset();

  vi.doMock('/src/context/FavoriteContext', () => ({
    useFavori: () => ({
      favorideMi: favorideMiSpy,
      favoriEkleCikar: favoriEkleCikarSpy,
    }),
  }));
  vi.doMock('../../context/FavoriteContext', () => ({
    useFavori: () => ({
      favorideMi: favorideMiSpy,
      favoriEkleCikar: favoriEkleCikarSpy,
    }),
  }));
});

// Bileşen importu mocklardan sonra
import CokSatanlar from '../../components/Bestsellers';

describe('CokSatanlar', () => {
  it('başlık ve kategori butonları render edilir', async () => {
    getDocsMock.mockResolvedValueOnce({ docs: [] });
    const { container } = render(<CokSatanlar />);
    await tick(0);

    expect(container.textContent).toContain('Çok Satanlar');

    // Kategori butonlarının sayısı (KategoriEnum içeriğine göre en az 1 olmalı)
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('Firestore’dan gelen ürünler listelenir', async () => {
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'u1', data: () => ({ ad: 'Ürün 1', gorsel: 'http://img1', fiyat: 1000, aciklama: 'Açıklama 1' }) },
        { id: 'u2', data: () => ({ ad: 'Ürün 2', gorsel: 'http://img2', fiyat: 2000, aciklama: 'Açıklama 2' }) },
      ],
    });
    favorideMiSpy.mockReturnValue(false);

    const { container } = render(<CokSatanlar />);
    await tick(0);

    expect(container.textContent).toContain('Ürün 1');
    expect(container.textContent).toContain('Ürün 2');

    const imgs = Array.from(container.querySelectorAll('img'));
    expect(imgs[0].getAttribute('src')).toBe('http://img1');
    expect(imgs[1].getAttribute('src')).toBe('http://img2');
  });

  it('favori butonuna basınca favoriEkleCikar çağrılır', async () => {
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'u1', data: () => ({ ad: 'Ürün 1', gorsel: '', fiyat: 1000, aciklama: '' }) },
      ],
    });
    favorideMiSpy.mockReturnValue(false);

    const { container } = render(<CokSatanlar />);
    await tick(0);

    const btn = container.querySelector('button.absolute') as HTMLButtonElement;
    click(btn);

    expect(favoriEkleCikarSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'u1', ad: 'Ürün 1' })
    );
  });

  it('kategori değişince Firestore tekrar çağrılır', async () => {
    // İlk kategori
    getDocsMock.mockResolvedValueOnce({ docs: [] });

    const { container } = render(<CokSatanlar />);
    await tick(0);

    // İkinci kategori için yeni veri
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'u2', data: () => ({ ad: 'Ürün 2', gorsel: '', fiyat: 2000, aciklama: '' }) },
      ],
    });

    // İlk buton kategoriyi değiştirir
    const buttons = Array.from(container.querySelectorAll('button'));
    click(buttons[1]); // farklı kategoriye geç
    await tick(0);

    expect(container.textContent).toContain('Ürün 2');
  });

  it('Firestore hata atarsa console.error çağrılır', async () => {
    const err = new Error('firestore error');
    getDocsMock.mockRejectedValueOnce(err);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<CokSatanlar />);
    await tick(0);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

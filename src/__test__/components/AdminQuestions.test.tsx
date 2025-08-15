// src/__test__/components/AdminQuestions.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, tick, typeInto, click } from '../utils/render';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

// Modül mock'ları
vi.mock('@/context/AuthContext', () => import('../mocks/auth'));
vi.mock('@/firebase/firebaseConfig', () => import('../mocks/firebaseConfig'));
vi.mock('firebase/firestore', () => import('../mocks/firestore'));

// Mock araçlarını import et (assert ve kontrol için)
import { __setMockUser } from '../mocks/auth';
import {
  getDocsMock, getDocMock, updateDocMock,
} from '../mocks/firestore';

import AdminSorular from '../../components/AdminQuestions';

describe('AdminSorular', () => {
  beforeEach(() => {
    getDocsMock.mockReset();
    getDocMock.mockReset();
    updateDocMock.mockReset();
    // Varsayılan admin
    __setMockUser({ rol: 'admin' });
  });

  it('admin değilse erişim kısıtı mesajı gösterir', async () => {
    __setMockUser({ rol: 'user' });

    const { container } = render(<AdminSorular />);
    expect(container.textContent).toContain('Bu sayfaya erişim yetkiniz yok.');
  });

  it('cevaplanmamış soru yoksa boş mesajı gösterir', async () => {
    getDocsMock.mockResolvedValueOnce({ docs: [] }); // sorular koleksiyonu
    const { container } = render(<AdminSorular />);
    await tick(0); // useEffect + async bekle
    expect(container.textContent).toContain('Şu anda cevaplanmamış soru bulunmuyor.');
  });

  it('soruları ve ürün bilgisini listeler', async () => {
    // 2 soru, aynı ürüne ait olsun (urun getirme tekil çalışsın diye)
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'q1', data: () => ({
          urunId: 'u1', saticiAd: 'Satıcı A', soru: 'Bu ürün su geçirmez mi?',
          cevap: '', kullaniciAd: 'Ali', tarih: 123,
        }) },
        { id: 'q2', data: () => ({
          urunId: 'u1', saticiAd: 'Satıcı A', soru: 'Garanti var mı?',
          cevap: null, kullaniciAd: 'Ayşe', tarih: 124,
        }) },
      ],
    });

    // Ürün snapshot
    getDocMock.mockResolvedValueOnce({
      exists: () => true,
      id: 'u1',
      data: () => ({ id: 'IGNORED_BY_CODE', ad: 'iPhone 16', gorsel: 'http://img' }),
    });

    const { container } = render(<AdminSorular />);
    await tick(0); // liste + ürün fetch

    // Ürün adı görünsün
    expect(container.textContent).toContain('iPhone 16');
    // Sorular görünsün
    expect(container.textContent).toContain('Bu ürün su geçirmez mi?');
    expect(container.textContent).toContain('Garanti var mı?');

    // Görsel çıktısı (img tag)
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('http://img');
  });

  it('cevap boşsa alert çıkarır ve updateDoc çağrılmaz', async () => {
    // 1 soru
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'q1', data: () => ({
          urunId: 'u1', saticiAd: 'S', soru: 'Soru?', cevap: '', kullaniciAd: 'Ali', tarih: 1,
        }) },
      ],
    });
    // Ürün
    getDocMock.mockResolvedValueOnce({
      exists: () => true, id: 'u1', data: () => ({ ad: 'Ürün', gorsel: '' }),
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { container } = render(<AdminSorular />);
    await tick(0);

    // Cevap yazmadan Cevapla
    const btn = Array.from(container.querySelectorAll('button'))
      .find((b) => /cevapla/i.test(b.textContent || '')) as HTMLButtonElement;
    click(btn);

    expect(alertSpy).toHaveBeenCalled();
    expect(updateDocMock).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('cevap yazıldığında updateDoc çağrılır ve soru listeden silinir', async () => {
    // 1 soru
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'q1', data: () => ({
          urunId: 'u1', saticiAd: 'S', soru: 'Soru?', cevap: '', kullaniciAd: 'Ali', tarih: 1,
        }) },
      ],
    });
    // Ürün
    getDocMock.mockResolvedValueOnce({
      exists: () => true, id: 'u1', data: () => ({ ad: 'Ürün', gorsel: '' }),
    });

    // updateDoc await'inin microtask'e düşmesi için bir defalık resolved değer
    updateDocMock.mockResolvedValueOnce(undefined);

    const { container } = render(<AdminSorular />);
    await tick(0);

    // Textarea'yı bul ve userEvent ile yaz
    const ta = container.querySelector('textarea') as HTMLTextAreaElement;
    const user = userEvent.setup();
    await user.clear(ta);
    await user.type(ta, 'Evet, su geçirmez.');

    // state güncellemesini bekle
    await tick(0);

    const btn = Array.from(container.querySelectorAll('button'))
      .find((b) => /cevapla/i.test(b.textContent || '')) as HTMLButtonElement;

    // userEvent ile tıkla
    await user.click(btn);

    // updateDoc çağrısını bekle
    await waitFor(() => {
      expect(updateDocMock).toHaveBeenCalledTimes(1);
    });

    // payload kontrolü
    const [, payload] = updateDocMock.mock.calls[0];
    expect(payload).toEqual({ cevap: 'Evet, su geçirmez.' });

    // listeden düşmüş olmalı
    await waitFor(() => {
      expect((container.textContent || '').toLowerCase()).not.toContain('soru?');
    });
  });
});

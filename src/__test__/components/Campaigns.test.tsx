import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '../utils/render';
import Kampanyalar from '../../components/Campaigns';

describe('Kampanyalar', () => {
  it('başlık ve üç kampanya linki render edilir', () => {
    const { container } = render(<Kampanyalar />);

    // Başlık
    expect(container.textContent).toContain('Kampanyalar');

    // Tüm linkler
    const links = Array.from(container.querySelectorAll('a'));
    expect(links.length).toBe(3);

    // Hedef URL'ler
    const hrefs = links.map(a => a.getAttribute('href'));
    expect(hrefs).toEqual([
      'https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/xiaomi',
      'https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/1000-tlye-varan-taksitlerle-alabilecegin-urunler-burada',
      'https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/pasaj-hangikredi-nakit-firsatlari',
    ]);

    // target / rel kontrolü (yeni sekme + güvenlik)
    links.forEach(a => {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    });

    // Görseller ve alt yazılar
    const imgs = Array.from(container.querySelectorAll('img'));
    expect(imgs.length).toBe(3);

    const srcs = imgs.map(i => i.getAttribute('src'));
    const alts = imgs.map(i => i.getAttribute('alt'));

    expect(srcs).toEqual([
      '/images/campaign1.png',
      '/images/campaign2.png',
      '/images/campaign3.png',
    ]);
    expect(alts).toEqual(['Kampanya 1', 'Kampanya 2', 'Kampanya 3']);
  });

  it('sol sütunda 2, sağ sütunda 1 görsel bulunur', () => {
    const { container } = render(<Kampanyalar />);

    // Sol sütun: ilk grid alanındaki 2 <a> içindeki img
    const leftCol = container.querySelector('.md\\:col-span-2');
    const leftImgs = Array.from(leftCol?.querySelectorAll('img') ?? []);
    expect(leftImgs.length).toBe(2);

    // Sağ sütun: son grid kolonundaki img
    // (Sol sütundan sonraki bir div içinde tek <img> var)
    const grids = Array.from(container.querySelectorAll('.grid > div'));
    const rightCol = grids.find((div) => !div.className.includes('md:col-span-2'));
    const rightImg = rightCol?.querySelector('img');
    expect(rightImg).toBeTruthy();
  });
});

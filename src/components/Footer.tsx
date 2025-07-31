import React from "react";
import { Link } from "react-router-dom";
import { SocialIcon } from 'react-social-icons'

export default function Footer() {
  return (
    <footer className="bg-[#0A2463] text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Sosyal Medya ve QR */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10">
          {/* Sol kısım */}
          <div>
            <Link to="/" className="flex items-center gap-2">
                      <img src="/images/PasajLogoWhite.png" alt="logo" className="w-[100px]" />
                    </Link>
            <br/>
            <p className="text-gray-300 mb-4 font-bold">  Bizi Takip Edin</p>
            <div className="flex gap-4">
                <SocialIcon url="https://x.com" style={{ height: 30, width: 30 }} />
                <SocialIcon url="https://facebook.com" style={{ height: 30, width: 30 }} />
                <SocialIcon url="https://instagram.com" style={{ height: 30, width: 30 }} />
                <SocialIcon url="https://youtube.com" style={{ height: 30, width: 30 }} />
                <SocialIcon url="https://linkedin.com" style={{ height: 30, width: 30 }} />
            </div>
          </div>

          {/* QR Kodu */}
          <div className="mt-6 md:mt-0 text-center">
            <p className="mb-2">Turkcell Uygulamasını İndirin</p>
            <img
              src="/images/qrkod.png"
              alt="QR Kod"
              className="w-24 h-24 mx-auto mb-2"
            />
            <p className="text-gray-300 text-xs">
              QR kodunu taratarak uygulamayı kolayca indirin
            </p>
          </div>
        </div>

        {/* Link Grupları */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-gray-300">
          <div>
            <h3 className="font-bold text-white mb-2">Hakkımızda</h3>
            <ul className="space-y-1">
              <li>Pasaj Genel Bakış</li>
              <li>Kurumsal İletişim</li>
              <li>Kariyer</li>
              <li>Gizlilik ve Güvenlik</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Popüler Kategoriler</h3>
            <ul className="space-y-1">
              <li>Cep Telefonu</li>
              <li>Tabletler</li>
              <li>Akıllı Saatler</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Yardım</h3>
            <ul className="space-y-1">
              <li>Yardım Merkezi</li>
              <li>İşlem Rehberi</li>
              <li>İade Politikası</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Markalar</h3>
            <ul className="space-y-1">
              <li>Apple</li>
              <li>Samsung</li>
              <li>Xiaomi</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Kampanyalar</h3>
            <ul className="space-y-1">
              <li>Fırsatlar</li>
              <li>Sevgililer Günü</li>
              <li>Okula Dönüş</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Popüler Ürünler</h3>
            <ul className="space-y-1">
              <li>iPhone 15</li>
              <li>iPhone 15 Pro</li>
              <li>iPhone 15 Plus</li>
            </ul>
          </div>
        </div>

        {/* Alt Logo ve Telif */}
        <div className="mt-10 border-t border-gray-500 pt-4 text-gray-400 text-xs flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-4 mb-2 md:mb-0">
            <span>© 2025 Pasaj</span>
            <a href="#">Gizlilik ve Güvenlik</a>
          </div>
          <div className="flex gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Fizy_logo.svg/1280px-Fizy_logo.svg.png" alt="Fizy" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/TV_logo.png" alt="TV" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}

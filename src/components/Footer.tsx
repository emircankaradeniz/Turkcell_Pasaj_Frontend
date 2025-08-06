import React from "react";
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
  return (
    <footer className="bg-[#0A2463] text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Sosyal Medya ve QR */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6">
          {/* Sol kısım */}
          <div className="text-center md:text-left">
            <Link to="/" className="flex justify-center md:justify-start items-center gap-2">
              <img src="/images/PasajLogoWhite.png" alt="logo" className="w-[100px]" />
            </Link>
            <p className="text-gray-300 mt-4 mb-2 font-bold">Bizi Takip Edin</p>
            <div className="flex gap-3 justify-center md:justify-start flex-wrap">
              <SocialIcon url="https://x.com" style={{ height: 30, width: 30 }} />
              <SocialIcon url="https://facebook.com" style={{ height: 30, width: 30 }} />
              <SocialIcon url="https://instagram.com" style={{ height: 30, width: 30 }} />
              <SocialIcon url="https://youtube.com" style={{ height: 30, width: 30 }} />
              <SocialIcon url="https://linkedin.com" style={{ height: 30, width: 30 }} />
            </div>
          </div>

          {/* QR Kodu */}
          <div className="text-center">
            <p className="mb-2 font-semibold">Turkcell Uygulamasını İndirin</p>
            <img
              src="/images/qrkod.png"
              alt="QR Kod"
              className="w-24 h-24 mx-auto mb-2"
            />
            <p className="text-gray-300 text-xs max-w-[200px] mx-auto">
              QR kodunu taratarak uygulamayı kolayca indirin
            </p>
          </div>
        </div>

        {/* Link Grupları */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-gray-300 text-center md:text-left">
          {[
            { title: "Hakkımızda", links: ["Pasaj Genel Bakış", "Kurumsal İletişim", "Kariyer", "Gizlilik ve Güvenlik"] },
            { title: "Popüler Kategoriler", links: ["Cep Telefonu", "Tabletler", "Akıllı Saatler"] },
            { title: "Yardım", links: ["Yardım Merkezi", "İşlem Rehberi", "İade Politikası"] },
            { title: "Markalar", links: ["Apple", "Samsung", "Xiaomi"] },
            { title: "Kampanyalar", links: ["Fırsatlar", "Sevgililer Günü", "Okula Dönüş"] },
            { title: "Popüler Ürünler", links: ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Plus"] }
          ].map((group, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-white mb-2">{group.title}</h3>
              <ul className="space-y-1">
                {group.links.map((link, i) => (
                  <li key={i} className="hover:text-yellow-400 cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt Logo ve Telif */}
        <div className="mt-10 border-t border-gray-500 pt-4 text-gray-400 text-xs flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <span>© 2025 Pasaj</span>
            <a href="#" className="hover:text-yellow-400">Gizlilik ve Güvenlik</a>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Fizy_logo.svg/1280px-Fizy_logo.svg.png" alt="Fizy" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/TV_logo.png" alt="TV" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}

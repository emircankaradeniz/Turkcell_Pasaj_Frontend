import React from "react";
import { Link } from "react-router-dom";
import { SocialIcon } from 'react-social-icons'

export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-16 py-12">
      {/* Neden Pasaj? */}
        <div className="max-w-7xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Neden Pasaj?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Akıllı telefondan elektrikli süpürgeye, hobi ürünlerinden akıllı saatlere
            binlerce çeşit elektronik ürünü Turkcell Pasaj güvencesi ve Turkcell Pasaj
            ayrıcalığıyla keşfedin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hızlı ve Kolay Teslimat */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-900 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                🚚
              </div>
              <h3 className="font-bold text-lg">Hızlı ve Kolay Teslimat</h3>
              <p className="text-gray-600 text-sm mt-2">
                Siparişiniz isterseniz gün içinde gelsin, isterseniz bir tıkla gelin
                ve mağazadan teslim alın.
              </p>
            </div>

            {/* Esnek Ödeme Seçenekleri */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-900 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                💳
              </div>
              <h3 className="font-bold text-lg">Esnek Ödeme Seçenekleri</h3>
              <p className="text-gray-600 text-sm mt-2">
                Alışverişlerinizi ister kredi kartınıza taksitlendirin ister Turkcell
                faturanıza ek, 36 aya varan vade imkanından faydalanın.
              </p>
            </div>

            {/* Ücretsiz İptal ve İade */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-900 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                ↩️
              </div>
              <h3 className="font-bold text-lg">Ücretsiz İptal ve İade</h3>
              <p className="text-gray-600 text-sm mt-2">
                Ürünlerinizi kolayca ve hiçbir ücret ödemeden iptal ve iade
                edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
    </footer>
  );
}

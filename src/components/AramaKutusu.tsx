import React from "react";

interface AramaKutusuProps {
  arama: string;
  setArama: (deger: string) => void;
}

export default function AramaKutusu({ arama, setArama }: AramaKutusuProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <input
        type="text"
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        placeholder="Ürün ara..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-blue-500"
      />
    </div>
  );
}

import { createContext, useContext, useState } from "react";

const SepetContext = createContext();

export function SepetProvider({ children }) {
  const [sepet, setSepet] = useState([]);

  const sepeteEkle = (urun) => {
    setSepet((prev) => {
      const mevcut = prev.find((u) => u.id === urun.id);
      if (mevcut) {
        return prev.map((u) =>
          u.id === urun.id ? { ...u, adet: u.adet + 1 } : u
        );
      }
      return [...prev, { ...urun, adet: 1 }];
    });
  };

  const sepettenCikar = (id) => {
    setSepet((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <SepetContext.Provider value={{ sepet, sepeteEkle, sepettenCikar }}>
      {children}
    </SepetContext.Provider>
  );
}

export const useSepet = () => useContext(SepetContext);

import { createContext, useContext, useState, ReactNode } from "react";
import { Urun } from "../types/Urun";


interface SepetContextType {
  sepet: Urun[];
  sepeteEkle: (urun: Urun) => void;
  sepettenCikar: (id: number) => void;
}

const SepetContext = createContext<SepetContextType | undefined>(undefined);

interface SepetProviderProps {
  children: ReactNode;
}

export function SepetProvider({ children }: SepetProviderProps): React.JSX.Element {
  const [sepet, setSepet] = useState<Urun[]>([]);

  const sepeteEkle = (urun: Urun): void => {
    setSepet((prev) => {
      const mevcut = prev.find((u) => u.id === urun.id);
      if (mevcut) {
        return prev.map((u) =>
          u.id === urun.id ? { ...u, adet: (u.adet || 1) + 1 } : u
        );
      }
      return [...prev, { ...urun, adet: 1 }];
    });
  };

  const sepettenCikar = (id: number): void => {
    setSepet((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <SepetContext.Provider value={{ sepet, sepeteEkle, sepettenCikar }}>
      {children}
    </SepetContext.Provider>
  );
}

export const useSepet = (): SepetContextType => {
  const context = useContext(SepetContext);
  if (!context) {
    throw new Error("useSepet must be used within a SepetProvider");
  }
  return context;
};

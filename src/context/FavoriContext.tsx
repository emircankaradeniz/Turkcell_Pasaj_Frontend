import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Urun } from "../types/Urun";


interface FavoriContextType {
  favoriler: Urun[];
  favoriyeEkle: (urun: Urun) => void;
  favoridenCikar: (urunId: number) => void;
  favorideMi: (urunId: number) => boolean;
}

const FavoriContext = createContext<FavoriContextType | undefined>(undefined);

interface FavoriProviderProps {
  children: ReactNode;
}

export const FavoriProvider = ({ children }: FavoriProviderProps): React.JSX.Element => {
  const [favoriler, setFavoriler] = useState<Urun[]>([]);

  useEffect(() => {
    const kayitli = localStorage.getItem("favoriler");
    if (kayitli) setFavoriler(JSON.parse(kayitli));
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriler", JSON.stringify(favoriler));
  }, [favoriler]);

  const favoriyeEkle = (urun: Urun): void => {
    if (!favoriler.some((u) => u.id === urun.id)) {
      setFavoriler((prev) => [...prev, urun]);
    }
  };

  const favoridenCikar = (urunId: number): void => {
    setFavoriler((prev) => prev.filter((u) => u.id !== urunId));
  };

  const favorideMi = (urunId: number): boolean =>
    favoriler.some((u) => u.id === urunId);

  return (
    <FavoriContext.Provider
      value={{ favoriler, favoriyeEkle, favoridenCikar, favorideMi }}
    >
      {children}
    </FavoriContext.Provider>
  );
};

export const useFavori = (): FavoriContextType => {
  const context = useContext(FavoriContext);
  if (!context) {
    throw new Error("useFavori must be used within a FavoriProvider");
  }
  return context;
};

import { createContext, useContext, useEffect, useState } from "react";

const FavoriContext = createContext();

export const FavoriProvider = ({ children }) => {
  const [favoriler, setFavoriler] = useState([]);

  useEffect(() => {
    const kayitli = localStorage.getItem("favoriler");
    if (kayitli) setFavoriler(JSON.parse(kayitli));
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriler", JSON.stringify(favoriler));
  }, [favoriler]);

  const favoriyeEkle = (urun) => {
    if (!favoriler.some((u) => u.id === urun.id)) {
      setFavoriler((prev) => [...prev, urun]);
    }
  };

  const favoridenCikar = (urunId) => {
    setFavoriler((prev) => prev.filter((u) => u.id !== urunId));
  };

  const favorideMi = (urunId) => favoriler.some((u) => u.id === urunId);

  return (
    <FavoriContext.Provider value={{ favoriler, favoriyeEkle, favoridenCikar, favorideMi }}>
      {children}
    </FavoriContext.Provider>
  );
};

export const useFavori = () => useContext(FavoriContext);

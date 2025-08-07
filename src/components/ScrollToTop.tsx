import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Her route değişiminde en üste kaydır
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

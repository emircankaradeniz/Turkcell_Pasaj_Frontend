import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UrunDetay from "./pages/ProductDetail";
import Sepet from "./pages/Basket";
import Kategori from "./pages/Categori";
import AdminPanel from "./pages/AdminPanel";
import Giris from "./pages/SıgnIn";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import Favoriler from "./pages/Favorites";
import SearchResults from "./pages/SearchResults";
import AccountPage from "./pages/AccountPage";
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Context'ler
import { AuthProvider } from "./context/AuthContext";
import { SepetProvider } from "./context/BasketContext";
import { FavoriProvider } from "./context/FavoriteContext";

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      {/* 🔹 Önce kullanıcı yönetimi */}
      <AuthProvider>
        {/* 🔹 Kullanıcıya göre favoriler */}
        <FavoriProvider>
          {/* 🔹 Kullanıcıya göre sepet */}
          <SepetProvider>
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/urun/:id" element={<UrunDetay />} />
              <Route path="/sepet" element={<Sepet />} />
              <Route path="/kategori" element={<Kategori />} />
              <Route path="/giris" element={<Giris />} />
              <Route path="/favoriler" element={<Favoriler />} />
              <Route path="/arama" element={<SearchResults />} />
              <Route path="/hesap" element={<AccountPage />} />
              {/* Admin Panel - korumalı */}
                <Route
                  path="/admin-panel"
                  element={
                    <ProtectedAdminRoute>
                      <AdminPanel />
                    </ProtectedAdminRoute>
                  }
                />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
            <Footer />
          </SepetProvider>
        </FavoriProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

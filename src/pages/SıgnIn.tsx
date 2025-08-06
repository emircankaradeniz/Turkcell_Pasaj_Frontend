import { useState,useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Giris() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const { girisYap, kullanici } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await girisYap(email, sifre);
      // yönlendirmeyi useEffect yapacak
    } catch (err) {
      alert("Hatalı giriş bilgileri.");
    }
  };
useEffect(() => {
    if (kullanici) {
      if (kullanici.rol === "admin") {
        navigate("/admin-panel");
      } else {
        navigate("/hesap");
      }
    }
  }, [kullanici, navigate]);


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSifre(e.target.value)
            }
            className="border p-2 rounded w-full"
          />
          <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-full">
            Giriş Yap
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Hesabınız yok mu?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Kaydol
          </Link>
        </p>
      </div>
    </div>
  );
}

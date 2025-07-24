import { useSepet } from "../context/SepetContext";

export default function Sepet() {
  const { sepet, sepettenCikar } = useSepet();

  const toplam = sepet.reduce((acc, u) => acc + u.fiyat * u.adet, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sepetim</h1>
      {sepet.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <>
          {sepet.map((u) => (
            <div key={u.id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-semibold">{u.ad}</p>
                <p className="text-sm text-gray-500">Adet: {u.adet}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-blue-600 font-bold">{u.fiyat * u.adet} ₺</p>
                <button
                  onClick={() => sepettenCikar(u.id)}
                  className="text-red-500 hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 text-right text-xl font-bold">
            Toplam: {toplam} ₺
          </div>
        </>
      )}
    </div>
  );
}

export default function AramaKutusu({ arama, setArama }) {
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

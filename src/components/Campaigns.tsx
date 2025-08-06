export default function Kampanyalar() {
  const kampanyalar = [
    {
      src: "/images/campaign1.png",
      link: "https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/xiaomi",
      alt: "Kampanya 1",
    },
    {
      src: "/images/campaign2.png",
      link: "https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/1000-tlye-varan-taksitlerle-alabilecegin-urunler-burada",
      alt: "Kampanya 2",
    },
    {
      src: "/images/campaign3.png",
      link: "https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/pasaj-hangikredi-nakit-firsatlari",
      alt: "Kampanya 3",
    },
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-6 px-2 sm:px-4">
      <h2 className="text-2xl font-bold mb-4">Kampanyalar</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sol sütun (2 resim) */}
        <div className="flex flex-col gap-4 md:col-span-2">
          {kampanyalar.slice(0, 2).map((item, idx) => (
            <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer">
              <img
                src={item.src}
                alt={item.alt}
                className="rounded-lg w-full object-cover cursor-pointer hover:opacity-90 transition"
              />
            </a>
          ))}
        </div>

        {/* Sağ sütun (1 resim) */}
        <div>
          <a href={kampanyalar[2].link} target="_blank" rel="noopener noreferrer">
            <img
              src={kampanyalar[2].src}
              alt={kampanyalar[2].alt}
              className="rounded-lg w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const kampanyalar = [
  {
    src: "/images/firsat1.png",
    link: "https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/maxipuan-firsati-pasajda",
    alt: "Fırsat 1",
  },
  {
    src: "/images/firsat2.png",
    link: "https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/bonusa-basvurun-25-000-tlye-varan-faizsiz-ve-masrafsiz-taksitli-nakit-avans-firsatindan-yararlanin",
    alt: "Fırsat 2",
  },
  {
    src: "/images/firsat3.png",
    link: "https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/qnb-faizsiz-kredi-firsati",
    alt: "Fırsat 3",
  },
  {
    src: "/images/firsat4.png",
    link: "https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/faizsiz-taksitli-nakit-avans-pasajda",
    alt: "Fırsat 4",
  },
  {
    src: "/images/firsat5.png",
    link: "https://www.turkcell.com.tr/pasaj/bilgisayar-tablet/bilgisayarlar/oyun-bilgisayari-casper",
    alt: "Fırsat 5",
  },
  {
    src: "/images/firsat6.png",
    link: "https://www.turkcell.com.tr/pasaj/search?qx=TV+&category=all&filter=seller:14222",
    alt: "Fırsat 6",
  },
  {
    src: "/images/firsat7.png",
    link: "https://www.turkcell.com.tr/pasaj/cep-telefonu/cep-telefonu-aksesuarlari/airpods/apple-airpods-max",
    alt: "Fırsat 7",
  },
  {
    src: "/images/firsat8.png",
    link: "https://www.turkcell.com.tr/pasaj/kampanyalar/cihazlar/herschel-pasajda-ustelik-36-aya-varan-taksit-imkaniyla",
    alt: "Fırsat 8",
  },
];

// Custom Prev Button
function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      className="hidden sm:flex absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10 hover:bg-gray-100"
      onClick={onClick}
    >
      <FaChevronLeft size={20} />
    </button>
  );
}

// Custom Next Button
function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      className="hidden sm:flex absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 z-10 hover:bg-gray-100"
      onClick={onClick}
    >
      <FaChevronRight size={20} />
    </button>
  );
}

export default function KacirilmayacakFirsatlar() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // aynı anda 4 kart
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobil
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-6 relative px-2 sm:px-0">
      <h2 className="text-2xl font-bold mb-4">Kaçırılmayacak Fırsatlar</h2>
      <Slider {...settings}>
        {kampanyalar.map((item, idx) => (
          <div key={idx} className="px-2">
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <img
                src={item.src}
                alt={item.alt}
                className="rounded-lg shadow cursor-pointer hover:opacity-90 transition"
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
}

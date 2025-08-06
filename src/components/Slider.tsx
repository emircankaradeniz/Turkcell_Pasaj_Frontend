import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const sliderImages: string[] = [
  "/images/slider1.png",
  "/images/slider2.png",
  "/images/slider3.png",
  "/images/slider4.png",
  "/images/slider5.png",
  "/images/slider6.png",
  "/images/slider7.png",
  "/images/slider8.png",
  "/images/slider9.png",
  "/images/slider10.png",
  "/images/slider11.png",
  "/images/slider12.png",
  "/images/slider13.png",
  "/images/slider14.png",
  "/images/slider15.png",
];

export default function Slider(): React.JSX.Element {
  return (
    <div className="w-full max-w-screen-xl mx-auto mt-4 px-2 sm:px-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop
        className="rounded-xl overflow-hidden"
      >
        {sliderImages.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={`slide-${i}`}
              className="w-full object-cover h-40 sm:h-64 md:h-96 lg:h-[500px]"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

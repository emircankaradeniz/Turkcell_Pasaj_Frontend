import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const sliderImages = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jpg"
];

export default function Slider() {
  return (
    <div className="w-full max-w-screen-xl mx-auto mt-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop
        className="rounded-xl overflow-hidden"
      >
        {sliderImages.map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} alt={`slide-${i}`} className="w-full object-cover h-64" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

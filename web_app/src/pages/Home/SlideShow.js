import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import slideShowOne from "../../assets/images/slideShowOne.jpg";
import slideShowTwo from "../../assets/images/slideShowTwo.jpg";
import slideShowThree from "../../assets/images/slideShowThree.jpg";
import slideShowFour from "../../assets/images/slideShowFour.jpg";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "./Swiper.scss";
import "./UserHome.scss";
const SlideShow = () => {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={50}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Navigation]}
      >
        <SwiperSlide><img src={slideShowOne} alt="slideShowOne"></img></SwiperSlide>
        <SwiperSlide><img src={slideShowTwo} alt="slideShowOne"></img></SwiperSlide>
        <SwiperSlide><img src={slideShowThree} alt="slideShowOne"></img></SwiperSlide>
        <SwiperSlide><img src={slideShowFour} alt="slideShowOne"></img></SwiperSlide>
      </Swiper>
    </>
  );
}
export default SlideShow;
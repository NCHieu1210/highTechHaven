import { SwiperSlide, Swiper } from "swiper/react";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "../Home/Swiper.scss";
import "../../baseSCSS/App.scss"

import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { getPathImage } from "../../helpers/getPathImage";
import { Image } from "antd";
import { useEffect, useState } from "react";

const ProductImage = (props) => {
  const { images } = props;

  const [wBrowser, setwBrowser] = useState();

  const handleResize = () => {
    setwBrowser(window.innerWidth); // Thay đổi kích thước này theo nhu cầu của bạn
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getArrayImage = (image) => {
    const arrayImage = images
      .filter(element => element.image !== image) // Lọc các hình ảnh không phải là hình ảnh đã cho
      .map(element => getPathImage(element.image)); // Chỉ lấy đường dẫn hình ảnh

    return arrayImage;
  };

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        // navigation
        spaceBetween={50}
        slidesPerView={wBrowser > 480 ? 5 : 3}
        navigation={true}
        pagination={{
          clickable: true,
        }}
      >
        {
          images.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <Image.PreviewGroup
                  items={[
                    getPathImage(item.image),
                    ...getArrayImage(item.image)
                  ]}>
                  <Image src={getPathImage(item.image)} alt={`Hình ảnh liên quan ${index}`} ></Image>
                </Image.PreviewGroup>

              </SwiperSlide>
            )
          })
        }
      </Swiper >
    </>
  )
}

export default ProductImage;
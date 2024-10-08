import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Card } from 'antd'

// Import Swiper styles
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "./Swiper.scss";
import { getPathImage } from '../../helpers/getPathImage';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

//AntDesign card
const { Meta } = Card;
//END AntDesign card

const SectionInHome = (props) => {
  const { categories, suppliers, slug, wBrowser } = props;
  const [data, setData] = useState();


  useEffect(() => {
    categories ? setData(categories) : setData(suppliers)
  }, [])

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation={true}
        spaceBetween={wBrowser > 768 ? 50 : 15}
        slidesPerView={
          wBrowser > 1024 ? 5 : wBrowser > 768 ? 3 : 2 // Bạn có thể thay 1 bằng giá trị mặc định mà bạn muốn
        }
      >
        {data && (data.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <NavLink className="navLink" to={`/products/${slug}/${item.slug}`} >
                <Card
                  hoverable
                  style={{ width: "auto", backgroundColor: "#F5F5F5" }}
                  cover={<img alt={item.name} src={getPathImage(item.thumbnail || item.logo)} />}
                >
                  <Meta title={<span>{item.name}</span>} description={`${item.quantityProducts} sản phẩm`} />
                </Card>
              </NavLink>
            </SwiperSlide>
          )
        }))
        }
      </Swiper>
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}
export default SectionInHome;
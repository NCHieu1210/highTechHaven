import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Card, Skeleton } from 'antd'

// Import Swiper styles
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "./Swiper.scss";
import { useDispatch } from 'react-redux';
import CardProduct from '../Products/CardProduct';
import { useEffect, useState } from 'react';
import { getFavouritesByTokenService } from '../../services/favouritesService';
import { checkLoggedIn } from '../../helpers/checkLoggedIn';

//AntDesign card
const { Meta } = Card;
//END AntDesign card

const SectionProducInHome = (props) => {
  const { data, wBrowser } = props;
  // const dispatch = useDispatch();
  const [getFavorite, setGetFavorite] = useState([]);
  const [skeleton, setSkeleton] = useState(false);

  useEffect(() => {
    const getFavoriteAsync = async () => {
      setSkeleton(true)
      try {
        const response = await getFavouritesByTokenService()
        if (response.success) {
          setGetFavorite(response.data)
        }
        else {
          // console.log("Error:", response.message);
        }
      }
      catch (error) {
        // console.log("Error:", error.message);
      }
      finally {
        setSkeleton(false)
      }
    };
    if (checkLoggedIn()) {
      getFavoriteAsync()

    }
  }, [data])

  return (
    <>
      {skeleton ? <Skeleton active /> :
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={wBrowser > 768 ? 50 : 15}
          slidesPerView={
            wBrowser > 1024 ? 5 : wBrowser > 768 ? 3 : 2 // Bạn có thể thay 1 bằng giá trị mặc định mà bạn muốn
          }
          navigation={true}
        >
          {
            data.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <CardProduct product={item}></CardProduct>
                </SwiperSlide>
              )
            })
          }
        </Swiper>
      }
      <br></br>
      <br></br>
      <br></br>
    </>
  );
}
export default SectionProducInHome;
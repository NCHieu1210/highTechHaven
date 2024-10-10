import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import "./Swiper.scss";
import { getPathImage } from '../../helpers/getPathImage';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";


const SectionPostInHome = (props) => {
  const { posts, wBrowser } = props;
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
        {posts && (posts.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <NavLink className="navLink" to={`/post/${item.slug}`} onClick={() => window.scrollTo(0, 0)} >
                <Card
                  hoverable
                  style={{ width: "auto", backgroundColor: "#F5F5F5" }}
                  cover={<img alt={item.name} src={getPathImage(item.thumbnail || item.logo)} />}
                >
                  <Meta style={{ height: "200px" }} title={<span>{item.blog}</span>} description={item.name} />
                </Card>
              </NavLink>
            </SwiperSlide>
          )
        }))
        }
      </Swiper >
      <br></br>
      <br></br>
      <br></br>
    </>)
}

export default SectionPostInHome
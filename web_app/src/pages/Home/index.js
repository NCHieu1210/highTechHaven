import { useSelector } from "react-redux";
import SlideShow from "./SlideShow"
import SectionInHome from "./SectionInHome";
import bannerLeft from "../../assets/images/banner-left.jpg";
import bannerRight from "../../assets/images/banner-right.jpg";
import SectionProducInHome from "./SectionProducInHome";
import { useEffect, useState } from "react";
import SectionPostInHome from "./SectionPostInHome";
import "./Swiper.scss";

const Home = () => {
  const [bestSales, setBestSales] = useState([]);
  const [hotDeal, setHotDeal] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const categories = useSelector((state) => state.data.categories);
  const suppliers = useSelector((state) => state.data.suppliers);
  const products = useSelector((state) => state.data.products);
  const posts = useSelector((state) => state.data.posts);

  // Lấy chiều rộng của Browser
  const [wBrowser, setwBrowser] = useState();

  const handleResize = () => {
    setwBrowser(window.innerWidth); // Thay đổi kích thước này theo nhu cầu của bạn
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sortedProductBySell = products.sort((a, b) => b.productVariants.sellNumbers - a.productVariants.sellNumbers).slice(0, 20);
    setBestSales(sortedProductBySell);// setBestSales

    const sortedProductsByDiscount = products.sort((a, b) => b.productVariants.discount - a.productVariants.discount).slice(0, 20);
    setHotDeal(sortedProductsByDiscount);// setHotDeal

    const sortedProductsByCreateDate = products.sort((a, b) => new Date(b.productStatus[0].date) - new Date(a.productStatus[0].date));
    setNewProducts(sortedProductsByCreateDate);// setNewProducts
  }, []);

  return (
    <>
      <div className="home">
        <div className="home__slide">
          <SlideShow></SlideShow>
        </div>
        <br></br>
        <br></br>
        <br></br>

        {/* Sản phẩm bán chạy */}
        <div className="home__section">
          <h2>Sản phẩm bán chạy</h2>
          <hr></hr>
          <br></br>
          <SectionProducInHome data={bestSales} wBrowser={wBrowser}></SectionProducInHome>
        </div>
        {/* END Sản phẩm bán chạy */}

        {/* Sản phẩm giảm giá cao */}
        <div className="home__section">
          <h2>Ưu đãi hấp dẫn</h2>
          <hr></hr>
          <br></br>
          <SectionProducInHome data={hotDeal} wBrowser={wBrowser}></SectionProducInHome>
        </div>
        {/* END Sản phẩm giảm giá cao */}

        {/* Sản phẩm mới nhập */}
        <div className="home__section">
          <h2>Sản phẩm mới</h2>
          <hr></hr>
          <br></br>
          <SectionProducInHome data={newProducts} wBrowser={wBrowser}></SectionProducInHome>
        </div>
        {/* END Sản phẩm mới nhập */}

        {/* Banner */}
        <div className="home__banner">
          <img src={bannerLeft} alt="Banner Left" />
          {wBrowser > 480 && <img src={bannerRight} alt="Banner Right" />}
        </div>
        <br></br>
        <br></br>
        <br></br>
        {/* END Banner */}

        {/* Danh mục sản phẩm */}
        <div className="home__section">
          <h2>Danh mục sản phẩm</h2>
          <hr></hr>
          <br></br>
          <SectionInHome categories={categories} slug="categories" wBrowser={wBrowser} ></SectionInHome>
        </div>
        {/* END Danh mục sản phẩm */}

        {/* Hãng sản xuất */}
        <div className="home__section">
          <h2>Hãng sản xuất</h2>
          <hr></hr>
          <br></br>
          <SectionInHome suppliers={suppliers} slug="suppliers" wBrowser={wBrowser} ></SectionInHome>
        </div>
        {/*END Hãng sản xuất */}

        {wBrowser <= 480 &&
          <div className="home__banner">
            <img src={bannerRight} alt="Banner Right" />

          </div>
        }
        <br></br>
        <br></br>
        <br></br>

        <div className="home__section">
          <h2>Bài viết nổi bật</h2>
          <hr></hr>
          <br></br>
          <SectionPostInHome posts={posts} wBrowser={wBrowser}></SectionPostInHome>
        </div>
        {/*END Hãng sản xuất */}

      </div>
    </>
  );
}

export default Home;
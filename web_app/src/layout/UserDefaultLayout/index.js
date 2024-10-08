import { FloatButton, Layout, Skeleton, Spin, theme } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { setBlogsData, setCategoriesData, setPostsData, setProductsData, setSuppliersData } from "../../actions/dataAction";
import { getAllCategoriesService } from "../../services/categoriesService";
import { getAllProductsService } from "../../services/productsService";
import { getAllSupplierService } from "../../services/suppliersService";
import { getAllPostsService } from "../../services/postsService";
import { getAllBlogsService } from "../../services/blogsService";
import FooterDefault from "./FooterDefault";
import HeaderDefault from "./HeaderDefault";
import "./UserDefaultLayout.scss";

const UserLayoutDefault = () => {
  const [skeleton, setSkeleton] = useState(false);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.data.categories);
  const suppliers = useSelector((state) => state.data.suppliers);
  const products = useSelector((state) => state.data.products);
  const posts = useSelector((state) => state.data.posts);
  const location = useLocation();

  const [isTablet, setIsTablet] = useState(false);
  const handleResize = () => {
    setIsTablet(window.innerWidth <= 1024); // Thay đổi kích thước này theo nhu cầu của bạn
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Call API get data
  useEffect(() => {
    const fetchData = async () => {
      setSkeleton(true);
      try {
        const categoriesPromise = categories.length === 0 ? getAllCategoriesService() : null;
        const suppliersPromise = suppliers.length === 0 ? getAllSupplierService() : null;
        const productsPromise = products.length === 0 ? getAllProductsService() : null;
        const blogsPromise = posts.length === 0 ? getAllBlogsService() : null;
        const postsPromise = posts.length === 0 ? getAllPostsService() : null;

        const [categoriesResponse, suppliersResponse, productsResponse, blogsResponse, postsReponse] = await Promise.all([
          categoriesPromise,
          suppliersPromise,
          productsPromise,
          blogsPromise,
          postsPromise,
        ]);

        if (categoriesResponse && categoriesResponse.success) {
          dispatch(setCategoriesData(categoriesResponse.data.reverse()));
        } else if (categoriesResponse) {
          console.log(categoriesResponse.message);
        }

        if (suppliersResponse && suppliersResponse.success) {
          dispatch(setSuppliersData(suppliersResponse.data.reverse()));
        } else if (suppliersResponse) {
          console.log(suppliersResponse.message);
        }

        if (productsResponse && productsResponse.success) {
          dispatch(setProductsData(productsResponse.data.reverse()));
        } else if (productsResponse) {
          console.log(productsResponse.message);
        }

        if (blogsResponse && blogsResponse.success) {
          dispatch(setBlogsData(blogsResponse.data.reverse()));
        } else if (blogsResponse) {
          console.log(blogsResponse.message);
        }

        if (postsReponse && postsReponse.success) {
          dispatch(setPostsData(postsReponse.data.reverse()));
        } else if (postsReponse) {
          console.log(postsReponse.message);
        }

      } catch (error) {
        console.log("error", error.message);
      } finally {
        setSkeleton(false);
      }
    };

    fetchData();
  }, []);
  // [dispatch, categories.length, suppliers.length, products.length]);
  //END Call API get data

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="userlayout">
      <HeaderDefault />
      <Content className="userlayout__content">
        {
          skeleton ?
            (<Skeleton
              active
              style={{ height: "70vh" }}
            />) :
            (<Outlet />)
        }
      </Content>
      {
        !isTablet ?
          (
            <Footer>
              <FooterDefault loading={skeleton}></FooterDefault>
            </Footer>
          ) :
          (
            !location.pathname.includes("/user") &&
            <Footer>
              <FooterDefault loading={skeleton}></FooterDefault>
            </Footer>
          )
      }
      <FloatButton.BackTop visibilityHeight={0} />
    </Layout >

  );
}

export default UserLayoutDefault
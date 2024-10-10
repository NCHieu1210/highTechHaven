import { useDispatch, useSelector } from "react-redux";
import CardProduct from "../Products/CardProduct";
import { Col, Pagination, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { getRangeCategoriesAndSuppliersService } from "../../services/productsService";
import { arrangeProducts, categoriesIsSelect, suppliersIsSelect } from "../../actions/optionsProductAction";
import { useParams } from "react-router-dom";
import NoData from "../../components/NoData";
import { loading } from "../../actions/loadingAction";

const Categories = () => {
  const productsStore = useSelector((state) => state.data.products);
  const categoriesStore = useSelector((state) => state.data.categories);
  const optionsProduct = useSelector(state => state.optionsProduct.values);
  const getSuppliersIsSelect = useSelector((state) => state.optionsProduct.suppliersID);
  const isLoading = useSelector((state) => state.loading);
  const [productsIsArrange, setProductsIsArrange] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoriesByParams, setCategoriesByParams] = useState([]);
  const dispath = useDispatch();
  const params = useParams();

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
    dispath(arrangeProducts(0));
    dispath(categoriesIsSelect([]));
    dispath(suppliersIsSelect([]));

    let getCategories = categoriesStore.find(item => item.slug === params.slug);
    if (getCategories === undefined) {
      categoriesStore.map(item => {
        if (item.subCategories.find(subCategory => subCategory.slug === params.slug)) {
          getCategories = item.subCategories.find(subCategory => subCategory.slug === params.slug);
        }
      })
      setCategoriesByParams(getCategories);
    }
    else if (getCategories && getCategories.subCategories.length > 0) {
      getCategories = [...getCategories.subCategories];
      setCategoriesByParams(getCategories);
    }
    else {
      setCategoriesByParams(getCategories);
    }

    const productsInCategory = [];
    if (Array.isArray(getCategories)) {
      getCategories.map(category => {
        productsInCategory.push(...productsStore.filter(item => item.category === category.name));
      })
    }
    else {
      productsInCategory.push(...productsStore.filter(item => item.category === getCategories.name));
    }
    setProducts(productsInCategory)

  }, [params])

  useEffect(() => {
    let arrayCategoryID = [];
    if (Array.isArray(categoriesByParams)) {
      categoriesByParams.map(category => {
        arrayCategoryID.push(category.id);
      })
    }
    else {
      arrayCategoryID.push(categoriesByParams.id);
    }
    if (getSuppliersIsSelect.length > 0) {
      const getCategorire = async () => {
        const response = await getRangeCategoriesAndSuppliersService(arrayCategoryID, getSuppliersIsSelect);
        setProducts(response.data);
      };
      getCategorire();
    }
  }, [getSuppliersIsSelect])

  useEffect(() => {
    if (Array.isArray(products)) {
      let sortedProducts = [...products];
      switch (optionsProduct) {
        case "0": setProductsIsArrange(sortedProducts);
          break;
        case "1": setProductsIsArrange(sortedProducts.sort((a, b) => b.productVariants.price - a.productVariants.price));
          break;
        case "2": setProductsIsArrange(sortedProducts.sort((a, b) => a.productVariants.price - b.productVariants.price));
          break;
        case "3": setProductsIsArrange(sortedProducts.sort((a, b) => b.productVariants.discount - a.productVariants.discount));
          break;
        default: setProductsIsArrange(sortedProducts);
          break;
      }
    }
    if (isLoading) {
      dispath(loading(false))
    }
  }, [optionsProduct, products])

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const paginatedProducts = productsIsArrange.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  //END Pagination


  return (
    <>
      {products ? (
        <>
          <Row gutter={wBrowser > 1024 ? [50, 50] : [20, 50]}>
            {paginatedProducts && paginatedProducts.map((product) =>
              <Col xs={12} sm={8} xl={6} key={product.id}>
                <CardProduct product={product} />
              </Col>
            )}
          </Row>
          <br></br>
          <Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '7px' }}
            current={currentPage}
            pageSize={pageSize}
            total={products.length}
            onChange={handlePageChange}
          />
          <br></br>
        </>
      ) : (
        <NoData content={"Không có sản phẩm phù hợp"} ></NoData>
      )
      }
    </>
  );
}

export default Categories;
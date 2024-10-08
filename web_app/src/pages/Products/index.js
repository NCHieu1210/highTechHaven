import { useDispatch, useSelector } from "react-redux";
import CardProduct from "./CardProduct";
import { Col, Pagination, Row } from "antd";
import { useEffect, useState } from "react";
import { getByRangeCategoriesService, getProductByRangeCategoriesService, getProductByRangeSuppliersService, getRangeCategoriesAndSuppliersService } from "../../services/productsService";
import { arrangeProducts, categoriesIsSelect, suppliersIsSelect } from "../../actions/optionsProductAction";

const Product = () => {
  const productsStore = useSelector((state) => state.data.products);
  const optionsProduct = useSelector(state => state.optionsProduct.values);
  const getCategoriesIsSelect = useSelector((state) => state.optionsProduct.categoriesID);
  const getSuppliersIsSelect = useSelector((state) => state.optionsProduct.suppliersID);
  const [productsIsArrange, setProductsIsArrange] = useState([]);
  const [products, setProducts] = useState(productsStore);
  const dispath = useDispatch();

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
  }, [])

  useEffect(() => {
    if (getCategoriesIsSelect.length > 0 && getSuppliersIsSelect.length === 0) {
      const getCategorire = async () => {
        const response = await getProductByRangeCategoriesService(getCategoriesIsSelect);
        setProducts(response.data);
      };
      getCategorire();
    }
    else if (getCategoriesIsSelect.length === 0 && getSuppliersIsSelect.length > 0) {
      const geSuppliers = async () => {
        const response = await getProductByRangeSuppliersService(getSuppliersIsSelect);
        setProducts(response.data);
      };
      geSuppliers();
    }
    else if (getCategoriesIsSelect.length > 0 && getSuppliersIsSelect.length > 0) {
      const getCategorire = async () => {
        const response = await getRangeCategoriesAndSuppliersService(getCategoriesIsSelect, getSuppliersIsSelect);
        setProducts(response.data);
      };
      getCategorire();
    }
  }, [getCategoriesIsSelect, getSuppliersIsSelect])


  useEffect(() => {
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
  }, [optionsProduct, products])

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  const paginatedProducts = productsIsArrange.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  //END Pagination

  return (
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
  );
}

export default Product
import { useDispatch, useSelector } from "react-redux";
import CardProduct from "../Products/CardProduct";
import { Col, Pagination, Row } from "antd";
import { useEffect, useState } from "react";
import { getRangeCategoriesAndSuppliersService } from "../../services/productsService";
import { arrangeProducts, categoriesIsSelect, suppliersIsSelect } from "../../actions/optionsProductAction";
import { useParams } from "react-router-dom";
import { loading } from "../../actions/loadingAction";

const Suppliers = () => {
  const productsStore = useSelector((state) => state.data.products);
  const suppliersStore = useSelector((state) => state.data.suppliers);
  const optionsProduct = useSelector(state => state.optionsProduct.values);
  const getCategoriesIsSelect = useSelector((state) => state.optionsProduct.categoriesID);
  const isLoading = useSelector((state) => state.loading);
  const [productsIsArrange, setProductsIsArrange] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliersByParams, setSuppliersByParams] = useState([]);
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

    const getsuppliersByParams = suppliersStore.find(item => item.slug === params.slug);
    setSuppliersByParams(getsuppliersByParams);

    const productsInSupplier = productsStore.filter(item => item.supplier === getsuppliersByParams.name);
    setProducts(productsInSupplier)
  }, [params])

  useEffect(() => {
    let arraySupplierID = [];
    arraySupplierID.push(suppliersByParams.id);
    if (getCategoriesIsSelect.length > 0) {
      const getCategorire = async () => {
        const response = await getRangeCategoriesAndSuppliersService(getCategoriesIsSelect, arraySupplierID);
        setProducts(response.data);
      };
      getCategorire();
    }
  }, [getCategoriesIsSelect])


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
      {products && (
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
      )}
    </>
  );
}

export default Suppliers;
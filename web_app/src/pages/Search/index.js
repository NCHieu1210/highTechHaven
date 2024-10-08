import { useParams } from "react-router-dom";
import { arrangeProducts, categoriesIsSelect, suppliersIsSelect } from "../../actions/optionsProductAction";
import { Col, Pagination, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardProduct from "../Products/CardProduct";
import { getProductBySearchService } from "../../services/productsService";

const Search = () => {
  const productsStore = useSelector((state) => state.data.products);
  const optionsProduct = useSelector(state => state.optionsProduct.values);
  const [productsIsArrange, setProductsIsArrange] = useState([]);
  const [products, setProducts] = useState(productsStore);
  const dispath = useDispatch();
  const { search } = useParams();

  useEffect(() => {
    dispath(arrangeProducts(0));
    dispath(categoriesIsSelect([]));
    dispath(suppliersIsSelect([]));
  }, [])

  useEffect(() => {
    const getProductBySearch = async () => {
      const response = await getProductBySearchService(search);
      console.log(response)
      setProducts(response.data);
    };
    getProductBySearch();
  }, [search])

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
  };
  const paginatedProducts = productsIsArrange.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  //END Pagination

  return (
    <>
      {products.length === 0 ?
        (<h2 className="text-center">Không tìm thấy sản phẩm</h2>) :
        (<h2 className="text-center">Có {products.length} sản phẩm trùng khớp</h2>)}
      <br></br>
      <br></br>
      <Row gutter={[50, 50]}>
        {paginatedProducts && paginatedProducts.map((product) =>
          <Col span={6} key={product.id}>
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
  )
}

export default Search;
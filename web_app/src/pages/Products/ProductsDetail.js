import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getVariantBySlugService } from "../../services/productsService";
import { Button, Card, Col, Image, Rate, Row, Space, Spin } from "antd";
import { getPathImage } from "../../helpers/getPathImage";
import parse from 'html-react-parser';
import "./Products.scss";
import { ArrowLeftOutlined, CaretDownOutlined, CaretUpOutlined, CheckOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { AddToCart } from "../../helpers/cartHelper";
import { useDispatch, useSelector } from "react-redux";
import Comments from "../../components/Comments";
import Reviews from "../../components/Reviews";
import NotLoggedInYet from "../../components/NotLoggedInYet";
import ProductImage from "./ProductImage";
import { getReviewsByProductOptionIdService } from "../../services/reviewService";
import { reRender } from "../../actions/reRender";
import { generateQueryParams } from "../../helpers/generateQueryParams";

const ProductsDetail = () => {
  const param = useParams();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    pruduct: null,
    reviews: null,
    optionIsSelected: null,
    colorIsSelected: null,
  });
  const product = data.pruduct;
  const reviews = data.reviews;

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
    const getReviews = async (optionID) => {
      try {
        const response = await getReviewsByProductOptionIdService(optionID);
        if (response.success) {
          return response.data;
        }
        else {
          return null;
        }
      }
      catch (error) {
        console.log("erorr", error.message);
      }
    }

    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await getVariantBySlugService(param.slug + location.search);
        if (response.success) {
          const dataRes = response.data;
          const findOptionIsSelected = dataRes.productOptions.find(pO => pO.id == dataRes.productVariant.optionID);
          const findColorIsSelected = findOptionIsSelected.variants.find(pC => pC.color === dataRes.productVariant.color);
          const review = await getReviews(dataRes.productVariant.optionID);
          setData({
            pruduct: dataRes,
            reviews: review,
            optionIsSelected: findOptionIsSelected,
            colorIsSelected: findColorIsSelected,
          });

        }
        else {
          console.log("erorr:", response.message);
        }
      }
      catch (error) {
        console.log("erorr", error.message);
      }
      finally {
        setLoading(false);

      }
    }
    getProducts();
    if (isReRender) {
      dispatch(reRender(false));
    }

  }, [param, location, isReRender]);

  const formatCurrency = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const discountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  }


  const handleAddToCart = (productVariantID) => {
    AddToCart(productVariantID, 1, dispatch, setShowModalLogin);
  }

  const handleShowContent = () => {
    setShowContent(!showContent);
  }
  const handleChangeVariant = (option, color) => {
    //Lấy tên của option
    const optionName = option.option;
    //Tạo đường dẫn
    let link = `/products/${param.slug}?`;
    //Kiểm tra xem option có màu được truyền vào hay không, nếu không thì lấy màu đầu tiên để tạo link
    var checkColorIsValid = option.variants.find(pO => pO.color === color);
    if (checkColorIsValid) {
      link += generateQueryParams({ option: optionName, color: color });
    }
    else {
      const setColor = option.variants[0].color;
      link += generateQueryParams({ option: optionName, color: setColor });
    }
    navigate(link);
  }


  return (
    <>
      <Spin spinning={loading}>
        {product ? (
          <div className="productDtails">
            <div className="productDtails__left">
              <div className="productDtails__left__title">
                <div>
                  <div className="productDtails__left__title--info">
                    <Button onClick={() => navigate(-1)} shape="circle">
                      <ArrowLeftOutlined />
                    </Button>
                    <div>
                      <h1>{product.name}&nbsp;{product.productVariant.option !== "No Option" && product.productVariant.option}&nbsp;Màu {product.productVariant.color}</h1>
                      {wBrowser < 480 && <Image src={getPathImage(product.productVariant.thumbnail)} alt="Ảnh sản phẩm"></Image>}
                      <br></br>
                      <Space>
                        <Space.Compact direction="vertical">
                          <strong>- Loại sản phẩm</strong>
                          <strong>- Hãng sản xuất</strong>
                          <strong>- Số lượng bán</strong>
                          <strong>- Đánh giá sản phẩm</strong>
                          <strong>- Xếp hạng đánh giá</strong>
                        </Space.Compact>
                        <Space.Compact direction="vertical">
                          <span>:&nbsp;{product.category}</span>
                          <span>:&nbsp;{product.supplier}</span>
                          <span>:&nbsp;{product.productVariant.sellNumbers} sản phẩm</span>
                          {
                            reviews ?
                              (<>
                                <span>:&nbsp;{reviews.reviewsNumber} lượt đánh giá </span>
                                {reviews.totalRating && (
                                  <span>&nbsp;<Rate allowHalf disabled defaultValue={reviews.totalRating} /></span>
                                )}
                              </>) :
                              (<>
                                <span>:&nbsp;0 lượt đánh giá</span>
                                <span>:&nbsp;Chưa có xếp hạng </span>
                              </>)
                          }
                        </Space.Compact>
                      </Space>
                    </div>
                  </div>
                  {wBrowser > 480 && <Image src={getPathImage(product.productVariant.thumbnail)}></Image>}
                </div>
                <br></br>
                <ProductImage images={product.productImages}></ProductImage>
              </div>
              <div className={wBrowser < 1024 ? "productDtails__right" : "productDtails__right productDtails__hide"}>
                <Card
                  title="TÙY CHỌN"
                  bordered={true}
                  className="productDtails__right--variant"
                >
                  <Row gutter={[15, 15]}>
                    {(product.productVariant.option !== "No Option") && product.productOptions.map((item, index) => (
                      <Col span={12} key={index} >
                        <Button
                          onClick={() => handleChangeVariant(item, data.colorIsSelected.color)}
                          className={data.optionIsSelected.id === item.id && "isSelected"}>
                          {data.optionIsSelected.id == item.id && (
                            <div className="isSelectedIcon" >
                              <CheckOutlined />
                            </div>
                          )}
                          <span style={{ whiteSpace: "pre-wrap" }}>{item.option}</span>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                  {product.productVariant.option !== "No Option" &&
                    (<>
                      <br></br>
                      <hr></hr>
                      <br></br>
                    </>)}
                  <Row gutter={[15, 15]} className="variant__color">
                    {data.optionIsSelected && data.optionIsSelected.variants.map((item, index) =>
                      <Col span={12} key={index} >
                        <Button
                          className={data.colorIsSelected.id === item.id && "isSelected"}
                          onClick={() => handleChangeVariant(data.optionIsSelected, item.color)}
                        >
                          {data.colorIsSelected.id == item.id && (
                            <div className="isSelectedIcon" >
                              <CheckOutlined />
                            </div>
                          )}
                          <Space size={20}>
                            <img src={getPathImage(item.thumbnail)} alt={item.color} ></img>
                            <div className="variant__color--text">
                              <p>{item.color}</p>
                              <span>{formatCurrency(discountedPrice(item.price, item.discount))}</span>
                            </div>
                          </Space>
                        </Button>
                      </Col>
                    )}
                  </Row>

                </Card>
                <br></br>
                <Card
                  title="MUA NGAY"
                  bordered={true}
                >
                  {product.productVariant.discount > 0 ?
                    (<>
                      <p>Hiện đang giảm <strong> {product.productVariant.discount}%</strong></p>
                      <p>Giá gốc: <span style={{ textDecoration: 'line-through' }}>{formatCurrency(product.productVariant.price)}</span></p>
                      <strong>Chỉ còn:
                        <strong style={{ color: 'red' }}>
                          &nbsp;
                          {formatCurrency(discountedPrice(product.productVariant.price, product.productVariant.discount))}
                        </strong>
                      </strong>
                    </>) :
                    (<>
                      <strong>Giá bán:
                        <strong style={{ color: 'red' }}>
                          &nbsp;
                          {formatCurrency(product.productVariant.price)}
                        </strong>
                      </strong>
                    </>)}
                  <br></br>
                  <br></br>
                  <hr></hr>
                  <br></br>
                  <div className="productDtails__right--btn">
                    <NotLoggedInYet
                      content="thêm sản phẩm vào giỏ hàng."
                      showModalLogin={showModalLogin}
                      setShowModalLogin={setShowModalLogin}>
                    </NotLoggedInYet>
                    <Button onClick={() => handleAddToCart(product.productVariant.id)} > <ShoppingCartOutlined />Thêm vào giỏ hàng</Button>
                  </div>
                </Card>
              </div>

              <div className="productDtails__left--content">
                <h2>MÔ TẢ SẢN PHẨM</h2>
                <div className={showContent ? "content" : "content content__hide"}>{parse(product.content)}</div>
                <div className="checkShow">
                  {showContent ?
                    (<Button onClick={handleShowContent}><CaretUpOutlined /> Ẩn bớt</Button>) :
                    (<Button onClick={handleShowContent}><CaretDownOutlined /> Xem thêm</Button>)
                  }
                </div>
              </div>
              <br></br>
              <br></br>
              <Reviews
                reviews={reviews}
                productOptionId={product.productVariant.optionID}
                productOptionName={`${product.name} ${product.productVariant.option !== "No Option" ? product.productVariant.option : ""}`}

              >
              </Reviews>
              <br></br>
              <br></br>
              <Comments productId={product.id}></Comments>
            </div>
            <div className={wBrowser > 1024 ? "productDtails__right" : "productDtails__right productDtails__hide"}>
              <Card
                title="TÙY CHỌN"
                bordered={true}
                className="productDtails__right--variant"
              >
                <Row gutter={[15, 15]}>
                  {(product.productVariant.option !== "No Option") && product.productOptions.map((item, index) => (
                    <Col span={12} key={index} >
                      <Button
                        onClick={() => handleChangeVariant(item, data.colorIsSelected.color)}
                        className={data.optionIsSelected.id === item.id && "isSelected"}>
                        {data.optionIsSelected.id == item.id && (
                          <div className="isSelectedIcon" >
                            <CheckOutlined />
                          </div>
                        )}
                        <span style={{ whiteSpace: "pre-wrap" }}>{item.option}</span>
                      </Button>
                    </Col>
                  ))}
                </Row>
                {product.productVariant.option !== "No Option" &&
                  (<>
                    <br></br>
                    <hr></hr>
                    <br></br>
                  </>)}
                <Row gutter={[15, 15]} className="variant__color">
                  {data.optionIsSelected && data.optionIsSelected.variants.map((item, index) =>
                    <Col span={12} key={index} >
                      <Button
                        className={data.colorIsSelected.id === item.id && "isSelected"}
                        onClick={() => handleChangeVariant(data.optionIsSelected, item.color)}
                      >
                        {data.colorIsSelected.id == item.id && (
                          <div className="isSelectedIcon" >
                            <CheckOutlined />
                          </div>
                        )}
                        <Space size={20}>
                          <img src={getPathImage(item.thumbnail)} alt={item.color} ></img>
                          <div className="variant__color--text">
                            <p>{item.color}</p>
                            <span>{formatCurrency(discountedPrice(item.price, item.discount))}</span>
                          </div>
                        </Space>
                      </Button>
                    </Col>
                  )}
                </Row>

              </Card>
              <br></br>
              <Card
                title="MUA NGAY"
                bordered={true}
              >
                {product.productVariant.discount > 0 ?
                  (<>
                    <p>Hiện đang giảm <strong> {product.productVariant.discount}%</strong></p>
                    <p>Giá gốc: <span style={{ textDecoration: 'line-through' }}>{formatCurrency(product.productVariant.price)}</span></p>
                    <strong>Chỉ còn:
                      <strong style={{ color: 'red' }}>
                        &nbsp;
                        {formatCurrency(discountedPrice(product.productVariant.price, product.productVariant.discount))}
                      </strong>
                    </strong>
                  </>) :
                  (<>
                    <strong>Giá bán:
                      <strong style={{ color: 'red' }}>
                        &nbsp;
                        {formatCurrency(product.productVariant.price)}
                      </strong>
                    </strong>
                  </>)}
                <br></br>
                <br></br>
                <hr></hr>
                <br></br>
                <div className="productDtails__right--btn">
                  <NotLoggedInYet
                    content="thêm sản phẩm vào giỏ hàng."
                    showModalLogin={showModalLogin}
                    setShowModalLogin={setShowModalLogin}>
                  </NotLoggedInYet>
                  <Button onClick={() => handleAddToCart(product.productVariant.id)} > <ShoppingCartOutlined />Thêm vào giỏ hàng</Button>
                </div>
              </Card>
            </div>
          </div >
        ) : (<div style={{ minHeight: "70vh" }}></div>)}
      </Spin>
    </>
  )
}

export default ProductsDetail;
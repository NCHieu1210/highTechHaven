import { HeartOutlined, HeartTwoTone, InfoCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Rate, Space, Spin, Tooltip } from "antd";
import { NavLink } from "react-router-dom";
import { getPathImage } from "../../helpers/getPathImage";
import Meta from "antd/es/card/Meta";
import { AddToCart } from "../../helpers/cartHelper";
import { useDispatch } from "react-redux";
import './CardProduct.scss';
import 'animate.css'
import { AddToFavorites } from "../../helpers/favoritesHelper";
import { useEffect, useState } from "react";
import Icon from "@ant-design/icons/lib/components/Icon";
import { CheckFavouritesByTokenService } from "../../services/favouritesService";
import NotLoggedInYet from "../../components/NotLoggedInYet";
import { checkLoggedIn } from "../../helpers/checkLoggedIn";
import { generateQueryParams } from "../../helpers/generateQueryParams";

//Heart Icon
const HeartSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <title>heart icon</title>
    <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
  </svg>
);
const HeartIcon = (props) => <Icon component={HeartSvg} {...props} />;
//END Heart Icon

const CardProduct = (props) => {
  const { product } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  const [isMobile, setwIsMobile] = useState();
  const handleResize = () => {
    setwIsMobile(window.innerWidth <= 1024); // Thay đổi kích thước này theo nhu cầu của bạn
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkFavoriteAsync = async () => {
      try {
        const response = await CheckFavouritesByTokenService(product.productVariants.optionID);
        if (response.success) {
          setIsFavorite(true)
        }
        else {
          setIsFavorite(false)
        }
      }
      catch (error) {
        setIsFavorite(false)
        // console.log("Error: ", error.message);
      }
      finally {
        setLoading(false);
      }
    }
    if (checkLoggedIn()) {
      checkFavoriteAsync();
    }
    else {
      setLoading(false);
    }
    if (reRender) {
      setReRender(false)
    }
  }, [props, reRender])

  const discountedPrice = (product) => {
    return product.productVariants.price - (product.productVariants.price * product.productVariants.discount / 100);
  }
  const formatCurrency = (price) => {
    // return `${new Intl.NumberFormat('vi-VN').format(price)} đ`;
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  const handleAddToCart = async (productVariantID) => {
    setLoading(true);
    await AddToCart(productVariantID, 1, dispatch, setShowModalLogin);
    setLoading(false);
  }

  const handleAddToFavorites = async (optionID) => {
    setLoading(true);
    await AddToFavorites(optionID, dispatch, setShowModalLogin);
    setReRender(true);
  }
  const checkDiscount = (product) => {
    return product.discount === 0 ? "ant-ribbon__none" : "";
  }

  return (
    <>
      <div className="cardProduct">
        <NotLoggedInYet
          content={content}
          showModalLogin={showModalLogin}
          setShowModalLogin={setShowModalLogin}>
        </NotLoggedInYet>

        {product.productVariants.discount > 0 ?
          (
            <Badge.Ribbon text={`Giảm ${product.productVariants.discount}%`} color="red" placement="start" className={checkDiscount(product)}>
              <Spin spinning={loading}>
                <Card
                  hoverable
                  style={{ width: "auto", backgroundColor: "#F5F5F5", boxShadow: " 7px 7px 10px rgba(0, 0, 0, 0.1)" }}
                  cover={<img alt={product.name} src={getPathImage(product.productVariants.thumbnail)} />}
                >
                  <div className="productHover">
                    <div></div>
                    <div>
                      <br></br>
                      <Tooltip title={!isMobile && "Chi tiết"} placement="left" color="#f88d00">
                        <NavLink
                          to={`/products/${product.slug}?${generateQueryParams({
                            option: product.productVariants.option,
                            color: product.productVariants.color,
                          })}`}
                          onClick={() => window.scrollTo(0, 0)}>
                          <Button><InfoCircleOutlined /></Button>
                        </NavLink>
                      </Tooltip>
                      <br></br>
                      <Tooltip title={!isMobile && "Yêu thích"} placement="left" color="#f88d00">
                        <Button onClick={() => { handleAddToFavorites(product.productVariants.optionID); setContent("thêm sản phẩm vào danh sách yêu thích."); }}>
                          <HeartOutlined />
                        </Button>
                      </Tooltip>
                      <br></br>
                      <Tooltip title={!isMobile && "Thêm giỏ hàng"} placement="left" color="#f88d00" >
                        <Button onClick={() => { handleAddToCart(product.productVariants.id); setContent("thêm sản phẩm vào giỏ hàng."); }} >
                          <ShoppingCartOutlined />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                  <Meta title={<span>{product.name}  {product.productVariants.option}</span>} description={
                    <>
                      <p>Giá gốc: <span style={{ textDecoration: 'line-through' }}>{formatCurrency(product.productVariants.price)}</span></p>
                      <strong>Chỉ còn: <strong style={{ color: 'red' }}>{formatCurrency(discountedPrice(product))}</strong></strong>
                      {product.totalRating ?
                        (<div className="cardProduct__rating">
                          <Rate allowHalf disabled defaultValue={product.totalRating} />
                          {isFavorite === true ?
                            (<HeartIcon
                              style={{
                                color: 'red',
                              }}
                            />) :
                            (<HeartTwoTone twoToneColor="red" />)
                          }
                        </div>) :
                        (<div className="cardProduct__rating">
                          <div></div>
                          {isFavorite === true ?
                            (<HeartIcon
                              style={{
                                color: 'red',
                              }}
                            />) :
                            (<HeartTwoTone twoToneColor="red" />)
                          }
                        </div>)
                      }
                    </>
                  } />
                </Card>
              </Spin>
            </Badge.Ribbon>
          ) :
          (<Spin spinning={loading}>
            <Card
              hoverable
              style={{ width: "auto", backgroundColor: "#F5F5F5", boxShadow: " 7px 7px 10px rgba(0, 0, 0, 0.1)" }}
              cover={<img alt={product.name} src={getPathImage(product.productVariants.thumbnail)} />}
            >
              <div className="productHover">
                <div></div>
                <div>
                  <Tooltip title="Chi tiết" placement="left" color="#f88d00">
                    <NavLink
                      to={`/products/${product.slug}?${generateQueryParams({
                        option: product.productVariants.option,
                        color: product.productVariants.color,
                      })}`}>
                      <Button><InfoCircleOutlined /></Button>
                    </NavLink>
                  </Tooltip>
                  <br></br>
                  <Tooltip title="Yêu thích" placement="left" color="#f88d00">
                    <Button onClick={() => { handleAddToFavorites(product.productVariants.optionID); setContent("thêm sản phẩm vào danh sách yêu thích."); }}>
                      <HeartOutlined />
                    </Button>
                  </Tooltip>
                  <br></br>
                  <Tooltip title="Thêm giỏ hàng" placement="left" color="#f88d00">
                    <Button onClick={() => { handleAddToCart(product.productVariants.id); setContent("thêm sản phẩm vào giỏ hàng."); }} >
                      <ShoppingCartOutlined />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <Meta title={<span>{product.name}  {product.productVariants.option}</span>} description={
                <>
                  <p>Giá bán: <strong style={{ color: 'red' }}>{formatCurrency(product.productVariants.price)}</strong></p>
                  <br></br>
                  {product.totalRating ?
                    (<div className="cardProduct__rating">
                      <Rate allowHalf disabled defaultValue={product.totalRating} />
                      {isFavorite === true ?
                        (<HeartIcon
                          style={{
                            color: 'red',
                          }}
                        />) :
                        (<HeartTwoTone twoToneColor="red" />)
                      }
                    </div>) :
                    (<div className="cardProduct__rating">
                      <div></div>
                      {isFavorite === true ?
                        (<HeartIcon
                          style={{
                            color: 'red',
                          }}
                        />) :
                        (<HeartTwoTone twoToneColor="red" />)
                      }
                    </div>)
                  }
                </>
              } />
            </Card>
          </Spin>
          )}
      </div >
    </>
  );
}

export default CardProduct;
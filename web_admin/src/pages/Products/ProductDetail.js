import { InfoCircleOutlined } from "@ant-design/icons"
import { Button, Card, Col, Image, Modal, Rate, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { getProductsBySlugService } from "../../services/productsService";
import { getPathImage } from "../../helpers/getPathImage";
import "./Products.scss"

const ProductDetail = (props) => {
  const { productSlug } = props
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseAPI, setResponseAPI] = useState();


  //Call API
  useEffect(() => {
    setLoading(true);

    const getProductsBySlug = async () => {
      try {
        const response = await getProductsBySlugService(productSlug);
        setResponseAPI(response.data);
      } catch (error) {
        console.log(error);
      };
    }

    getProductsBySlug();
    setLoading(false);

  }, [props])
  //END Call API

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} className="btn__detail"
        shape="circle"
        icon={<InfoCircleOutlined />}>
      </Button>
      {responseAPI &&
        <Modal
          title={`SẢN PHẨM: ${responseAPI.name}`}
          className="productDetail"
          centered
          width={1555}
          loading={loading}
          onOk={handleOk}
          onCancel={handleCancel}
          open={isModalOpen}
          footer={null}
        >
          <div className="model__content">
            <hr></hr>
            <br></br>
            <h2>I. THÔNG TIN SẢN PHẨM</h2>
            <Card title="" bordered={false}>
              <Space offset={100} className="productDetail__info" >
                <Space.Compact >
                  <Space.Compact direction="vertical">
                    <strong>Loại sản phẩm</strong>
                    <strong>Hãng sản xuất</strong>
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <p>: {responseAPI.category}</p>
                    <p>: {responseAPI.supplier}</p>
                  </Space.Compact>
                </Space.Compact>
                <Space.Compact >
                  <Space.Compact direction="vertical">
                    <strong>Tổng tồn kho</strong>
                    <strong>Tổng lượt bán</strong>
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <p>: {new Intl.NumberFormat('vi-VN').format(responseAPI.totalStock)}</p>
                    <p>: {responseAPI.totalSellNumbers}</p>
                  </Space.Compact>
                </Space.Compact>
                <Space.Compact >
                  <Space.Compact direction="vertical">
                    <strong>Tổng xếp hạng</strong>
                    <strong>Trạng thái</strong>
                  </Space.Compact>
                  <Space.Compact direction="vertical">
                    <p>: {responseAPI.totalRating ?
                      (<Rate disabled defaultValue={responseAPI.totalRating} />) :
                      (<em>Chưa có đánh giá</em>)}
                    </p>
                    <p>: {responseAPI.status ? "Mở bán" : "Đang ẩn"}</p>
                  </Space.Compact>
                </Space.Compact>
              </Space>
            </Card>
            <br></br>
            <h2>II. HÌNH ẢNH LIÊN QUAN</h2>
            <br></br>
            <div className="productDetail__image">
              {responseAPI.productImages.map((image, index) =>
                (<Image key={index} src={getPathImage(image.image)} alt={`Hình ảnh liên quan ${index}`} />)
              )}
            </div>
            <br></br>
            <br></br>
            <h2>III. BIẾN THỂ SẢN PHẨM</h2>
            <br></br>
            <Row gutter={[45, 45]}>
              {responseAPI.productOptions.map(item => (
                <Col span={12} key={item.id}>
                  <Card
                    bordered={false} className="productDetail__card"
                    title={
                      <div className="productDetail__card--title">
                        <div>Cấu hình: {item.option === "No Option" ? "Không có cấu hình" : item.option}</div>
                        {item.rating ?
                          (<Rate disabled defaultValue={item.rating} />) :
                          (<em>Chưa có đánh giá</em>)
                        }

                      </div>}
                  >
                    {item.productVariants.map((detail, subIndex) => (
                      <Space key={subIndex} className="productDetail__variant">
                        <Space.Compact>
                          <Image src={getPathImage(detail.thumbnail)} alt={detail.color} />
                        </Space.Compact>
                        <Space.Compact direction="vertical">
                          <div>
                            <strong>Mã sản phẩm: <em>{detail.sku}</em></strong>
                            <br></br>
                          </div>
                          <div className="productDetail__variant--info">
                            <Space.Compact >
                              <Space.Compact direction="vertical">
                                <p>Màu sắc</p>
                                <p>Tồn kho</p>
                                <p>Trạng thái</p>
                              </Space.Compact>
                              <Space.Compact direction="vertical">
                                <em>: {detail.color}</em>
                                <em>: {new Intl.NumberFormat('vi-VN').format(detail.stock)}</em>
                                <em>: {responseAPI.status ? "Mở bán" : "Đang ẩn"}</em>
                              </Space.Compact>
                            </Space.Compact>
                            <Space.Compact>
                              <Space.Compact direction="vertical">
                                <p>Giá tiền</p>
                                <p>Giảm giá</p>
                                <p>Lượt bán</p>
                              </Space.Compact>
                              <Space.Compact direction="vertical">
                                <em>: {new Intl.NumberFormat('vi-VN').format(detail.price)} VNĐ</em>
                                <em>: {detail.discount}%</em>
                                <em>: {detail.sellNumbers}</em>
                              </Space.Compact>
                            </Space.Compact>
                          </div>
                        </Space.Compact>


                      </Space >
                    ))}
                  </Card >
                </Col>
              ))
              }
            </Row>
            <br></br>
          </div>
        </Modal >
      }

    </>
  )
}

export default ProductDetail
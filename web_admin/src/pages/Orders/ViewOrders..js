import { InfoCircleOutlined } from "@ant-design/icons"
import { Button, Image, Modal, Space, Table, Timeline } from "antd"
import { useState } from "react";
import "./Orders.scss"
import moment from "moment";
import { getProductsByVariantIdService } from "../../services/productsService";
import { getPathImage } from "../../helpers/getPathImage";
import "../../baseSCSS/App.scss";
import { totalOrderValue, totalProducts } from "../../helpers/calculateOrderDetails ";

const ViewOrders = (props) => {
  const { orders } = props;
  const [cancelled, setCancelled] = useState();
  const [unconfirmed, setUnconfirmed] = useState();
  const [processing, setProcessing] = useState();
  const [delivering, setDelivering] = useState();
  const [completed, setCompleted] = useState();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getDateUpdate = () => {
    orders.orderUpdates.forEach(item => {
      switch (item.updateName) {
        case "Cancelled":
          setCancelled(item.updateTime);
          break;
        case "Unconfirmed":
          setUnconfirmed(item.updateTime);
          break;
        case "Processing":
          setProcessing(item.updateTime);
          break;
        case "Delivering":
          setDelivering(item.updateTime);
          break;
        case "Completed":
          setCompleted(item.updateTime);
          break;
        default:
          break;
      }
    });
  }

  const getProdutcs = async (orderDetail) => {
    for (const item of orderDetail) {
      try {
        const response = await getProductsByVariantIdService(item.productVariantID);
        setProducts((prevProducts) => [...prevProducts, response.data]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const showModal = () => {
    setProducts([]);
    getDateUpdate();
    getProdutcs(orders.orderDetails);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const getQuantityProduct = (productVariantID) => {
    let quantity = orders.orderDetails.find((item) => item.productVariantID === productVariantID).quantity;
    return quantity;
  }

  //Table
  const dataProducts = []
  products && products.map(item =>
    dataProducts.push({
      key: item.id,
      sku: item.productVariants.sku,
      thumbnail: <Image src={getPathImage(item.productVariants.thumbnail)} style={{ width: "77px" }}></Image>,
      name: `${item.name}  ${item.productVariants.option !== "No Option" && item.productVariants.option} - ${item.productVariants.color}`,
      price: item.productVariants.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      quantity: `${getQuantityProduct(item.productVariants.id)} sản phẩm`,
      stock: `${item.productVariants.stock} sản phẩm`
    })
  )

  const columns = [
    {
      title: '',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
    }
  ];
  //END Table

  return (
    <>
      <Button className="btn__detail" shape="circle" onClick={showModal} style={{ marginRight: "10px" }}>
        <InfoCircleOutlined />
      </Button>

      {orders &&
        (
          <Modal
            title={`ĐƠN HÀNG - ${orders.code}`}
            width={1200}
            centered
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div className="viewOrder">
              <div className="adminOrder">
                <hr></hr>
                <br></br>
                <Timeline
                  mode='left'
                  items={[
                    {
                      label: unconfirmed ? moment.utc(unconfirmed).utcOffset('+07:00').format('HH:mm:ss - DD/MM/YYYY') : <em style={{ color: 'gray' }}>chưa cập nhập</em>,
                      children: 'Đơn hàng được tạo',
                    },
                    {
                      label: processing ? moment.utc(processing).utcOffset('+07:00').format('HH:mm:ss - DD/MM/YYYY') : <em style={{ color: 'gray' }}>chưa cập nhập</em>,

                      children: 'Đơn hàng đã được xác nhận',
                    },
                    {
                      label: delivering ? moment.utc(delivering).utcOffset('+07:00').format('HH:mm:ss - DD/MM/YYYY') : <em style={{ color: 'gray' }}>chưa cập nhập</em>,
                      children: 'Đơn hàng bắt đầu giao',
                    },
                    {
                      label: completed ? moment.utc(completed).utcOffset('+07:00').format('HH:mm:ss - DD/MM/YYYY') : <em style={{ color: 'gray' }}>chưa cập nhập</em>,
                      children: 'Đơn hàng đã hoàn thành',
                    },
                    {
                      label: cancelled ? moment.utc(cancelled).utcOffset('+07:00').format('HH:mm:ss - DD/MM/YYYY') : <em style={{ color: 'gray' }}>chưa cập nhập</em>,
                      children: 'Đơn hàng bị hủy',
                    }
                  ]}
                />
                <hr></hr>
                <br></br>
                <div className="orders__content" >
                  <Space style={{ width: '100%' }} size={50}>
                    <div>
                      <img src={getPathImage(orders.userAvatar)}></img>
                    </div>
                    <div>
                      <Space direction="vertical" size={12}>
                        <Space>
                          <p>Tài khoản đặt hàng</p>
                          <em>: {orders.userName}</em>
                        </Space>
                        <Space>
                          <p>Người nhận hàng</p>
                          <em>: {orders.receiver}</em>
                        </Space>
                        <Space style={{ alignItems: 'flex-start' }}>
                          <p>Địa chỉ nhận hàng</p>
                          <em>: {orders.deliveryAddress}</em>
                        </Space>
                        <Space>
                          <p>SĐT nhận hàng</p>
                          <em >: {orders.deliveryPhone}</em>
                        </Space>
                        <Space>
                          <p>Thanh toán bằng</p>
                          <em>: {orders.paymentMethods === 1 ? "Thanh toán qua VnPay" : "Thanh toán bằng tiền mặt"}</em>
                        </Space>
                        <Space>
                          <p>Tổng tiền đơn hàng</p>
                          <em>: {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalOrderValue(orders))}</em>
                        </Space>
                        <Space>
                          <p>Tổng sản phẩm</p>
                          <em>: {totalProducts(orders)} sản phẩm</em>
                        </Space>
                      </Space>
                    </div>
                  </Space>
                </div>
              </div>
              <br></br>
              <br></br>
              <Table dataSource={dataProducts} columns={columns} pagination={{ position: ['bottomCenter'] }} />
            </div >
          </Modal >
        )
      }
    </>
  )
}

export default ViewOrders;
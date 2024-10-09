import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { lastUpdateName, totalOrderValue, totalProducts } from "../../helpers/calculateOrderDetails ";
import { getPathImage } from "../../helpers/getPathImage";
import ChangeOrdersUpdate from "../../components/ChangeOrdersUpdate";
import { Button, Spin, Table } from "antd";
import ViewOrder from "./ViewOrder";
import { getOrdersHistoryByTokenService } from "../../services/ordersService";
import { getProductByVariantIdService } from "../../services/productsService";
import NoData from "../../components/NoData";
import { NavLink } from "react-router-dom";

const OrderHistory = () => {
  const [ordersList, setOrdersList] = useState();
  const [loading, setLoading] = useState(false);

  const [wBrowser, setwBrowser] = useState(false);
  const handleResize = () => {
    setwBrowser(window.innerWidth); // Thay đổi kích thước này theo nhu cầu của bạn
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getProductName = (id, listProducts) => {
    const product = listProducts.find(product => product.productVariants.id === id);
    if (product) {
      return `${product.name} 
      ${product.productVariants.option !== "No Option" ? product.productVariants.option : ""} 
      - Màu ${product.productVariants.color}`;
    }
  }

  useEffect(() => {
    setLoading(true);
    const getProduct = async (variantId) => {
      try {
        const response = await getProductByVariantIdService(variantId);
        if (response.success) {
          return response.data;
        }
        else {
          console.error(response.message);
        }
      }
      catch (ex) {
        console.error(ex.message);
      }
    }

    const setDataColumns = (listProducts, ordersIsComplete) => {
      const data = [];
      ordersIsComplete.map((item) => {
        data.push({
          key: item.id,
          code: item.code,
          orderDate: moment.utc(item.orderDate).utcOffset('+07:00').format('HH:mm  DD/MM '),
          receiver: item.receiver,
          deliveryPhone: item.deliveryPhone,
          deliveryAddress: item.deliveryAddress === "Nhận tại cửa hàng" ? <strong style={{ color: "red" }}>{item.deliveryAddress}</strong> : item.deliveryAddress,
          buyAtTheStore: item.buyAtTheStore,
          paymentMethods: item.paymentMethods,
          status: item.status,
          userID: item.userID,
          userName: item.user.userName,
          userName: item.user.avatar ?
            (<div className="contain__Account">
              <img style={{ width: 30, height: 30 }} src={getPathImage(item.user.avatar)} alt="index.user.userName" />{item.user.userName}
            </div>)
            : item.user.userName,
          totalOrderValue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalOrderValue(item)),
          totalProducts: `${totalProducts(item)} sản phẩm`,
          lastUpdateName: <ChangeOrdersUpdate updateName={lastUpdateName(item)}></ChangeOrdersUpdate>,
          orderUpdates: item.orderUpdates,
          orderDetails: item.orderDetails,
          user: item.user,
          productName: item.orderDetails.map((subItem, index) => (
            <p key={index}>
              - {getProductName(subItem.productVariantID, listProducts)}
            </p>
          ))
        })
      })
      setOrdersList(data);
    }

    const getOrders = async () => {
      try {
        const response = await getOrdersHistoryByTokenService();
        if (response.success) {
          const orders = response.data.reverse();

          //Lấy sản phẩm theo variantId
          let listProducts = [];
          const promises = orders.map(order => {
            return Promise.all(order.orderDetails.map(async (detail) => {
              const data = await getProduct(detail.productVariantID);
              return data; // Trả về dữ liệu để Promise.all có thể lấy
            }));
          });

          // Chờ tất cả các Promise hoàn thành
          const results = await Promise.all(promises);

          // Kết hợp tất cả các sản phẩm vào một mảng
          listProducts = results.flat(); // Sử dụng flat() để làm phẳng mảng

          setDataColumns(listProducts, orders);
          //END Lấy sản phẩm theo variantId

        }
        else {
          console.log("Error:", response.message);
        }
      }
      catch (error) {
        console.log("Error:", error.message);
      }
      finally {
        setLoading(false);
      }
    }
    getOrders()
  }, [])

  const columns = [
    {
      title: 'Người nhận',
      dataIndex: 'receiver',
      width: wBrowser > 1024 ? '200px' : wBrowser > 480 ? '150px' : '10px',
      fixed: 'left',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      width: '555px',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalOrderValue',
    },
    {
      title: 'Thời gian',
      dataIndex: 'orderDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'lastUpdateName',
    },
    {
      title: ' ',
      dataIndex: 'function',
      fixed: 'right',
      render: (_, record) => {
        return (
          <div>
            {/* <UpdateCategories category={record} options={responseAPI} ></UpdateCategories>
            <DeleteCategories categoriesId={record.key}></DeleteCategories> */}
            <ViewOrder orders={record}></ViewOrder>
          </div>
        );
      }
    },
  ];

  return (
    <>
      <Spin spinning={loading}>
        <div className="userDetails">
          <h1>LỊCH SỬ MUA HÀNG</h1>
          <br></br>
          {ordersList && (ordersList.length > 0 ?
            (<>
              <Table columns={columns} dataSource={ordersList} size='large'
                pagination={{ position: ['bottomCenter'], pageSize: 7 }}
                scroll={{
                  x: 'max-content',
                  y: window.innerHeight - 420
                }} />
            </>) :
            (<>
              <div style={{ textAlign: "center" }}>
                <NoData content="Bạn hiện chưa có lịch sử mua hàng"></NoData>
                <NavLink to="/products"><Button className="btn__two">Mua hàng ngay</Button></NavLink>
              </div>
            </>)
          )}
        </div>
      </Spin>
    </>
  )
}

export default OrderHistory;
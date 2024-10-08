import moment from "moment";
import { getPathImage } from "../../helpers/getPathImage";
import ChangeOrdersUpdate from "../../components/ChangeOrdersUpdate";
import { lastUpdateName, totalOrderValue, totalProducts } from "../../helpers/calculateOrderDetails ";

export const builDataTable = (orders, expression) => {
  const data = [];
  orders.map((item) => {
    if (expression(item)) { // Gọi hàm expression với item
      data.push({
        key: item.id,
        code: item.code,
        orderDate: moment.utc(item.orderUpdates.find(oU => oU.status === true).updateTime).utcOffset('+07:00').format('HH:mm - DD/MM '),
        receiver: item.receiver,
        deliveryPhone: item.deliveryPhone,
        deliveryAddress: item.deliveryAddress === "Nhận tại cửa hàng" ? <strong style={{ color: "red" }}>{item.deliveryAddress}</strong> : item.deliveryAddress,
        buyAtTheStore: item.buyAtTheStore,
        paymentMethods: item.paymentMethods,
        status: item.status,
        user: item.user.avatar ?
          (<div className="contain__Account">
            <img style={{ width: 35, height: 35, borderRadius: 50 }} src={getPathImage(item.user.avatar)} alt={item.user.userName} />{item.user.userName}
          </div>)
          : item.user.userName,
        userName: item.user.userName,
        totalOrderValue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalOrderValue(item)),
        totalProducts: `${totalProducts(item)} sản phẩm`,
        lastUpdateName: <ChangeOrdersUpdate updateName={lastUpdateName(item)}></ChangeOrdersUpdate>,
        orderUpdates: item.orderUpdates,
        orderDetails: item.orderDetails,
        userAvatar: item.user.avatar
      });
    }
  });
  return data;
};
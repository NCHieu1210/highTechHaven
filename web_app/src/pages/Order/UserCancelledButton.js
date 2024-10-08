import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm } from "antd";
import { cancelOrdersService } from "../../services/ordersService";

const UserCancelledButton = (props) => {
  const { orderID } = props
  const cancelOrders = async () => {
    try {
      const response = await cancelOrdersService(orderID);
      if (response.success) {
        message.success(`Hủy đơn hàng thành công!`)
      }
      else {
        console.log("erorr:", response.message);
      }
    }
    catch (error) {
      console.log("erorr", error.message);
    }
  }
  const confirm = (e) => {
    cancelOrders();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };
  return (
    <>
      <Popconfirm
        title="Hủy đơn hàng!"
        description="Bạn có chắc chắn muốn hủy?"
        onConfirm={confirm}
        onCancel={cancel}
        icon={
          <QuestionCircleOutlined
            style={{
              color: 'red',
            }}
          />
        }
      >
        <Button type="primary" danger >
          <CloseOutlined /> Hủy đơn hàng
        </Button>
      </Popconfirm>
    </>
  )
}
export default UserCancelledButton;
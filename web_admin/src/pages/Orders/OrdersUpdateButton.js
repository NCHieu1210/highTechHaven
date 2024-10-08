import { Button, message, Popconfirm } from "antd";
import { changeOrdersUpdateService } from "../../services/ordersService";
import { CheckOutlined, QuestionCircleOutlined } from "@ant-design/icons";


const OrdersUpdateButton = (props) => {
  const { orderID, name } = props

  const changeUpdateOrder = async () => {
    try {
      const response = await changeOrdersUpdateService(orderID);
      if (response.success) {
        message.success(`${name} thành công!`)
      }
      else {
        message.error(response.message);
        console.log("erorr:", response.message);
      }
    }
    catch (error) {
      console.log("erorr", error.message);
    }
  }

  const confirm = (e) => {
    changeUpdateOrder();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Popconfirm
        title={`${name}!`}
        description={`Bạn có muốn ${name.toLowerCase()}?`}
        onConfirm={confirm}
        onCancel={cancel}
        icon={
          <QuestionCircleOutlined
            style={{
              color: 'green',
            }}
          />
        }
      >
        <Button type="primary" style={{ backgroundColor: "#13C2C2" }} shape="circle">
          <CheckOutlined color="white" />
        </Button>
      </Popconfirm>
    </>
  )
};

export default OrdersUpdateButton;

import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { Button, message, Popconfirm, Spin } from "antd"
import { useDispatch } from "react-redux";
import { deleteDeliveryAddressService } from "../../services/deliveryAddressServer";
import { useState } from "react";
import { reRender } from "../../actions/reRender";

const DeleteDeliveryAddress = (props) => {
  const { deliveryAddressID } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const deleteDeliveryAddress = async () => {
    setLoading(true);
    try {
      const response = await deleteDeliveryAddressService(deliveryAddressID);
      if (response.success) {
        message.success("Đã xóa Thành Công!");
        dispatch(reRender(true));
      } else {
        message.error("Xóa thất bại!");
      }
      setLoading(false);
    } catch (error) {
      message.error("Xóa thất bại!");
      console.log(error);
      setLoading(false);
    }
  }

  const confirm = (e) => {
    deleteDeliveryAddress();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Xóa địa chỉ!"
        description="Bạn có chắc chắn muốn xóa?"
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
        <Button
          danger
          shape="circle"
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </>
  )
}

export default DeleteDeliveryAddress;
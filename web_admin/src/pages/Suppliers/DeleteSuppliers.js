import { useDispatch } from "react-redux";
import { deleteSupplierService } from "../../services/suppliersService";
import { Button, message, Popconfirm, Spin } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { reRender } from "../../actions/reRender";
import { useState } from "react";

const DeleteSupplier = (props) => {
  const { idSupplier } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const deleteSupplier = async () => {
    setLoading(true);

    try {
      const response = await deleteSupplierService(idSupplier);
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
    deleteSupplier();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Xóa nhà sản xuất!"
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
export default DeleteSupplier
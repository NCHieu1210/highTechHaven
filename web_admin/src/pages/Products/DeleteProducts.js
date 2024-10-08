import { useDispatch } from "react-redux";
import { deleteProductService } from "../../services/productsService";
import { Button, Popconfirm, Spin, message } from "antd";
import { useState } from "react";
import { reRender } from "../../actions/reRender";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const DeleteProduct = (props) => {
  const { productId, nameProduct } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const deleteProduct = async () => {
    setLoading(true);
    try {
      const response = await deleteProductService(productId);
      if (response.success) {
        Swal.fire({
          title: "Xóa Thành công!",
          html: `Bạn đã xóa <strong>${nameProduct}</strong>. Sản phẩm bị xóa đã được chuyển vào thùng rác và sẽ bị xóa vĩnh viễn sau <strong>30 ngày</strong>!`,
          icon: "success"
        });
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
    deleteProduct();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };


  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Xóa danh mục!"
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

export default DeleteProduct;
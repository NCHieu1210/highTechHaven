import { Button, Popconfirm, Spin, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { reRender } from "../../actions/reRender";
import { QuestionCircleOutlined, UndoOutlined } from "@ant-design/icons";
import { restoreProductsService, restorePostsService } from "../../services/trashService";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const Restore = (props) => {
  const { idProduct, idPost, nameProduct } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const restoreProduct = async () => {
    setLoading(true);
    try {
      let response = "";
      if (idPost) {
        response = await restorePostsService(idPost);
      }
      else {
        response = await restoreProductsService(idProduct);
      }
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          html: `Sản phẩm <strong>${nameProduct}</strong> đã được bạn khôi phục thành công!`,
          icon: "success"
        });
        dispatch(reRender(true));
      } else {
        message.error("Khôi phục thất bại!");
      }
      setLoading(false);
    } catch (error) {
      message.error("Lỗi hệ thống, vui lòng thử lại sau!");
      console.log(error);
      setLoading(false);
    }
  }

  const confirm = (e) => {
    restoreProduct();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Khôi phục sản phẩm!"
        description="Bạn có chắc chắn muốn khôi phục lại?"
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
          shape="circle"
          icon={<UndoOutlined />}
        />
      </Popconfirm>
    </>
  )
}

export default Restore

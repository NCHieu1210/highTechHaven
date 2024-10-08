import { Button, Popconfirm, Spin, message } from "antd";
import { useDispatch } from "react-redux";
import { PermenentlyDeletedPostsService, PermenentlyDeletedProductsService } from "../../services/trashService";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { reRender } from "../../actions/reRender";

const PermenentlyDeleted = (props) => {
  const { idProduct, nameProduct, idPost } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const permenentlyDeletedProducts = async () => {
    setLoading(true);
    try {
      let response = ""
      if (idPost) {
        response = await PermenentlyDeletedPostsService(idPost);
      }
      else {
        response = await PermenentlyDeletedProductsService(idProduct);
      }
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          html: `<strong>${nameProduct}</strong> đã được xóa vĩnh viễn thành thành công!`,
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
    permenentlyDeletedProducts();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Xóa vĩnh viễn!"
        description="Bạn có chắc chắn muốn xóa, sau khi xóa sẽ không thể khôi phục lại?"
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

export default PermenentlyDeleted;
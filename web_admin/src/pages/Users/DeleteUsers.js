import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Spin } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { reRender } from "../../actions/reRender";
import { deleteUserService } from "../../services/usersService";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const DeleteUsers = (props) => {
  const { userId, viewStyle } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const deleteUser = async () => {
    setLoading(true);

    try {
      const response = await deleteUserService(userId);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          html: `Bạn đã xóa tài khoản <strong>${response.data.userName}</strong> ra khỏi hệ thống!`,
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
    deleteUser();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };
  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Xóa tài khoản!"
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
        {viewStyle === "grid" ?
          (<DeleteOutlined />) :
          (<Button
            danger
            shape="circle"
            icon={<DeleteOutlined />}
          />)
        }
      </Popconfirm >
    </>
  );
}

export default DeleteUsers;
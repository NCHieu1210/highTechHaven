import { Button, message, Popconfirm, Spin } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFromFavorites } from "../../helpers/favoritesHelper";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const DeleteFormFavorites = (props) => {
  const { productOptionID } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const confirm = (e) => {
    setLoading(true);
    deleteFromFavorites(productOptionID, dispatch);
    setLoading(false);
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };
  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Xóa sản phẩm!"
        description="Bạn có chắc chắn muốn xóa sản phẩm ra khỏi danh sách yêu thích?"
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

export default DeleteFormFavorites;

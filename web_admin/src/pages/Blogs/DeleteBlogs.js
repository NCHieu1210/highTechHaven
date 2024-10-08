import { useDispatch } from "react-redux";
import { Button, message, Popconfirm, Spin } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { reRender } from "../../actions/reRender";
import { useState } from "react";
import { deleteBlogService } from "../../services/blogsService";

const DeleteBlogs = (props) => {
  const { blogsId } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const deleteBlogs = async () => {
    setLoading(true);
    try {
      const response = await deleteBlogService(blogsId);
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
    deleteBlogs();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Xóa chuyên mục!"
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
export default DeleteBlogs;
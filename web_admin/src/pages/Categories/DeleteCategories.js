import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Spin, message } from "antd";
import { useDispatch } from "react-redux";
import { deleteCategoryService } from "../../services/categoriesService";
import { reRender } from "../../actions/reRender";
import { useState } from "react";

const DeleteCategories = (props) => {
  const { categoriesId } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const deleteCategory = async () => {
    setLoading(true);
    try {
      const response = await deleteCategoryService(categoriesId);
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
    deleteCategory();
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
  );
}

export default DeleteCategories
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Spin, message } from "antd";
import { useDispatch } from "react-redux";
import { reRender } from "../../actions/reRender";
import { useState } from "react";
import { deleteReviewsService } from "../../services/reviewsService";

const DeleteReviews = (props) => {
  const { reviewsID } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const deleteReview = async () => {
    setLoading(true);
    try {
      const response = await deleteReviewsService(reviewsID);
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
    deleteReview();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title="Xóa đánh giá!"
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

export default DeleteReviews
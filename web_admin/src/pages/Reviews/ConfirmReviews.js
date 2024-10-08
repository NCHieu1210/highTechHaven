import { CheckOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm, Spin } from "antd";
import { useState } from "react";
import { reRender } from "../../actions/reRender";
import { useDispatch } from "react-redux";
import { confirmReviewsService } from "../../services/reviewsService";

const ConfirmReviews = (props) => {
  const { reviewsID } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const confirmReviews = async () => {
    setLoading(true);
    try {
      const response = await confirmReviewsService(reviewsID);
      if (response.success) {
        message.success("Phê duyệt thành công");
        dispatch(reRender(true));
      } else {
        message.error("Phê duyệt thất bại!");
      }
      setLoading(false);
    } catch (error) {
      message.error("Phê duyệt thất bại!");
      console.log(error);
      setLoading(false);
    }
  }
  const confirm = (e) => {
    confirmReviews();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };
  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Popconfirm
        title={`Phê duyệt!`}
        description={`Bạn có muốn duyệt đánh giá này?`}
        onConfirm={confirm}
        onCancel={cancel}
        icon={
          <QuestionCircleOutlined
            style={{
              color: 'green',
            }}
          />
        }
      >
        <Button type="primary" style={{ backgroundColor: "#13C2C2" }} shape="circle">
          <CheckOutlined color="white" />
        </Button>
      </Popconfirm>
    </>
  );
}

export default ConfirmReviews
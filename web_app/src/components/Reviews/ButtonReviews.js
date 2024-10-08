import { Button, Form, message, Modal, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReviewsService, getAllReviewService } from "../../services/reviewService";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { setReviewsData } from "../../actions/dataAction";
import NotLoggedInYet from "../NotLoggedInYet";
import { reRender } from "../../actions/reRender";

const ButtonReviews = (props) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { productOptionId, productOptionName } = props;
  const [showModalLogin, setShowModalLogin] = useState(false);
  const dispatch = useDispatch();


  const desc = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = async (values) => {
    if (values.rating === undefined) {
      values.rating = 5;
    }
    const data = {
      content: values.content,
      rating: values.rating,
      productOptionID: productOptionId
    }
    try {
      const response = await createReviewsService(data);
      if (response === 401) {
        console.log("Error: Unauthorized");
        setShowModalLogin(true);
      }
      else if (response.success) {
        Swal.fire({
          title: "Cảm ơn bạn đã đánh giá sản phẩm!",
          html: `Hệ thống sẽ kiểm duyện đánh giá của bạn về <strong>${productOptionName}</strong> và đăng lên nếu phù hợp với quy định đánh giá.`,
          icon: "success"
        });
        form.resetFields();
        const reviewsRes = await getAllReviewService();
        if (reviewsRes) {
          dispatch(reRender(true));
        }
        setOpen(false);
      }
      else {
        if (response.message === "The product has been reviewed") {
          message.error("Mỗi sản phẩm bạn chỉ có thể đánh giá một lần");
        }
        else {
          message.error("Đánh giá thất bại");
          console.log("Erorr", response.message);
        }
      }
    }
    catch (error) {
      console.log("Erorr", error.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div className="reviews__Form">
        <NotLoggedInYet
          content="đánh giá sản phẩm."
          showModalLogin={showModalLogin}
          setShowModalLogin={setShowModalLogin}>
        </NotLoggedInYet>

        <Button onClick={showModal} >Đánh giá ngay</Button>
        <Modal
          centered
          open={open}
          title="Đánh giá & nhận xét"
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            name="createRviews" labelCol={{ span: 24, }} wrapperCol={{ span: 24, }}
            style={{ maxWidth: 600, }}
            initialValues={{ remember: true, }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >
            <br></br>
            <div className="reviews__Form--rating">
              <div><h2>Sản phẩm: {productOptionName}</h2></div>
              <Form.Item label="" name="rating">
                <Rate defaultValue={5} tooltips={desc} allowClear={false} />
              </Form.Item>
            </div>
            {/* Nhập nội dung  */}
            <Form.Item label="Nội dung" name="content"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng không bỏ trống',
                },
              ]}
            ><TextArea rows={5} />
            </Form.Item>
            {/* END  Nhập nội dung */}

            <br></br>
            {/* Button submit */}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <div className='reviews__Form--btn'>
                <Button type="primary" htmlType="submit">
                  Gửi đánh giá
                </Button>
              </div>
            </Form.Item>
            {/* END Button submit */}
          </Form>

        </Modal>
      </div>
    </>
  );
};

export default ButtonReviews;
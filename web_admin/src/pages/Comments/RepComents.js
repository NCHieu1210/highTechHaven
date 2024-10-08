import { CommentOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Spin } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createCommentsService } from "../../services/commentsService";
import { reRender } from "../../actions/reRender";

const RepComents = (props) => {
  const { id, postId, productId } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
    // form.resetFields();
    // setFileList([]);
  };

  //Form
  //Call API
  const onFinish = async (values) => {
    setLoading(true);
    const data = new FormData();
    data.append("content", values["content"]);
    data.append("ParentCommentID", id);
    productId && data.append("ProductID", productId);
    postId && data.append("PostID", postId);
    try {
      const response = await createCommentsService(data);
      if (response.success) {
        form.resetFields();
        dispatch(reRender(true));
        message.success("Phản hồi thành công!")
        setOpen(false);
      }
      else {
        message.error("Lỗi hệ thống, vui lòng thử lại sau!")
        console.log("Error:", response);
      }
    }
    catch (ex) {
      console.log("Error:", ex.message);
    }
    finally {
      setLoading(false);
    }
  };
  //END Tạo form data

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  //END Form

  return (
    <>
      <Button onClick={showModal} shape="circle">
        <CommentOutlined />
      </Button>
      <Modal
        centered
        open={open}
        title="Phản hồi nhanh"
        onCancel={handleCancel}
        footer={null}
      >
        <Spin spinning={loading}>
          {/* Form nhập dữ liệu */}
          <Form
            form={form}
            name="repComment"
            style={{ maxWidth: 600, }}
            initialValues={{ remember: true, }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >
            {/* Nhập content  */}
            <Form.Item label="" name="content"
              rules={[
                {
                  required: true,
                  message: 'Không được bỏ trống',
                },
              ]}
            ><Input.TextArea rows={5} />
            </Form.Item>
            {/* END Nhập content */}

            {/* Button submit */}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" onClick={showModal} className='admin__button admin__button--add' htmlType="submit">
                <SendOutlined /> Phản hồi
              </Button>
            </Form.Item>
            {/* END Button submit */}

          </Form>
          {/* END Form nhập dữ liệu */}
        </Spin>

      </Modal >
    </>
  );
}
export default RepComents;
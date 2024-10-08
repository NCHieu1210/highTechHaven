import { Button, Form, Input, message, Modal, Spin } from "antd";
import { useState } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss'
import { forgotPasswordService } from "../../../services/usersService";
import "./Login.scss";

const ForgotPassword = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    // setFileList([]);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await forgotPasswordService(values.email);
      if (response.success) {
        form.resetFields();
        setOpen(false); // Đóng modal sau khi gửi thành công
        Swal.fire({
          title: "Thành công!",
          html: `Chúng tôi đã gửi cho bạn đường dẫn để đổi mật khẩu tới emai <strong>${values.email}</strong>. Vui lòng kiểm tra email của bạn!`,
          icon: "success"
        });
      } else {
        if (response === 400) {
          message.error("Email chưa được đăng ký, vui lòng kiểm tra lại thông tin!");
        }
        else {
          message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau");
        }
      }
    }
    catch (error) {
      console.log('Error:', error);
      message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau");
    }
    finally {
      setLoading(false);
    }
  };
  //END Tạo form data

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Button onClick={showModal} className="forgot">
        Quên mật khẩu?
      </Button>
      <Modal
        centered
        open={open}
        title="Lấy lại mật khẩu"
        onCancel={handleCancel}
        footer={null}
      >
        <Spin spinning={loading} fullscreen></Spin>
        <Form
          form={form}
          name="forgotPassword" labelCol={{ span: 24, }} wrapperCol={{ span: 24, }}
          style={{ maxWidth: 700, }}
          initialValues={{ remember: true, }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size='large'
          className="forgot__form"
        >
          {/* Nhập email */}
          <Form.Item label="Nhập Email bạn đã dùng để đăng ký" name="email"
            rules={[
              {
                required: true,
                message: 'Vui lòng không bỏ trống!',
              }, {
                required: true,
                message: 'Không được để trống!',
                type: 'email', message: 'Địa chi email không hợp lệ!',
              },
            ]}
          ><Input size="large" />
          </Form.Item>
          {/* END email cũ */}

          <br></br>
          {/* Button submit */}
          <Form.Item className='forgot__form--button'>
            <Button type="primary" className='btn__forgot' htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
          {/* END Button submit */}

        </Form>
      </Modal >
    </>
  )
}
export default ForgotPassword;
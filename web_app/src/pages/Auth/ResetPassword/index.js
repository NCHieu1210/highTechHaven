import { Button, Form, Input, message, Space, Tooltip } from "antd";
import loginImage from '../../../assets/images/loginLogo.png';
import validatePassword from '../../../helpers/checkPassword';
import { LockOutlined, MailOutlined, SignatureOutlined } from "@ant-design/icons";
import "./Resert.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss'
import { loginWithGoogleService, resertPasswordService } from '../../../services/usersService';
import googleLogo from '../../../assets/images/google.png';


const ResetPassword = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [location]);

  const validateConfirmPassword = (_, value) => {
    if (value && form.getFieldValue('newPassword') !== value) {
      return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
    }
    return Promise.resolve();
  };

  const handleLoginWithGoogle = async () => {
    const res = await loginWithGoogleService();
    console.log(res)
    window.location.href = res.data;
  }

  const onFinish = async (values) => {
    try {
      const required = {
        email: values.email,
        token: token,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      };
      const response = await resertPasswordService(required);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          text: "Chúc mừng bạn đã đổi mật khẩu thành công, vui lòng đăng nhập để tiếp tục!",
          icon: "success"
        });
        form.resetFields(); // Xóa dữ liệu cũ sau khi gửi thành công
        navigate("/login");
      }
      else {
        message.error("Thay đổi thất bại");
        console.error('Error:', response);
      }
    }
    catch (error) {
      console.log('Error:', error);
      message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau.");
    }
  };
  //END Call api

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <div className="resetPassword">
        <div>
          <h1>LẤY LẠI MẬT KHẨU</h1>
          <br></br>
          <hr></hr>
          <br></br>
        </div>
        <div className="resetPassword__form">
          {/* Form đăng nhập */}
          <Form
            form={form}
            name="resert-password-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
          >
            <div className="resetPassword__form--img">
              <img src={loginImage} alt="login"></img>
            </div>
            <br></br>
            <Tooltip title="Nhập email" placement="left" color="cyan">
              <Form.Item
                name="email"
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
              >
                <Input
                  size="large"
                  prefix={< MailOutlined className="site-form-item-icon" />}
                  placeholder="Nhập email của bạn"
                />
              </Form.Item>
            </Tooltip>
            {/* Ô nhập MK mới */}
            <Tooltip title="Mật khẩu mới" placement="left" color="cyan">
              <Form.Item
                name="newPassword"
                rules={[{ validator: validatePassword }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Mật khẩu mới"
                />
              </Form.Item>
            </Tooltip>

            {/* Ô nhập lại mk mới */}
            <Tooltip title="Nhập lại mật khẩu" placement="left" color="cyan">
              <Form.Item
                name="confirmNewPassword"
                rules={[
                  { validator: validateConfirmPassword }
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </Form.Item>
            </Tooltip>

            <br></br>
            <div className="resetPassword__btn">
              {/* Button đăng nhập */}
              <Form.Item>
                {/* <Spin spinning={spinning}> */}
                <Button htmlType="submit" className="login-form-button">
                  <SignatureOutlined /> Đổi mật khẩu
                </Button>
                {/* </Spin> */}
              </Form.Item>
            </div>
          </Form>
          {/* END Form đăng nhập */}
          <br></br>

        </div >

        <br></br>
        <div className="resetPassword__or">
          <hr></hr>
          <p>Hoặc</p>
          <hr></hr>
        </div>

        <br></br>
        <br></br>
        <div className="login__google" >
          <Button className="login__google--button" onClick={handleLoginWithGoogle}>
            <Space>
              <img src={googleLogo} alt="Đăng nhập bằng google" />
              <span> Đăng nhập bằng Google</span>
            </Space>
          </Button>
        </div>
      </div >
      <br></br>
      <br></br>
      <br></br>
    </>
  );
};

export default ResetPassword;
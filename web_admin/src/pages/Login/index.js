import React, { useState } from 'react';
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Tooltip, Spin, notification, Divider } from 'antd';
import validatePassword from "../../helpers/checkPassword";
import * as Cookies from "../../helpers/cookies";
import { useNavigate } from "react-router-dom";
import { Swal } from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss'
import "./Login.scss"
import 'animate.css';
import { loginService } from '../../services/usersService';
import loginLogoSquare from "../../assets/images/loginLogoSquare.png";

const Login = () => {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  window.scrollTo(0, 0);
  const onFinish = async (values) => {
    try {
      setSpinning(true);
      const usernasme = values.username;
      const password = values.password;
      const respone = await loginService(usernasme, password);
      setSpinning(false);
      if (respone.success) {
        notification.success({
          message: 'Đăng nhập thành công',
          description: 'Bạn đã đăng nhập thành công!',
        });
        Cookies.setCookie("hthTokenAdm", respone.data, 1);
        navigate("/admin");
      } else {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: 'Tài khoản hoặc mật khẩu không chính xác!',
        });
      }
    }
    catch (error) {
      notification.error({
        message: 'Đã xảy ra lỗi',
        description: 'Có lỗi xảy ra trong quá trình đăng nhập!',
      });
    }
    finally {
      setSpinning(false);
    }

  };

  return (
    <>
      <div className="login">
        <div className='login__container'>
          <img src={loginLogoSquare} alt="Đăng nhập"></img>
          {/* Form đăng nhập */}
          <div className="login__container--form">
            <Divider
              style={{
                borderColor: '#f88d00',
              }}
            >
              <h1>ĐĂNG NHẬP</h1>
            </Divider>
            <h1></h1>
            <br></br>
            <Spin spinning={spinning}>
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
              >
                {/* Ô nhập UserName */}
                <Form.Item
                  name="username"
                  size="large"
                  rules={[
                    { required: true, message: 'Tên đăng nhập không để trống!', size: { fontSize: '12px' } },
                    { type: 'email', message: 'Địa chi email không hợp lệ!', style: { fontSize: '20px' } }
                  ]}
                >

                  <Input
                    size="large"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Tên đăng nhập hoặc Gmail" />
                </Form.Item>

                <br></br>

                {/* Ô nhập mật khẩu */}
                <Form.Item
                  name="password"
                  rules={[{ validator: validatePassword }]}
                >

                  <Input.Password
                    size="large"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Mật khẩu"
                  />
                </Form.Item>

                <br></br>
                {/* Button đăng nhập */}
                <Form.Item style={{ textAlign: 'center' }}>
                  <Button htmlType="submit" className="login-form-button">
                    <LoginOutlined />Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </div>
          {/* END Form đăng nhập */}
        </div>
      </div >
    </>
  );
}

export default Login
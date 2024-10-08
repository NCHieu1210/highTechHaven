import { loginService, loginWithGoogleService } from "../../../services/usersService";
import React, { useState } from 'react';
import { CheckOutlined, LockOutlined, LoginOutlined, SignatureOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, Row, Col, Tooltip, Spin, notification, Space } from 'antd';
import googleLogo from '../../../assets/images/google.png';
import loginImage from '../../../assets/images/loginLogo.png';
import validatePassword from "../../../helpers/checkPassword";
import * as Cookies from "../../../helpers/cookies";
import { NavLink, useNavigate } from "react-router-dom";
import { Swal } from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss'
import "./Login.scss"
import 'animate.css';
import ForgotPassword from "./ForgotPassword";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { reRender } from "../../../actions/reRender";


const Login = () => {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const dispatch = useDispatch();
  window.scrollTo(0, 0);
  const onFinish = async (values) => {
    try {
      setSpinning(true);
      const usernasme = values.username;
      const password = values.password;
      const response = await loginService(usernasme, password);

      if (response.success) {
        notification.success({
          message: 'Đăng nhập thành công',
          description: 'Bạn đã đăng nhập thành công!',
        });
        Cookies.setCookie("hthToken", response.data, 1);
        dispatch(reRender(true));
        navigate("/");
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

  const handleLoginWithGoogle = async () => {
    const res = await loginWithGoogleService();
    console.log(res)
    window.location.href = res.data;
  }

  return (
    <>
      <div className="login">
        <div>
          <h1>ĐĂNG NHẬP</h1>
          <br></br>
          <hr></hr>
          <br></br>
        </div>
        <div className="login__container">
          <Row>
            <Col span={24} xl={{ span: 11 }}
              align="bottom" >
              {/* Form đăng nhập */}
              <div className="login__container--form">
                <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}

                >
                  <img src={loginImage} alt="loginLogo"></img>

                  {/* Ô nhập UserName */}
                  <Tooltip title="Email" placement="left" color="cyan">
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
                  </Tooltip>

                  <br></br>

                  {/* Ô nhập mật khẩu */}
                  <Tooltip title="Mật khẩu" placement="left" color="cyan">
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
                  </Tooltip>

                  <br></br>

                  <div className="login__container--grButton">
                    {/* Button đăng nhập */}
                    <Form.Item className="grButton_button">
                      <Spin spinning={spinning}>
                        <Button htmlType="submit" className="login-form-button">
                          <LoginOutlined />Đăng nhập
                        </Button>
                      </Spin>
                    </Form.Item>

                    <div className="login__container--hrBT"><hr></hr></div>

                    {/* Quên quên mật khẩu */}
                    <Form.Item>
                      <ForgotPassword />
                    </Form.Item>
                  </div>
                </Form>
              </div>
              {/* END Form đăng nhập */}
            </Col>

            {/* Giới thiệu đăng ký */}
            <Col span={24} xl={{ span: 11, offset: 2 }}>
              <div className="login__container--singUpNow">
                <Card
                  style={{
                  }}
                >
                  <h2>Bạn là khách hàng mới?</h2>
                  <br></br>
                  <p style={{ opacity: '1' }}>Tạo một tài khoản với chúng tôi và bạn có thể:</p>
                  <p><CheckOutlined /> Kiểm tra nhanh hơn</p>
                  <p><CheckOutlined /> Theo dõi đơn hàng mới</p>
                  <p><CheckOutlined /> Lưu nhiều địa chỉ nhận hàng</p>
                  <p><CheckOutlined /> Và còn nhiều thứ tuyêt vời khác nữa</p>
                  <br></br>
                  <Button>
                    <NavLink to="/register" ><SignatureOutlined /><span>Đăng ký ngay</span></NavLink>
                  </Button>
                </Card>
              </div>
            </Col>
            {/*END Giới thiệu đăng ký */}
          </Row >
          <br></br>

        </div >
        <div className="login__container--or">
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
        <br></br>
      </div >
    </>
  );
}

export default Login
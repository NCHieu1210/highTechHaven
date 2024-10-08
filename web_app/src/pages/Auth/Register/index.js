import { ArrowLeftOutlined, SignatureOutlined } from '@ant-design/icons'
import './register.scss'
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space } from 'antd';
import validatePassword from '../../../helpers/checkPassword';
import { useNavigate } from 'react-router-dom';
import { registerService, loginWithGoogleService } from '../../../services/usersService';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss'
import googleLogo from '../../../assets/images/google.png';



const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  const validateConfirmPassword = (_, value) => {
    if (value && form.getFieldValue('password') !== value) {
      return Promise.reject(new Error('Mật khẩu và nhập lại mật khẩu không giống nhau!'));
    }
    return Promise.resolve();
  };

  //Call api
  const onFinish = async (values) => {
    // Tạo form data
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
    console.log(formData)
    try {
      const response = await registerService(formData);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          text: "Chúc mừng bạn đã đăng ký tài khoản thành công, vui lòng đăng nhập để tiếp tục!",
          icon: "success"
        });
        form.resetFields(); // Xóa dữ liệu cũ sau khi gửi thành công
        navigate("/login");
      }
      else {
        message.error("Email đã được đăng ký!");
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

  const handleLoginWithGooogle = async () => {
    const res = await loginWithGoogleService();
    console.log(res)
    window.location.href = res.data;
  }

  return (
    <>
      <div className="register">
        <h1>ĐĂNG KÝ</h1>
        <br></br>
        <hr></hr>
        <br></br>
        <div className='register__form'>
          {/* Form nhập dữ liệu */}
          <Form
            layout="vertical"
            form={form}
            name="register"
            initialValues={{ remember: true, }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >
            <Row gutter={30}>
              {/* Nhập họ  */}
              <Col className='colOne' xs={24} sm={12}>
                <Form.Item label="Họ của bạn" name="firstName"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống!',
                    },
                  ]}
                ><Input />
                </Form.Item>
              </Col>
              {/* END Nhập họ */}

              {/* Nhập Tên  */}
              <Col className='colTwo' xs={24} sm={12}>
                <Form.Item label="Tên của bạn" name="lastName"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống!',
                    },
                  ]}
                ><Input />
                </Form.Item>
              </Col>
              {/* END Nhập tên */}
            </Row>

            <Row gutter={30}>
              <Col className='colOne' xs={24} sm={12}>
                {/* Nhập ngày sinh  */}
                <Form.Item label="Ngày sinh" name="birthday"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống!',
                    },
                  ]}>
                  <DatePicker placeholder="Chọn ngày sinh" style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
                {/* END Nhập ngày sinh */}
              </Col>

              <Col className='colTwo' xs={24} sm={12}>
                {/* Nhập giới tính */}
                <Form.Item label="Giới tính" name="sex"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống!',
                    },
                  ]}>
                  <Select placeholder="Chọn giới tính">
                    <Select.Option value="true">Nam</Select.Option>
                    <Select.Option value="false">Nữ</Select.Option>
                  </Select>
                </Form.Item>
                {/* END Nhập giới tính */}
              </Col>
            </Row>

            <Row gutter={30}>
              {/* Nhập Email */}
              <Col className='colOne' xs={24} sm={12}>
                <Form.Item label="Email" name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống!',
                      type: 'email', message: 'Địa chi email không hợp lệ!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* END Nhập Email */}

              {/* Nhập Số điện thoại */}
              <Col className='colTwo' xs={24} sm={12}>
                <Form.Item label="Số điện thoại" name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Không được để trống!',
                      pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              {/* END nhập số điện thoại */}
            </Row>

            <Row gutter={30}>
              {/* Nhập mật khẩu */}
              <Col className='colOne' xs={24} sm={12}>
                <Form.Item label="Mật khẩu" name="password"
                  rules={[{
                    validator: validatePassword
                  }]}
                >
                  <Input.Password
                    size="large"
                    type="password"
                  />
                </Form.Item>
              </Col>
              {/* END Nhập mật khẩu */}

              {/* Nhập lại mật khẩu*/}
              <Col className='colTwo' xs={24} sm={12}>
                <Form.Item label="Nhập lại mật khẩu" name="conformPassword"
                  rules={[{
                    required: true,
                    message: 'Không được để trống!'
                  },
                  {
                    validator: validateConfirmPassword,
                  },]}
                >
                  <Input.Password
                    size="large"
                    type="password"
                  />
                </Form.Item>
              </Col>
              {/* END Nhập lại mật khẩu */}
            </Row>
            <br></br>
            {/* Button submit */}
            <Form.Item
              wrapperCol={{
                offset: 0,
                span: 24,
              }}
            >
              <div className='btn'>
                <Button type="primary" className='btn__backLogin' onClick={() => navigate('/login')}>
                  <ArrowLeftOutlined /> Đăng nhập
                </Button>
                <Button type="primary" className='btn__register' htmlType="submit">
                  <SignatureOutlined /> Đăng ký
                </Button>
              </div>
            </Form.Item>
            {/* END Button submit */}
          </Form>
          {/* END Form nhập dữ liệu */}
        </div>
        <br></br>
        <div className="login__container--or">
          <hr></hr>
          <p>Hoặc</p>
          <hr></hr>
        </div>

        <br></br>
        <br></br>
        <div className="login__google" >
          <Button className="login__google--button" onClick={handleLoginWithGooogle}>
            <Space>
              <img src={googleLogo} alt="Đăng nhập bằng google" />
              <p>Đăng nhập bằng Google</p>
            </Space>
          </Button>
        </div>
        <br></br>
      </div >
    </>
  )
}

export default Register
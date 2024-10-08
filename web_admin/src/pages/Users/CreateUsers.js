import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Drawer, Form, Input, Modal, Row, Select, Space, Spin, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import validatePassword from "../../helpers/checkPassword";
import { createUserService } from "../../services/usersService";
import { reRender } from "../../actions/reRender";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const CreateUsers = (props) => {
  const { roles } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const validateConfirmPassword = (_, value) => {
    if (value && form.getFieldValue('password') !== value) {
      return Promise.reject(new Error('Mật khẩu và nhập lại mật khẩu không giống nhau!'));
    }
    return Promise.resolve();
  };

  //Form
  //Call API
  const onFinish = async (values) => {
    // Tạo form data
    setLoading(true);
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    // console.log(formData)
    try {
      const response = await createUserService(formData);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          text: "Bạn đã thêm mới một tài khoản thành công!",
          icon: "success"
        });
        setOpen(false); // Đóng modal sau khi gửi thành công
        form.resetFields(); // Xóa dữ liệu cũ sau khi gửi thành công
        dispatch(reRender(true));
      }
      else {
        message.error("Email đã được đăng ký!");
        console.log('Error:', response);
      }
      setLoading(false);
    }
    catch (error) {
      console.log('Error:', error);
      message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau.");
      setLoading(false);
    }
  };
  //END Tạo form data
  //END Form
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer} className='admin__button admin__button--add'>
          <PlusOutlined /> Thêm mới
        </Button>
      </Space>

      <Drawer title="Thêm mới tài khoản" onClose={onClose} open={open} size="large">

        <Spin spinning={loading}>
          {/* Form nhập dữ liệu */}
          <Form
            layout="vertical"
            form={form}
            name="createProduct"
            // style={{ maxWidth: 700, }}
            initialValues={{ remember: true, }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >
            <Row gutter={30}>
              {/* Nhập họ  */}
              <Col span={12}>
                <Form.Item label="Họ" name="firstName"
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
              <Col span={12}>
                <Form.Item label="Tên" name="lastName"
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
              <Col span={12}>
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

              <Col span={12}>
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
              <Col span={12}>
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
              <Col span={12}>
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
              <Col span={12}>
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
              <Col span={12}>
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

            {/* Vai trò */}
            <Form.Item label="Vai trò" name="roles"
              rules={[
                {
                  required: true,
                  message: 'Bạn phải chọn một vai trò',
                },
              ]}>
              <Select placeholder="Chọn vai trò">
                {roles && (roles.map((role, index) => (
                  <Select.Option key={index} value={role}>
                    {role}
                  </Select.Option>
                )))
                }
              </Select>
            </Form.Item>
            {/* END  Vai trò*/}

            <br></br>

            {/* Button submit */}
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 1,
              }}
            >
              <Button type="primary" className='admin__button admin__button--add' htmlType="submit">
                <PlusOutlined /> Thêm mới
              </Button>
            </Form.Item>
            {/* END Button submit */}

          </Form>
          {/* END Form nhập dữ liệu */}
        </Spin>

      </Drawer >
    </>
  );
}
export default CreateUsers;

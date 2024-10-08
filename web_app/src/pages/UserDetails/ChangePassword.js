import { SettingOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal } from "antd";
import { useState } from "react";
import { changePaswordService } from "../../services/usersService";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss'
import { useNavigate } from "react-router-dom";
import './UserDetails.scss';

const ChangePassword = ({ isTablet }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const validateConfirmPassword = (_, value) => {
    if (value && form.getFieldValue('newPassword') !== value) {
      return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
    }
    return Promise.resolve();
  };
  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
    // form.resetFields();
    // setFileList([]);
  };

  const onFinish = async (values) => {
    //Tạo form data
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
    try {
      const response = await changePaswordService(formData);
      if (response.success) {
        setOpen(false); // Đóng modal sau khi gửi thành công
        navigate("/logout");
        Swal.fire({
          title: "Thành công!",
          text: "Chúc mừng bạn đã đổi mật khẩu thành công, vui lòng đăng nhập lại để tiếp tục!",
          icon: "success"
        });
      } else {
        message.error("Đổi mật khẩu thất bại!");
      }
    }
    catch (error) {
      console.log('Error:', error);
      message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau.");
    }
  };
  //END Tạo form data

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <div onClick={showModal}><SettingOutlined />&nbsp;{!isTablet && <span className="changePassword__text">Đổi mật khẩu</span>}</div>
      <Modal
        centered
        open={open}
        title="Đổi mật khẩu"
        onCancel={handleCancel}
        footer={null}
      >
        <br></br>
        <Form
          form={form}
          name="createSupplier"
          style={{ maxWidth: 700, }}
          initialValues={{ remember: true, }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size='large'
          className="changePassword"
        >
          {/* Nhập mk cũ  */}
          <Form.Item label="Mật khẩu cũ" name="currentPassword"
            labelCol={{ span: 7, }} wrapperCol={{ span: 17, }}
            rules={[
              {
                required: true,
                message: 'Vui lòng không bỏ trống!',
              },
            ]}
          ><Input.Password
              size="large"
              type="password"
            />
          </Form.Item>
          {/* END mk cũ */}

          {/* Nhập mk mới  */}
          <Form.Item label="Mật khẩu mới" name="newPassword"
            labelCol={{ span: 7, }} wrapperCol={{ span: 17, }}
            rules={[
              {
                required: true,
                message: 'Vui lòng không bỏ trống!',
              },
            ]}
          ><Input.Password
              size="large"
              type="password"
            />
          </Form.Item>
          {/* END mk mới */}

          {/* Nhập lại mk mới  */}
          <Form.Item label="Nhập lại mật khẩu" name="confirmNewPassword"
            labelCol={{ span: 7, }} wrapperCol={{ span: 17, }}
            rules={[
              {
                required: true,
                message: 'Vui lòng không bỏ trống!',
              },
              {
                validator: validateConfirmPassword,
              },
            ]}
          ><Input.Password
              size="large"
              type="password"
            />
          </Form.Item>
          {/* END Nhập lại mk mới */}
          <br></br>
          {/* Button submit */}
          <Form.Item className='changePassword__button'>
            <Button type="primary" htmlType="submit">Đổi mật khẩu</Button>
          </Form.Item>
          {/* END Button submit */}

        </Form>
      </Modal>
    </div >
  )
}

export default ChangePassword;
import React, { useState } from 'react';
import { Button, Form, Input, Modal, Space, Spin, Upload, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { reRender } from '../../actions/reRender';
import { updateBlogService } from '../../services/blogsService';

const UpdateBlogs = (props) => {
  const { blog } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();


  //Modal
  const showModal = () => {
    setOpen(true);

  };

  const handleCancel = () => {
    setOpen(false);
  };
  //END Modal

  //Form
  //Call API
  const onFinish = async (values) => {
    // Tạo form data
    try {
      const response = await updateBlogService(blog.key, values);
      if (response.success) {
        message.success("Cập nhập thành công");
        setOpen(false); // Đóng modal sau khi gửi thành công
        dispatch(reRender(true));
      } else {
        if (response.message === "The entity name already exists!") {
          message.error("Tên đã tồn tại!");
          console.log('Error:', response);
        }
        else {
          message.error("Chỉnh sửa thất bại!");
        }
      }
      setLoading(false);
    }
    catch (error) {
      console.log('Error:', error);
      message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau");
      setLoading(false);
    }
    // Tạo form data
  };
  //END 

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  //END Form


  return (
    <>
      <Space>
        <Button shape="circle" className="btn__edit" onClick={showModal} >
          <EditOutlined />
        </Button>
      </Space >
      <Modal
        centered
        open={open}
        title="Chỉnh sửa thông tin"
        onCancel={handleCancel}
        footer={null}
      >

        <Spin spinning={loading}>
          <br></br>
          {/* Form nhập dữ liệu */}
          <Form
            form={form}
            name={blog.name} labelCol={{ span: 3, }} wrapperCol={{ span: 21, }}
            style={{ maxWidth: 600, }}
            initialValues={blog}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >

            {/* Nhập Tên  */}
            <Form.Item label="Tên" name="name"
              rules={[
                {
                  required: true,
                  message: 'Không được bỏ trống',
                },
              ]}
            ><Input />
            </Form.Item>
            {/* END Nhập tên */}

            <br></br>
            {/* Button submit */}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" onClick={showModal} className='admin__button admin__button--edit' htmlType="submit">
                <EditOutlined />
                Chỉnh sửa
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

export default UpdateBlogs;
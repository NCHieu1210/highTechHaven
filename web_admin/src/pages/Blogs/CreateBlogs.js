import React, { useState } from 'react';
import { Button, Form, Input, Modal, Space, Spin, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { reRender } from '../../actions/reRender';
import { createBlogService } from '../../services/blogsService';

const CreateBlogs = () => {

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
    //Tạo form data
    const formData = new FormData();
    formData.append("name", values["name"]);
    try {
      const response = await createBlogService(formData);
      if (response.success) {
        message.success("Thêm mới thành công");
        setOpen(false); // Đóng modal sau khi gửi thành công
        dispatch(reRender(true));
        form.resetFields(); // Xóa dữ liệu cũ sau khi gửi thành công
      } else {
        if (response.message === "The entity name already exists!") {
          message.error("Tên đã tồn tại!");
          console.log('Error:', response);
        }
        else {
          message.error("Thêm mới thất bại!");
        }
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

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  //END Form

  return (
    <>
      <Space>
        <Button type="primary" onClick={showModal} className='admin__button admin__button--add'>
          <PlusOutlined /> Thêm mới
        </Button>
      </Space>
      <Modal
        centered
        open={open}
        title="Thêm mới chuyên mục"
        onCancel={handleCancel}
        footer={null}
      >

        <Spin spinning={loading}>
          <br></br>
          {/* Form nhập dữ liệu */}
          <Form
            form={form}
            name="createSupplier" labelCol={{ span: 3, }} wrapperCol={{ span: 21, }}
            style={{ maxWidth: 600, }}
            initialValues={{ remember: true, }}
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

            {/* Button submit */}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" onClick={showModal} className='admin__button admin__button--add' htmlType="submit">
                <PlusOutlined /> Thêm mới
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

export default CreateBlogs;
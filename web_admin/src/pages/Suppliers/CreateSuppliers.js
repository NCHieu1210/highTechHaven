import React, { useState } from 'react';
import { Button, Form, Input, Modal, Space, Spin, Upload, message } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { createSupplierService } from '../../services/suppliersService';
import { useDispatch } from 'react-redux';
import { reRender } from '../../actions/reRender';
import checkImageUpload from '../../helpers/checkImageUpload';


const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const CreateSupplier = () => {
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
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
    // Tạo form data
    setLoading(true);
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
    if (fileList.length > 0) {
      formData.append('filelogo', fileList[0].originFileObj);
    }
    try {
      const response = await createSupplierService(formData);
      if (response.success) {
        message.success("Thêm mới thành công");
        setOpen(false); // Đóng modal sau khi gửi thành công
        dispatch(reRender(true));
        form.resetFields(); // Xóa dữ liệu cũ sau khi gửi thành công
        setFileList([]); // Xóa fileList sau khi gửi thành công
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
  const handleChange = ({ fileList }) => setFileList(fileList);
  //END Form

  //Kiểm tra file ảnh
  const beforeUpload = (file) => checkImageUpload(file);

  //END kiểm tra file ảnh

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
        title="Thêm mới nhà sản xuất"
        onCancel={handleCancel}
        footer={null}
      >

        <Spin spinning={loading}>
          <br></br>
          {/* Form nhập dữ liệu */}
          <Form
            form={form}
            name="createSupplier" labelCol={{ span: 6, }} wrapperCol={{ span: 18, }}
            style={{ maxWidth: 600, }}
            initialValues={{ remember: true, }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >

            {/* Nhập logo */}
            <Form.Item label="Logo" name="filelogo" getValueFromEvent={normFile} >
              <Upload listType="picture-card" fileList={fileList} maxCount={1}
                onChange={handleChange} beforeUpload={beforeUpload} showUploadList={{ showPreviewIcon: false }}  >
                <button type="button"
                  style={{
                    border: 0,
                    background: 'none',
                  }}
                >
                  {fileList.length >= 1 ?
                    (<div>
                      <EditOutlined />
                      <div style={{ marginTop: 8 }}>Edit</div>
                    </div>) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                </button>
              </Upload>
            </Form.Item>
            {/* END Nhập logo */}

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

            {/* Nhập Email */}
            <Form.Item label="Email" name="email"
              rules={[
                {
                  required: true,
                  message: 'Không được bỏ trống',
                  type: 'email', message: 'Địa chi email không hợp lệ!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/* END Nhập Email */}

            {/* Nhập Số điện thoại */}
            <Form.Item label="Số điện thoại" name="phone"
              rules={[
                {
                  required: true,
                  message: 'Không được bỏ trống',
                  pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            {/* END nhập số điện thoại */}
            <br></br>

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

export default CreateSupplier;
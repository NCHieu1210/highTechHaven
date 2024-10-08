import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Space, Spin, Upload, message } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { updateSupplierService } from '../../services/suppliersService';
import { useDispatch } from 'react-redux';
import { reRender } from '../../actions/reRender';
import checkImageUpload from '../../helpers/checkImageUpload';

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const UpdateSupplier = (props) => {
  const { supplier } = props;

  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Khởi tạo fileList với ảnh mặc định từ supplier
  useEffect(() => {
    if (supplier.logo && supplier.logo.props.src) {
      setFileList([{
        uid: '-1',
        name: supplier.name,
        status: 'done',
        url: supplier.logo.props.src,  // Đường dẫn đến hình ảnh mặc định
      }]);
    }
    else setFileList([]);

  }, [supplier]);
  //END Khởi tạo fileList với ảnh mặc định từ supplier

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
    setLoading(true);
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }


    if (fileList.length > 0) {
      if (fileList[0].originFileObj) {
        formData.append('filelogo', fileList[0].originFileObj);
      }
      if (fileList[0].url == undefined) {
        formData.append('filelogo', null);
        formData.append('urllogo', '');
      }
      else {
        const url = new URL(fileList[0].url);
        const path = url.pathname;
        formData.append('urllogo', path);
      }
    }

    try {
      const response = await updateSupplierService(supplier.key, formData);
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

  const handleChange = ({ fileList }) => (setFileList(fileList), console.log(fileList));
  //END Form

  //Kiểm tra file ảnh
  const beforeUpload = (file) => checkImageUpload(file);
  //END kiểm tra file ảnh

  return (
    <>
      <Space>
        <Button shape="circle" onClick={showModal} className='btn__edit' >
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
            name={supplier.name} labelCol={{ span: 6, }} wrapperCol={{ span: 18, }}
            style={{ maxWidth: 600, }}
            initialValues={supplier}
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

            {/* END Nhập logo */}
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

export default UpdateSupplier;
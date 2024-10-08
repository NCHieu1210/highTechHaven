import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Spin, Upload, message } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { reRender } from '../../actions/reRender';
import checkImageUpload from '../../helpers/checkImageUpload';
import { createCategoryService } from '../../services/categoriesService';


const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const CreateCategories = (props) => {
  const { categories } = props;
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
    setLoading(true);
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key] === undefined ? "" : values[key]);
    }
    if (fileList.length > 0) {
      formData.append('thumbFile', fileList[0].originFileObj);
    }
    try {
      const response = await createCategoryService(formData);
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
  //END Call API


  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleChange = ({ fileList }) => setFileList(fileList);
  //END Form

  //Kiểm tra file ảnh
  const beforeUpload = (file) => checkImageUpload(file);

  const customThumbnailRender = (originNode, file) => {
    return (
      <div onClick={(file) => console.log(fileList)}>
        {originNode}
      </div>
    );
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className='admin__button admin__button--add'>
        <PlusOutlined /> Thêm mới
      </Button>
      <Modal
        centered
        open={open}
        title="Thêm mới danh mục"
        onCancel={handleCancel}
        footer={null}
      >

        <Spin spinning={loading}>
          <br></br>
          {/* Form nhập dữ liệu */}
          <Form
            form={form}
            name="createCategory" labelCol={{ span: 6, }} wrapperCol={{ span: 18, }}
            style={{ maxWidth: 600, }}
            initialValues={{ remember: true, }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >

            {/* Nhập logo */}
            <Form.Item label="Ảnh" name="thumbFile" getValueFromEvent={normFile} >
              <Upload listType="picture-card" fileList={fileList} maxCount={3} itemRender={customThumbnailRender}
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
            <Form.Item label="Tên" name="name" size="large"
              rules={[
                {
                  required: true,
                  message: 'Không được bỏ trống',
                },
              ]}
            ><Input />
            </Form.Item>
            {/* END Nhập tên */}


            {/* Danh mục cha */}
            <Form.Item label="Danh mục cha" name="ParentCategoryID">
              <Select placeholder="Chọn danh mục cha">
                <Select.Option key="-1" value="">
                  Không có danh mục cha
                </Select.Option>
                {categories &&
                  (categories.map(category => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  )))
                }
              </Select>
            </Form.Item>
            {/* END Danh mục cha */}
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
  )
}

export default CreateCategories;
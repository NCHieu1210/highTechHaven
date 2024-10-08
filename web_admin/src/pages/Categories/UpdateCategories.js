import { Button, Form, Input, Modal, Select, Space, Spin, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCategoryService } from "../../services/categoriesService";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import checkImageUpload from "../../helpers/checkImageUpload";
import { reRender } from "../../actions/reRender";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const UpdateCategories = (props) => {
  const { category, options } = props;
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // Khởi tạo fileList với ảnh mặc định từ category
  useEffect(() => {
    if (category.thumbnail && category.thumbnail.props.src) {
      setFileList([{
        uid: '-1',
        name: category.name,
        status: 'done',
        url: category.thumbnail.props.src,  // Đường dẫn đến hình ảnh mặc định
      }]);
    }
    else setFileList([]);
  }, [category]);
  //END Khởi tạo fileList với ảnh mặc định từ category

  // Chuyển đổi ParentCategory thành ParentCategoryID
  const getParentCategoryID = (parentCategoryName) => {
    const parentCategory = options.find(option => option.name == parentCategoryName);
    return parentCategory ? parentCategory.id : "";
  };
  //END Chuyển đổi ParentCategory thành ParentCategoryID


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
        formData.append('thumbFile', fileList[0].originFileObj);
      }
      if (fileList[0].url == undefined) {
        formData.append('thumbFile', null);
        formData.append('thumbUrl', '');
      }
      else {
        const url = new URL(fileList[0].url);
        const path = url.pathname;
        formData.append('thumbUrl', path);
      }
    }

    try {
      const response = await updateCategoryService(category.key, formData);
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

  const handleChange = ({ fileList }) => setFileList(fileList);
  //END Form

  //Kiểm tra file ảnh
  const beforeUpload = (file) => checkImageUpload(file);
  //END kiểm tra file ảnh

  return (
    <>
      <Space>
        <Button shape="circle" onClick={showModal} className="btn__edit">
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
            name={category.name} labelCol={{ span: 6, }} wrapperCol={{ span: 18, }}
            style={{ maxWidth: 600, }}
            initialValues={{
              ...category,
              ParentCategoryID: getParentCategoryID(category.parentCategory), // Đặt giá trị mặc định cho ParentCategoryID
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >
            {/* Nhập logo */}
            <Form.Item label="Ảnh" name="thumbFile" getValueFromEvent={normFile} >
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

            {/* Danh mục cha */}
            <Form.Item label="Danh mục cha" name="ParentCategoryID">
              <Select placeholder="Chọn danh mục cha">
                <Select.Option key="-1" value="">
                  Không có danh mục cha
                </Select.Option>
                {options &&
                  (options.map(option => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
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
  )
}

export default UpdateCategories;
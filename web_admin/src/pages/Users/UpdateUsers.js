import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Spin, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CheckImageUpload from "../../helpers/checkImageUpload";
import { getPathImage } from "../../helpers/getPathImage";
import { updateUserService } from "../../services/usersService";
import { reRender } from "../../actions/reRender";
import moment from "moment";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import './AdminUsers.scss'

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const UpdateUsers = (props) => {
  const { user, roles, viewStyle } = props;
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  // Khởi tạo fileList với ảnh mặc định từ user
  useEffect(() => {
    if (user && user.avatar && viewStyle === "grid") {
      setFileList([{
        uid: '-1',
        name: user.name,
        status: 'done',
        url: (getPathImage(user.avatar)),  // Đường dẫn đến hình ảnh mặc định
      }]);
    }
    else if (user.avatar && user.avatar.props.src && viewStyle === "table") {
      setFileList([{
        uid: '-1',
        name: user.name,
        status: 'done',
        url: user.avatar.props.src,  // Đường dẫn đến hình ảnh mặc định
      }]);
    }
    else setFileList([]);
  }, [user]);
  //END Khởi tạo fileList với ảnh mặc định từ user


  //Form
  //Call API
  const onFinish = async (values) => {
    console.log(fileList)
    // Tạo form data
    setLoading(true);
    const formData = new FormData();

    for (const key in values) {
      if (key === 'birthday' && values[key]) {
        formData.append(key, moment(values[key]).utc().format());
      } else {
        formData.append(key, values[key]);
      }
      console.log(key, values[key]);
    }
    if (fileList.length > 0) {
      if (fileList[0].originFileObj) {
        formData.append('fileavatar', fileList[0].originFileObj);
      }
      if (fileList[0].url == undefined) {
        formData.append('fileavatar', null);
        formData.append('urlavatar', '');
      }
      else {
        const url = new URL(fileList[0].url);
        const path = url.pathname;
        formData.append('urlavatar', path);
      }
    }

    try {
      const response = await updateUserService(user.id, formData);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          html: `Bạn đã chỉnh sửa thông tin tài khoản <strong>${user.email}</strong> thành công!`,
          icon: "success"
        });
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
  const beforeUpload = (file) => CheckImageUpload(file);
  //END kiểm tra file ảnh

  return (
    <>
      {viewStyle === "grid" ?
        (<EditOutlined className="btn__edit" key="edit" onClick={showDrawer} />) :
        (<Button shape="circle" style={{ margin: "0 15px" }} onClick={showDrawer} >
          <EditOutlined />
        </Button>)
      }
      <Drawer title="Chỉnh sửa thông tin tài khoản" onClose={onClose} open={open} size="large">
        <Spin spinning={loading}>
          {/* Form nhập dữ liệu */}
          <Form
            form={form}
            layout="vertical"
            name={user.name}
            initialValues={{
              ...user,
              sex: user.sex ? "true" : "false",
              birthday: user.birthday && user.birthday !== "0001-01-01T00:00:00" ? moment(user.birthday) : null
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >
            {/* Nhập logo */}
            <Form.Item label="Avatar" name="fileavarar" getValueFromEvent={normFile} >
              <Upload className="admin__upload" listType="picture-card" fileList={fileList} maxCount={1}
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

            <Row gutter={30}>
              <Col span={12}>
                {/* Nhập họ  */}
                <Form.Item label="Họ" name="firstName"
                  rules={[
                    {
                      required: true,
                      message: 'Không được bỏ trống',
                    },
                  ]}
                ><Input />
                </Form.Item>
                {/* END Nhập họ */}
              </Col>

              <Col span={12}>
                {/* Nhập tên  */}
                <Form.Item label="Tên" name="lastName"
                  rules={[
                    {
                      required: true,
                      message: 'Không được bỏ trống',
                    },
                  ]}
                ><Input />
                </Form.Item>
                {/* END Nhập tên */}
              </Col>
            </Row>

            <Row gutter={30}>
              <Col span={12}>
                {/* Nhập ngày sinh  */}
                <Form.Item label="Ngày sinh" name="birthday">
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
                {/* END Nhập ngày sinh */}
              </Col>

              {/* Nhập giới tính */}
              <Col span={12}>
                <Form.Item label="Giới tính" name="sex"
                  rules={[
                    {
                      required: true,
                      message: 'Bạn phải chọn một giới tính',
                    },
                  ]}>
                  <Select placeholder="Chọn giới tính">
                    <Select.Option value="true">Nam</Select.Option>
                    <Select.Option value="false">Nữ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* END Nhập giới tính */}
            </Row>

            <Row gutter={30}>
              {/* Nhập email  */}
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
              </Col>
              {/* END Nhập email */}

              {/* Nhập số điện thoại  */}
              <Col span={12}>
                <Form.Item label="Số điện thoại" name="phoneNumber">
                  <Input disabled />
                </Form.Item>
              </Col>
              {/* END Nhập số điện thoại */}
            </Row>

            {/* Chọn vai trò */}
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
            {/* END chọn vai trò */}

            <br></br>
            {/* Button submit */}
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 1,
              }}
            >
              <Button type="primary" className='admin__button admin__button--edit' htmlType="submit">
                <EditOutlined />
                Chỉnh sửa
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

export default UpdateUsers;
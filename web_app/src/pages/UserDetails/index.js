import React, { useEffect, useState } from "react";
import { getUserByTokenService, updateUserDetailsService } from "../../services/usersService";
import { getCookie } from "../../helpers/cookies";
import { Button, DatePicker, Form, Input, message, Select, Spin, Tooltip, Upload } from "antd";
import { EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import CheckImageUpload from "../../helpers/checkImageUpload";
import moment from "moment";
import { reRender } from "../../actions/reRender";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { getPathImage } from "../../helpers/getPathImage";
import './UserDetails.scss'
import { useDispatch, useSelector } from "react-redux";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const UserDetails = () => {
  const [user, setUser] = useState();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const isReRender = useSelector(state => state.reRender);

  //Call API
  useEffect(() => {
    const getUserByToken = async () => {
      const token = getCookie("hthToken");
      try {
        const response = await getUserByTokenService(token);
        if (response.success) {
          setUser(response.data);
        }
        else {
          console.log("erorr:", response.message);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    getUserByToken();
    setEdit(false);
    if (isReRender === true) {
      dispatch(reRender(false));
    }
  }, [dispatch, isReRender])
  //Call API

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // Khởi tạo fileList với ảnh mặc định từ user
  useEffect(() => {
    if (user && user.avatar) {
      setFileList([{
        uid: '-1',
        name: user.userName,
        status: 'done',
        url: (getPathImage(user.avatar)),  // Đường dẫn đến hình ảnh mặc định
      }]);
    }
    else setFileList([]);
  }, [user]);
  //END Khởi tạo fileList với ảnh mặc định từ user

  //Form
  //Call API
  const onFinish = async (values) => {
    // Tạo form data
    setLoading(true);
    const formData = new FormData();

    for (const key in values) {
      if (key === 'birthday' && values[key]) {
        formData.append(key, moment(values[key]).utc().format());
      } else {
        formData.append(key, values[key]);
      }
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
      const response = await updateUserDetailsService(formData);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          html: `Bạn đã cập nhập thông tin tài khoản thành công!`,
          icon: "success"
        });
        dispatch(reRender(true));
      }
      else {
        message.error("Chỉnh sửa thất bại!");
      }
    }
    catch (error) {
      console.log('Error:', error);
      message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau");
    }
    finally {
      setLoading(false);
    }
    // Tạo form data
  };
  //END

  const handleChange = ({ fileList }) => setFileList(fileList);
  //END Form

  //Kiểm tra file ảnh
  const beforeUpload = (file) => CheckImageUpload(file);
  //END kiểm tra file ảnh

  return (
    <>
      {user && (
        <div className="userDetails">
          <h1>THÔNG TIN NGƯỜI DÙNG</h1>
          <br></br>
          <span>Xin chào <strong>{`${user.firstName} ${user.lastName}!`}</strong></span>
          <Tooltip title="Chỉnh sửa thông tin" color="cyan" placement="right">
            <Button onClick={() => setEdit(!edit)} shape="circle" className="userDetails__form--edit"><EditOutlined /></Button>
          </Tooltip>
          <br></br>
          <br></br>

          <Spin spinning={loading}>
            {/* Form nhập dữ liệu */}
            <Form
              layout="horizontal"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 17 }}
              form={form}
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
              <div className="userDetails__form">
                <div>
                  {/* Nhập họ  */}
                  <Form.Item label="Họ" name="firstName"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng không bỏ trống',
                      },
                    ]}
                  ><Input disabled={!edit} />
                  </Form.Item>
                  {/* END Nhập họ */}

                  {/* Nhập tên  */}
                  <Form.Item label="Tên" name="lastName"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng không bỏ trống',
                      },
                    ]}
                  ><Input disabled={!edit} />
                  </Form.Item>
                  {/* END Nhập tên */}

                  {/* Nhập ngày sinh  */}
                  <Form.Item label="Ngày sinh" name="birthday"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng không bỏ trống',
                      },
                    ]}>
                    <DatePicker disabled={!edit} style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                  {/* END Nhập ngày sinh */}

                  {/* Nhập giới tính */}
                  <Form.Item label="Giới tính" name="sex"
                    rules={[
                      {
                        required: true,
                        message: 'Bạn phải chọn một giới tính',
                      },
                    ]}>
                    <Select placeholder="Chọn giới tính" disabled={!edit}>
                      <Select.Option value="true">Nam</Select.Option>
                      <Select.Option value="false">Nữ</Select.Option>
                    </Select>
                  </Form.Item>
                  {/* END Nhập giới tính */}

                  {/* Nhập số điện thoại  */}
                  <Form.Item label="Số điện thoại" name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng không bỏ trống',
                        pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!',
                      },
                    ]}>
                    <Input disabled={!edit} />
                  </Form.Item>
                  {/* END Nhập số điện thoại */}

                  {/* Nhập email  */}
                  <Form.Item label="Email" name="email">
                    <Input disabled />
                  </Form.Item>
                  {/* END Nhập email */}
                </div>

                <div>
                  {/* Nhập avatar */}
                  <Form.Item label="" name="fileavarar" getValueFromEvent={normFile}  >
                    <Upload disabled={!edit} className="userDetails__form--avatar " listType="picture-card" fileList={fileList} maxCount={1}
                      onChange={handleChange} beforeUpload={beforeUpload} showUploadList={{ showPreviewIcon: false }}
                    >
                      <button type="button"
                        disabled={!edit}
                        style={{
                          border: 0,
                          background: 'none',
                        }}
                      >
                        {fileList.length >= 1 ?
                          (<div className={edit ? '' : 'displayNone'} >
                            <div> <EditOutlined /> Chỉnh sủa</div>
                          </div>) :
                          (<div>
                            <div><PlusOutlined />Tải lên</div>
                          </div>)
                        }
                      </button>
                    </Upload>
                  </Form.Item>
                  {/* END Nhập logo */}
                </div>
              </div>

              <br></br>
              {/* Button submit */}
              <Form.Item
                wrapperCol={{
                  offset: 5,
                }}>
                <Button type="primary" htmlType="submit"
                  className={edit ? 'btn__two userDetails__form--btn ' : ' displayNone'} >
                  <SaveOutlined />
                  Lưu lại
                </Button>
              </Form.Item>
              {/* END Button submit */}
            </Form>
            {/* END Form nhập dữ liệu */}
          </Spin >
        </div >
      )}
    </>
  );
}

export default UserDetails;
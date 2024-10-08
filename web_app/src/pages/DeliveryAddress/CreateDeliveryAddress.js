import { PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Modal, Select, Spin } from "antd"
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { useState } from "react";
import dataAddress from "../../assets/address/dvhcvn.json";
import { createDeliveryAddressService } from "../../services/deliveryAddressServer";
import { useDispatch } from "react-redux";
import { reRender } from "../../actions/reRender";


const CreateDeliveryAddress = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const dispatch = useDispatch();

  const showModal = () => {
    setOpen(true);
    setCities(dataAddress.data);
  };
  const handleCancel = () => {
    setOpen(false);
    // form.resetFields();
    // setFileList([]);
  };

  const onFinish = async (values) => {
    setLoading(true);

    values.address = `${values.city} - ${values.district} - ${values.ward} - ${values.deliveryAddress}`;
    //Tạo form data
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
      console.log("VL", key, values[key]);
    }
    try {
      const response = await createDeliveryAddressService(formData);
      if (response.success) {
        message.success("Thêm mới thành công");
        setOpen(false); // Đóng modal sau khi gửi thành công
        dispatch(reRender(true));
        form.resetFields(); // Xóa dữ liệu cũ sau khi gửi thành công
      } else {
        message.error("Thêm mới thất bại!");
        console.log('Error:', response.message);
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

  //Handle select city, district, ward
  const handleCityChange = (value) => {
    const selectedCity = cities.find(city => city.name === value);
    setDistricts(selectedCity.level2s);
    form.setFieldsValue({ district: undefined, ward: undefined });
    setWards([]);
  };
  const handleDistrictChange = (value) => {
    const selectedDistrict = districts.find(district => district.name === value);
    setWards(selectedDistrict.level3s);
    form.setFieldsValue({ ward: undefined });
  };
  //END Handle select city, district, ward

  return (
    <>
      <Button type="primary" onClick={showModal} className='btn__two'>
        <PlusOutlined /> Thêm mới
      </Button>

      <Modal
        centered
        open={open}
        title="Thêm mới địa chỉ"
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

            {/* Địa chỉ từ json */}
            <Form.Item
              label="Thành phố/Tỉnh"
              name="city"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn thành phố!',
                },
              ]}
            >
              <Select onChange={handleCityChange}>
                {cities.map(city => (
                  <Option key={city.level1_id} value={city.name}>{city.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quận/Huyện"
              name="district"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn quận/huyện!',
                },
              ]}
            >
              <Select onChange={handleDistrictChange} disabled={!districts.length}>
                {districts.map(district => (
                  <Option key={district.level2_id} value={district.name}>{district.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Phường/Xã"
              name="ward"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn phường/xã!',
                },
              ]}
            >
              <Select disabled={!wards.length}>
                {wards.map(ward => (
                  <Option key={ward.level3_id} value={ward.name}>{ward.name}</Option>
                ))}
              </Select>
            </Form.Item>
            {/* END Địa chỉ json*/}

            {/* Địa chỉ */}
            <Form.Item
              label="Chi tiết địa chỉ"
              name="deliveryAddress"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ!',
                },
              ]}
            >
              <TextArea rows={3} placeholder="Thôn, xóm, đường, số nhà,..." />
            </Form.Item>
            {/* END Địa chỉ */}
            <br></br>

            {/* Button submit */}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" onClick={showModal} className='btn__two' htmlType="submit">
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

export default CreateDeliveryAddress
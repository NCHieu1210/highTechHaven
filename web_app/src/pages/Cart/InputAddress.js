import { Button, Checkbox, Form, Input, message, Radio, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import dataAddress from "../../assets/address/dvhcvn.json";
import { Option } from "antd/es/mentions";
import { ArrowLeftOutlined, DollarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { getProductsByIdService } from "../../services/productsService";

const InputAddress = () => {
  const [form] = Form.useForm();
  const [isStorePickup, setIsStorePickup] = useState(false);
  const [amount, setAmount] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const carts = useSelector(state => state.data.carts);
  const navigate = useNavigate();

  //Lấy data từ json
  useEffect(() => {
    setCities(dataAddress.data);
  }, []);
  //END Lấy data từ json

  useEffect(() => {
    var calculateTotalPrice = () => {
      var totalPrice = carts.reduce((total, cart) =>
        total + (cart.productVariant.price - (cart.productVariant.price * cart.productVariant.discount / 100)) * cart.quantity, 0)
      setAmount(parseInt(totalPrice));
    }
    calculateTotalPrice();
  }, [])


  const onFinish = async (values) => {
    values.buyAtTheStore == 1 ? (values.buyAtTheStore = true) : (values.buyAtTheStore = false);
    if (!values.buyAtTheStore) {
      values.deliveryAddress = `${values.city} - ${values.district} - ${values.ward} - ${values.deliveryAddress}`;
    }
    localStorage.setItem('orderData', JSON.stringify(values));

    if (values.paymentMethods == 1) {
      try {
        const data = {
          fullName: `${values.receiver} - ${values.deliveryPhone}`,
          amount: amount
        }
        const response = await fetch('https://hthecomapiserver.azurewebsites.net/api/Orders/payment-with-vnpay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const paymentUrl = await response.text();
          window.location.href = paymentUrl; // Redirect to the payment URL
        } else {
          message.error("Hệ thống hiện đang bảo trì thanh toán VN Pay. Vui lòng thử lại sau!");
          console.error('Failed to create payment URL');
        }
      } catch (error) {
        message.error("Hệ thống hiện đang bảo trì thanh toán VN Pay. Vui lòng thử lại sau!");
        console.error('Fetch error: ', error);
      }
    }
    else {
      navigate("/orders/payment");
      window.scrollTo(0, 0);
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // 0838241889
  const handlePickupChange = (e) => {
    setIsStorePickup(e.target.value === "1");
    if (e.target.value === "1") {
      form.setFieldsValue({ deliveryAddress: "Nhận tại cửa hàng" });
    } else {
      form.setFieldsValue({ deliveryAddress: "" });
    }
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
      <div className="cart__address">
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: "1000px",
          }}
          initialValues={{
            remember: true,
            paymentMethods: 0, // Giá trị mặc định của phương thức thanh toán
            buyAtTheStore: "0",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="large"
        >
          {/* Tên người nhận hàng */}
          <Form.Item
            label="Người nhận"
            name="receiver"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* END Tên người nhận hàng */}
          <br></br>
          {/* Số điện thoại */}
          <Form.Item
            label="Số điện thoại"
            name="deliveryPhone"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại!',
                pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* END Số điện thoại */}
          <br></br>

          {/* Nhận tại cửa hàng hay giao hàng tận nơi */}
          <Form.Item label="Phương thức" name="buyAtTheStore"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn phương thức nhận hàng!',
              },
            ]}>
            <Radio.Group onChange={handlePickupChange} style={{ width: "100%" }}>
              <Radio.Button style={{ width: "50%" }} value="0"><strong>Giao hàng tận nơi</strong></Radio.Button>
              <Radio.Button style={{ width: "50%" }} value="1"><strong>Nhận tại cửa hàng</strong></Radio.Button>
            </Radio.Group>
          </Form.Item>
          {/* END Nhận tại cửa hàng hay giao hàng tận nơi */}

          {/* Địa chỉ từ json */}
          <Form.Item
            label="Thành phố/Tỉnh"
            name="city"
            rules={[
              {
                required: !isStorePickup,
                message: 'Vui lòng chọn thành phố!',
              },
            ]}
          >
            <Select onChange={handleCityChange} disabled={isStorePickup}>
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
                required: !isStorePickup,
                message: 'Vui lòng chọn quận/huyện!',
              },
            ]}
          >
            <Select onChange={handleDistrictChange} disabled={isStorePickup || !districts.length}>
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
                required: !isStorePickup,
                message: 'Vui lòng chọn phường/xã!',
              },
            ]}
          >
            <Select disabled={isStorePickup || !wards.length}>
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
                required: !isStorePickup,
                message: 'Vui lòng nhập địa chỉ!',
              },
            ]}
          >
            <TextArea rows={3} disabled={isStorePickup} placeholder="Thôn, xóm, đường, số nhà,..." />
          </Form.Item>
          {/* END Địa chỉ */}
          <br></br>

          {/* Phương thức thanh toán */}
          <Form.Item label="Thanh toán bằng" name="paymentMethods"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn phương thức thanh toán!',
              },
            ]}>
            <Radio.Group>
              <Radio value={0}> Tiền mặt </Radio>
              <Radio value={1}> VN pay </Radio>
            </Radio.Group>
          </Form.Item>
          {/* END Phương thức thanh toán */}
          <br></br>
          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
            className="cart__address--btn"
          >
            <Button type="primary" onClick={() => navigate(-1)} >
              <ArrowLeftOutlined />Quay lại
            </Button>
            <Button type="primary" htmlType="submit">
              <DollarOutlined />Thanh toán
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default InputAddress;
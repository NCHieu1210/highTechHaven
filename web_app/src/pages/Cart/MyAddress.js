import { Button, Checkbox, Form, Input, message, Radio, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined, DollarOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { getProductsByIdService } from "../../services/productsService";
import { getDeliveryAddressByTokenService } from "../../services/deliveryAddressServer";
import NoData from "../../components/NoData";
import CreateDeliveryAddress from "../DeliveryAddress/CreateDeliveryAddress";
import { reRender } from "../../actions/reRender";

const MyAddress = () => {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const carts = useSelector(state => state.data.carts);
  const dispath = useDispatch();
  const isReRender = useSelector(state => state.reRender);
  const navigate = useNavigate();

  useEffect(() => {
    var calculateTotalPrice = () => {
      var totalPrice = carts.reduce((total, cart) =>
        total + Math.floor((cart.productVariant.price - (cart.productVariant.price * cart.productVariant.discount / 100)) * cart.quantity, 0))
      setAmount(parseInt(totalPrice));
    }
    const getAdress = async () => {
      try {
        const res = await getDeliveryAddressByTokenService();
        if (res.success) {
          if (res.data.length > 0) {
            form.setFieldsValue({
              receiver: res.data[0].name,
              deliveryPhone: res.data[0].phone,
              deliveryAddress: res.data[0].address,
            });
            setSelectedAddressId(res.data[0].id);
          }
          setDeliveryAddress(res.data);
        }
        else {
          console.log("Error", res.message);
        }
      }
      catch (exception) {
        console.log("Error:", exception.message);
      }
    }
    calculateTotalPrice();
    getAdress();

    if (isReRender) {
      dispath(reRender(false));
    }
  }, [isReRender])

  const onFinish = async (values) => {
    values.buyAtTheStore = false;
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
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChange = (e) => {
    setSelectedAddressId(e.target.value);
    const selectedAddress = deliveryAddress.find(item => item.id === e.target.value);
    form.setFieldsValue({
      receiver: selectedAddress.name,
      deliveryPhone: selectedAddress.phone,
      deliveryAddress: selectedAddress.address,
    });
  };
  return (
    <>
      {deliveryAddress && deliveryAddress.length > 0 ? (
        <div className="cart__address">
          <div style={{ textAlign: "center" }}>
            <h2>CHỌN ĐỊA CHỈ CỦA BẠN</h2>
            <br></br>
            <Radio.Group className="cart__address--radio" onChange={onChange} value={selectedAddressId} defaultValue={selectedAddressId}>
              <Space direction="vertical">
                {
                  deliveryAddress?.map((item, index) => (
                    <Radio.Button value={item.id} key={index}>
                      <p>{item.name} - {item.phone} </p>
                      <em style={{ color: "gray" }}>{item.address}</em>
                      <br></br>
                      <br></br>
                    </Radio.Button>
                  ))
                }
              </Space>
            </Radio.Group>
          </div>
          <br></br>
          <br></br>
          <h2 style={{ textAlign: "center" }}>THÔNG TIN NHẬN HÀNG</h2>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 19,
            }}
            style={{
              maxWidth: "777px"
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
            >
              <Input disabled={true} />
            </Form.Item>
            {/* END Tên người nhận hàng */}
            <br></br>
            {/* Số điện thoại */}
            <Form.Item
              label="Số điện thoại"
              name="deliveryPhone"
            >
              <Input disabled={true} />
            </Form.Item >
            {/* END Số điện thoại */}
            <br></br>

            {/* Địa chỉ */}
            <Form.Item
              label="Địa chỉ"
              name="deliveryAddress"
            >
              <TextArea rows={3} disabled={true} placeholder="Thôn, xóm, đường, số nhà,..." />
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
                offset: 5
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
      ) : (
        <div style={{ textAlign: "center", width: "100%" }}>
          <NoData content="Bạn hiện chưa có địa chỉ mua hàng"></NoData>
          <CreateDeliveryAddress></CreateDeliveryAddress>
          <br></br>
          <br></br>
        </div>)}
    </>
  )
}
export default MyAddress;
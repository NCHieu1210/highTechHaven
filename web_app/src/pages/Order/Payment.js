import { message, Skeleton } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartsData } from "../../actions/dataAction";
import { createOrderService } from "../../services/ordersService";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderData = JSON.parse(localStorage.getItem('orderData'));

  useEffect(() => {
    const createOrder = async () => {
      try {
        const response = await createOrderService(orderData);
        if (response.success) {
          Swal.fire({
            title: "Thành công!",
            text: "Chúc mừng bạn đã đặt hàng thành công, đơn hàng đang trong quá trình xác nhận!",
            icon: "success"
          });
          localStorage.removeItem('orderData');
          dispatch(setCartsData([]));
          navigate('/user/orders');
        } else {
          message.error("Thanh toán thất bại!");
          navigate('/cart/check-out');
        }
      } catch (error) {
        message.error("Lỗi hệ thống, vui lòng thử lại sau!");
        navigate('/cart/check-out')
      }
    }
    createOrder();
  }, [])

  return (
    <>
      <Skeleton active style={{ height: "70vh" }}></Skeleton>
    </>
  )
}

export default Payment;
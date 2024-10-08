import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductByVariantsService, getProductsByIdService } from "../../services/productsService";
import './Cart.scss'
import CartContainersLeft from "./CartContainersLeft";
import CartContainersRight from "./CartContainersRight";
import NoData from "../../components/NoData";
import { NavLink } from "react-router-dom";
import { Button } from "antd";

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];
const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.data.carts);
  const [products, setProducts] = useState([]);

  return (
    <>
      <div className="cart__title">
        <br></br>
        <h1>GIỎ HÀNG</h1>
        <hr></hr>
        <br></br>
      </div>
      {products && (
        <div className="cart">
          {cart.length > 0 ? (
            <>
              <CartContainersLeft cart={cart} dispatch={dispatch}></CartContainersLeft>
            </>) :
            (<div style={{ textAlign: "center", width: "100%" }}>
              <NoData content="Bạn hiện chưa có sản phẩm trong giỏ hàng"></NoData>
              <NavLink to="/products"><Button className="btn__two">Thêm ngay</Button></NavLink>
              <br></br>
            </div>)}

          <CartContainersRight cart={cart}></CartContainersRight>
        </div>
      )}
    </>
  )
}

export default Cart;
import { Button, Card } from "antd";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const CartContainersRight = (props) => {
  const { cart } = props;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const DiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  const totalQuantity = cart.reduce((total, cart) => total + cart.quantity, 0) || 0;
  const totalPriceBeforeDiscount = cart.reduce((total, cart) => total + cart.productVariant.price * cart.quantity, 0);
  const totalPriceAfterDiscount = cart.reduce((total, cart) => total + DiscountedPrice(cart.productVariant.price, cart.productVariant.discount) * cart.quantity, 0);

  return (
    <>
      <div className="cart__total">
        <Card title="Tổng cộng" bordered={false} >
          <div>
            <p>Số sản phẩm:</p>
            <p>{cart.length}</p>
          </div>
          <div>
            <p>Tổng sản phẩm:</p>
            <p>{totalQuantity}</p>
          </div>
          <br></br>
          <hr></hr>
          <div>
            <strong >Tổng tiền:</strong>
            <div>
              {formatPrice(totalPriceBeforeDiscount) === formatPrice(totalPriceAfterDiscount) ?
                (<></>) :
                (<p><span style={{ textDecoration: 'line-through' }}>{formatPrice(totalPriceBeforeDiscount)}</span></p>)
              }
              <strong style={{ color: 'red', paddingRight: "10px" }}>{formatPrice(totalPriceAfterDiscount)}</strong>
            </div>
          </div>
          <br></br>
          <NavLink to="/cart/check-out" ><Button disabled={cart.length === 0} type="primary">Đặt hàng ngay</Button></NavLink>
        </Card >
      </div >
    </>
  );
}

export default CartContainersRight;
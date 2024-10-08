import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartByTokenService } from "../../services/cartService";
import { setCartsData } from "../../actions/dataAction";

const CartLayout = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const carts = useSelector((state) => state.data.carts);
  const reRenderCart = useSelector((state) => state.reRender);
  const dispatch = useDispatch();
  useEffect(() => {
    const getCart = async () => {
      try {
        const cartsResponse = await getCartByTokenService();
        if (cartsResponse && cartsResponse.success) {
          dispatch(setCartsData(cartsResponse.data.reverse()));
        }
        else {
          console.log("Error:", cartsResponse.message);
          dispatch(setCartsData([]));
        }
      } catch (error) {
        dispatch(setCartsData([]));
        console.log("Error:", error.message);
      }
    };
    getCart();

  }, [dispatch, reRenderCart]);

  useEffect(() => {
    if (Array.isArray(carts)) {
      const totalQuantityCart = carts.reduce((total, item) => total + item.quantity, 0);
      setTotalQuantity(totalQuantityCart);
    }
  }, [carts]);

  return (
    <>
      <Badge count={totalQuantity} size="large" style={{ backgroundColor: "while" }} >
        <ShoppingCartOutlined />
      </Badge>
    </>
  );
};

export default CartLayout;
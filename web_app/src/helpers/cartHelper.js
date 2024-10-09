import { useDispatch } from "react-redux";
import { addToCartService, getCartByTokenService, reduceQuantityService } from "../services/cartService";
import { message } from "antd";
import { setCartsData } from "../actions/dataAction";
import { checkRolesInvalid } from "./checkRolesInvalid";

message.config({
  maxCount: 3,
});
export const AddToCart = async (productVariantID, quantity, dispatch, setShowModalLogin) => {

  try {
    const response = await addToCartService({ productVariantID, quantity });
    if (response === 401) {
      console.log("Error: Unauthorized");
      setShowModalLogin(true);
    }
    else if (response.success) {
      const checkRoles = checkRolesInvalid();
      if (!checkRoles) {
        message.error('Tài khoản của bạn không thể thực hiện chức năng này!');
      }
      const responseCarts = await getCartByTokenService();
      message.success("Sản phẩm đã được thêm vào giỏ hàng");
      dispatch(setCartsData(responseCarts.data));
      // Dispatch an action to update the cart state if needed
      // dispatch(addToCart(response.data));
    } else {
      message.error('Lỗi hệ thống, vui lòng thử lại sau!');
      console.log(`Error: ${response.message}`)
    }
  } catch (error) {
    message.error('Lỗi hệ thống, vui lòng thử lại sau!');
    console.log(`Error: ${error.message}`)
  }
}

export const ReduceQuantity = async (productVariantID, quantity, dispatch) => {
  const checkRoles = checkRolesInvalid();
  if (!checkRoles) {
    message.error('Tài khoản của bạn không thể thực hiện chức năng này!');
  }
  else {
    try {
      const response = await reduceQuantityService({ productVariantID, quantity });
      if (response.success) {
        const responseCarts = await getCartByTokenService();
        message.error("Bạn đã xóa sản phẩm ra khỏi giỏ hàng");
        dispatch(setCartsData(responseCarts.data));
        // Dispatch an action to update the cart state if needed
        // dispatch(addToCart(response.data));
      } else {
        message.error(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      message.error(`Lỗi: ${error.message}`);
    }
  }
}
import { message } from "antd";
import { setFavoritesData } from "../actions/dataAction";
import { addToFavouritesService, deleteFormFavouritesService, getFavouritesByTokenService } from "../services/favouritesService";
import { reRender } from "../actions/reRender";

message.config({
  maxCount: 3,
});
export const AddToFavorites = async (optionID, dispatch, setShowModalLogin) => {
  try {
    const response = await addToFavouritesService(optionID);
    if (response === 401) {
      setShowModalLogin(true);
    }
    else if (response.success) {
      const responseFavorites = await getFavouritesByTokenService();
      dispatch(setFavoritesData(responseFavorites.data.reverse()));
      dispatch(reRender(true));
      message.success("Sản phẩm đã được thêm vào danh sách yêu thích");
    } else {
      if (response === 400) {
        message.error("Sản phẩm đã tồn tại trong danh sách yêu thích!");
      } else {
        message.error(`Lỗi hệ thống, vui lòng thử lại sau!`);
        console.log(`Lỗi: ${response.message}`)
      }
    }
  } catch (error) {
    message.error(`Lỗi hệ thống, vui lòng thử lại sau!`);
    console.log(`Lỗi: ${error.message}`)
  }
}

export const deleteFromFavorites = async (optionID, dispatch) => {
  try {
    const response = await deleteFormFavouritesService(optionID);
    if (response.success) {
      const responseFavorites = await getFavouritesByTokenService();
      message.success("Xóa thành công!");
      dispatch(setFavoritesData(responseFavorites.data.reverse()));
    } else {
      message.error(`Lỗi hệ thống, vui lòng thử lại sau!`);
      console.error(`Lỗi: ${response.message}`);
    }
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
  }
}


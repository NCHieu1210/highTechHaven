import { HeartOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFavoritesData } from "../../actions/dataAction";
import { getFavouritesByTokenService } from "../../services/favouritesService";
import { Badge } from "antd";

const FavoritesLayout = () => {
  const favorites = useSelector((state) => state.data.favorites);
  const reRenderFavorites = useSelector((state) => state.reRender);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCart = async () => {
      try {
        const favoritesResponse = await getFavouritesByTokenService();
        if (favoritesResponse && favoritesResponse.success) {
          dispatch(setFavoritesData(favoritesResponse.data.reverse()));
        }
        else {
          // console.log("Error:", favoritesResponse.message);
          dispatch(setFavoritesData([]));
        }
      } catch (error) {
        dispatch(setFavoritesData([]));
        // console.log("Error:", error.message);
      }
    };
    getCart();

  }, [dispatch, reRenderFavorites]);


  return (
    <>
      <Badge count={favorites.length} size="large" style={{ backgroundColor: "while" }} >
        <HeartOutlined />
      </Badge>
    </>
  )
}

export default FavoritesLayout
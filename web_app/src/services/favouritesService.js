import { getAllByTokeAsync, postWithJsonAsync, deleteAsync } from "../utils/request";

export const getFavouritesByTokenService = async () => {
  const result = await getAllByTokeAsync("/Favourites/get-by-token");
  return result;
}

export const CheckFavouritesByTokenService = async (productOptionId) => {
  const result = await getAllByTokeAsync(`/Favourites/check-favorite-by-token/${productOptionId}`);
  return result;
}

export const addToFavouritesService = async (productOptionId) => {
  const result = await postWithJsonAsync(`/Favourites?productOptionId=${productOptionId}`);
  return result;
}

export const deleteFormFavouritesService = async (productOptionId) => {
  const result = await deleteAsync(`/Favourites?productOptionId=${productOptionId}`);
  return result;
}
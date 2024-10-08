import { getAllByTokeAsync, postWithJsonAsync } from "../utils/request";

export const getCartByTokenService = async () => {
  const result = await getAllByTokeAsync("/carts/get-by-token");
  return result;
}

export const addToCartService = async (data) => {
  const result = await postWithJsonAsync("/carts/add", data);
  return result;
}

export const reduceQuantityService = async (data) => {
  const result = await postWithJsonAsync("/carts/reduce", data);
  return result;
}
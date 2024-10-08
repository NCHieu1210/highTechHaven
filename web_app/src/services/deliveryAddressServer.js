import { deleteAsync, getAllByTokeAsync, getAllByTokenAsync, postAsync, putAsync } from "../utils/request";

export const getAllDeliveryAddressService = async () => {
  const result = await getAllByTokenAsync("/Users/delivery-address");
  return result;
}

export const getDeliveryAddressByTokenService = async () => {
  const result = await getAllByTokeAsync("/Users/delivery-address/get-by-token");
  return result;
}

export const createDeliveryAddressService = async (data) => {
  const result = await postAsync("/Users/delivery-address", data);
  return result;
}

export const updateDeliveryAddressService = async (id, data) => {
  const result = await putAsync(`/Users/delivery-address/${id}`, data);
  return result;
}

export const deleteDeliveryAddressService = async (data) => {
  const result = await deleteAsync("/Users/delivery-address/" + data);
  return result;
}
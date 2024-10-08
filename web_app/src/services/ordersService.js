import { getAllByTokeAsync, postWithJsonAsync } from "../utils/request";

export const createOrderService = async (data) => {
  const result = await postWithJsonAsync("/Orders/create", data);
  return result;
}

export const paymentWithVnpayService = async (data) => {
  const result = await postWithJsonAsync("/Orders/payment-with-vnpay", data);
  return result;
}

export const changeOrdersUpdateService = async (data) => {
  const result = await postWithJsonAsync(`/admin/Orders/${data}/change-status`);
  return result;
}

export const cancelOrdersService = async (data) => {
  const result = await postWithJsonAsync(`/admin/Orders/${data}/cancel`);
  return result;
}
export const getOrdersByTokenService = async () => {
  const result = await getAllByTokeAsync("/Orders");
  return result;
}

export const getOrdersHistoryByTokenService = async () => {
  const result = await getAllByTokeAsync("/Orders/order-history");
  return result;
}
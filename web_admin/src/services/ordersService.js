import { getAllByTokeAsync, postWithJsonAsync } from "../utils/request";

// export const createOrderService = async (data) => {
//   const result = await postWithJsonAsync("/Orders/create", data);
//   return result;
// }

export const changeOrdersUpdateService = async (data) => {
  const result = await postWithJsonAsync(`/admin/Orders/${data}/change-status`);
  return result;
}

export const cancelOrdersService = async (data) => {
  const result = await postWithJsonAsync(`/admin/Orders/${data}/cancel`);
  return result;
}

export const getAllOrdersService = async () => {
  const result = await getAllByTokeAsync("/admin/Orders");
  return result;
}

export const getAllRevenueService = async () => {
  const result = await getAllByTokeAsync("/admin/Orders/revenue");
  return result;
}

// export const getOrdersByTokenService = async () => {
//   const result = await getAllByTokeAsync("/Orders");
//   return result;
// }
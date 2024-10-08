// export const calculateOrderDetails = (order) => {
//   const totalOrderValue = order.orderDetails.reduce((total, detail) => total + (detail.quantity * detail.price), 0);
//   const totalProducts = order.orderDetails.reduce((total, detail) => total + detail.quantity, 0);
//   const lastUpdateName = order.orderUpdates.find(update => update.status === false)?.updateName || '';

//   return {
//     totalOrderValue,
//     totalProducts,
//     lastUpdateName
//   };
// };

export const totalOrderValue = (order) => {
  const value = order.orderDetails.reduce((total, detail) => total + (detail.quantity * detail.price * (1 - detail.discount / 100)), 0);
  return value;
}

export const totalProducts = (order) => {
  const value = order.orderDetails.reduce((total, detail) => total + detail.quantity, 0);
  return value;
}

export const lastUpdateName = (order) => {
  const value = order.orderUpdates.find(update => update.status === true)?.updateName || '';
  return value;
}

export const lastUpdateTime = (order) => {
  const value = order.orderUpdates.find(update => update.status === true)?.updateTime || '';
  return value;
}

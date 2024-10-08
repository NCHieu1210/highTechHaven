import { getAllByTokeAsync, putWithQueryAsync } from "../utils/request";

export const getNotificationsByTokenService = async () => {
  const result = await getAllByTokeAsync("/Notifications/get-by-token");
  return result;
}

export const seenNotificationService = async (id) => {
  const result = await putWithQueryAsync(`/Notifications/seen/${id}`);
  return result;
}

export const seenAllNotificationsService = async (id) => {
  const result = await putWithQueryAsync(`/Notifications/seen-all`);
  return result;
}
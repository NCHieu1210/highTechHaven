import { getAllByTokeAsync } from "../utils/request";

export const getAllUserActionsService = async () => {
  const result = await getAllByTokeAsync("/admin/UserActions");
  return result;
}
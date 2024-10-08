import { getAllAsync } from "../utils/request";

export const getAllCategoriesService = async () => {
  const result = await getAllAsync("/Categories");
  return result;
}
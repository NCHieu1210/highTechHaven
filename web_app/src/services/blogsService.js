import { getAllAsync } from "../utils/request";

export const getAllBlogsService = async () => {
  const result = await getAllAsync("/Blogs");
  return result;
}

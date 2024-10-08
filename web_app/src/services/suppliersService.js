import { getAllAsync } from "../utils/request";

export const getAllSupplierService = async () => {
  const result = await getAllAsync("/Suppliers");
  return result;
}

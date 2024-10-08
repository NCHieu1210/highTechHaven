import { deleteAsync, deleteRangeAsync, getAllAsync, postAsync, putAsync } from "../utils/request";

export const getAllSupplierService = async () => {
  const result = await getAllAsync("/Suppliers");
  return result;
}

export const createSupplierService = async (data) => {
  const result = await postAsync("/admin/Suppliers", data);
  return result;
}

export const updateSupplierService = async (id, data) => {
  const result = await putAsync(`/admin/Suppliers/${id}`, data);
  return result;
}

export const deleteSupplierService = async (data) => {
  const result = await deleteAsync("/admin/Suppliers/" + data);
  return result;
}

export const deleteRangeSupplierService = async (data) => {
  const result = await deleteRangeAsync("/admin/Suppliers/delete-range", data);
  return result;
}
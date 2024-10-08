import { getAllByTokenAsync, deleteAsync, deleteRangeAsync, getAllAsync, postAsync, putAsync, putWithQueryAsync }
  from "../utils/request";

export const getAllProductsService = async () => {
  const result = await getAllByTokenAsync("/admin/Products/");
  return result;
}

export const getProductsByIdService = async (productId) => {
  const result = await getAllAsync(`/Products/${productId}`);
  return result;
}

export const getProductsBySlugService = async (slug) => {
  const result = await getAllAsync(`/Products/${slug}`);
  return result;
}

export const getProductByRangeCategoriesService = async (ids) => {
  let path = `/Products/RangeCategories?ids=${ids[0]}`
  ids.forEach(item => {
    path += `&ids=${item}`
  });
  const result = await getAllAsync(path);
  return result;
}

export const getProductByRangeSuppliersService = async (ids) => {
  let path = `/Products/RangeSuppliers?ids=${ids[0]}`
  ids.forEach(item => {
    path += `&ids=${item}`
  });
  const result = await getAllAsync(path);
  return result;
}

export const getRangeCategoriesAndSuppliersService = async (idsCategory, idsSupplier) => {
  let path = `/Products/range-categories-and-suppliers?idsCategory=${idsCategory[0]}`

  idsCategory[1] && (idsCategory.forEach(item => {
    path += `&idsCategory=${item}`
  }));

  idsSupplier.forEach(item => {
    path += `&idsSupplier=${item}`
  });

  const result = await getAllAsync(path);
  return result;
}

export const getProductBySearchService = async (search) => {
  let path = `/Products/search?search=${search}`
  console.log(path)
  const result = await getAllAsync(path);
  return result;
}

export const getProductsByVariantIdService = async (id) => {
  const result = await getAllAsync(`/Products/get-by-variant-id/${id}`);
  return result;
}


export const createProductService = async (data) => {
  const result = await postAsync("/admin/Products", data);
  return result;
}

export const updateProductService = async (id, data) => {
  const result = await putAsync(`/admin/Products/${id}`, data);
  return result;
}

export const changeProductStatusService = async (productId) => {
  const result = await putWithQueryAsync(`/admin/Products/change-product-status/${productId}`);
  return result;
}

export const deleteProductService = async (data) => {
  const result = await deleteAsync("/admin/Products/" + data);
  return result;
}

export const deleteRangeProductsService = async (data) => {
  const result = await deleteRangeAsync("/admin/Products/delete-range", data);
  return result;
}
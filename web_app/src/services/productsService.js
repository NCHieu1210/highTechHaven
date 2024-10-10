import { getAllAsync } from "../utils/request";

export const getAllProductsService = async () => {
  const result = await getAllAsync("/Products");
  return result;
}

export const getProductBySlugService = async (slug) => {
  const result = await getAllAsync(`/Products/${slug}`);
  return result;
}

export const getProductByVariantsService = async (variantId) => {
  const result = await getAllAsync(`/Products/get-by-variant-id/${variantId}`);
  return result;
}

export const getProductByListProductOptionIdService = async (optionId) => {
  const result = await getAllAsync(`/Products/get-by-product-option-ids?${optionId}`);
  return result;
}


export const getVariantBySlugService = async (slug) => {
  const result = await getAllAsync(`/Products/variant/${slug}`);
  return result;
}

export const getProductByVariantIdService = async (variantId) => {
  const result = await getAllAsync(`/Products/get-by-variant-id/${variantId}`);
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
  const result = await getAllAsync(path);
  return result;
}

export const getProductsByIdService = async (id) => {
  const result = await getAllAsync(`/Products/${id}`);
  return result;
}

export const getProductsByVariantIdService = async (id) => {
  const result = await getAllAsync(`/Products/get-by-variant-id/${id}`);
  return result;
}


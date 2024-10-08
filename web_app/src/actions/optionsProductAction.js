export const arrangeProducts = (values) => {
  return {
    type: "ARRANGE_PRODUCTS",
    values: values
  };
}

export const categoriesIsSelect = (categoriesID) => {
  return {
    type: "CATEGORIES_IS_SELECT",
    categoriesID: categoriesID
  };
}

export const suppliersIsSelect = (suppliersID) => {
  return {
    type: "SUPPLIERS_IS_SELECT",
    suppliersID: suppliersID
  };
}
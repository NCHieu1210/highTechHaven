const initialState = {
  values: 0,
  categoriesID: [],
  suppliersID: []
};

const optionsProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ARRANGE_PRODUCTS":
      return {
        ...state,
        values: action.values,
      };
    case "CATEGORIES_IS_SELECT":
      return {
        ...state,
        categoriesID: action.categoriesID
      };
    case "SUPPLIERS_IS_SELECT":
      return {
        ...state,
        suppliersID: action.suppliersID
      };
    default:
      return state
  }
}
export default optionsProductReducer;
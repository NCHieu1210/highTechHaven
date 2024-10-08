export const setCategoriesData = (categories) => {
  return {
    type: "SET_CATEGORIES_DATA",
    payload: categories,
  };
};

export const setSuppliersData = (suppliers) => {
  return {
    type: "SET_SUPPLIERS_DATA",
    payload: suppliers,
  };
};

export const setProductsData = (products) => {
  return {
    type: "SET_PRODUCTS_DATA",
    payload: products,
  };
};

export const setCartsData = (carts) => {
  return {
    type: "SET_CARTS_DATA",
    payload: carts,
  };
};

export const setFavoritesData = (favorites) => {
  return {
    type: "SET_FAVORITES_DATA",
    payload: favorites,
  };
};

export const setReviewsData = (reviews) => {
  return {
    type: "SET_REVIEWS_DATA",
    payload: reviews,
  };
};

export const setRatingData = (rating) => {
  return {
    type: "SET_RATING_DATA",
    payload: rating,
  };
};

export const setBlogsData = (blogs) => {
  return {
    type: "SET_BLOGS_DATA",
    payload: blogs,
  };
};
export const setPostsData = (prots) => {
  return {
    type: "SET_PORTS_DATA",
    payload: prots,
  };
};

export const CreateOrderData = (orderDataCR) => {
  return {
    type: "CREATE_ORDER_DATA",
    payload: orderDataCR,
  };
};


// export const resetCartData = () => {
//   return {
//     type: "RESET_CART",
//   };
// };
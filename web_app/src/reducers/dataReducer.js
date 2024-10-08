const initialState = {
  categories: [],
  suppliers: [],
  products: [],
  favorites: [],
  reviews: [],
  carts: [],
  orderDataCR: [],
  rating: [],
  blogs: [],
  posts: [],
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CATEGORIES_DATA":
      return {
        ...state,
        categories: action.payload,
      };
    case "SET_SUPPLIERS_DATA":
      return {
        ...state,
        suppliers: action.payload,
      };
    case "SET_PRODUCTS_DATA":
      return {
        ...state,
        products: action.payload,
      };
    case "SET_CARTS_DATA":
      return {
        ...state,
        carts: action.payload,
      };
    case "SET_FAVORITES_DATA":
      return {
        ...state,
        favorites: action.payload,
      };
    case "SET_REVIEWS_DATA":
      return {
        ...state,
        reviews: action.payload,
      };
    case "SET_RATING_DATA":
      return {
        ...state,
        rating: action.payload,
      };
    case "SET_BLOGS_DATA":
      return {
        ...state,
        blogs: action.payload,
      };
    case "SET_PORTS_DATA":
      return {
        ...state,
        posts: action.payload,
      };
    case "CREATE_ORDER_DATA":
      return {
        ...state,
        orderDataCR: action.payload,
      };
    // case "RESET_CART":
    //   return {
    //     ...state,
    //     carts: [],
    //   };
    default:
      return state;
  }
};

export default dataReducer;
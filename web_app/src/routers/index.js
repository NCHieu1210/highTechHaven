import UserLayoutDefault from "../layout/UserDefaultLayout";
import Error404 from "../pages/Error404";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRouter from "../components/Routers/PrivateRouter";
import Logout from "../pages/Auth/Logout";
import LoginWithGoogle from "../pages/Auth/Login/LoginWithGoogle";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import ProductsDetail from "../pages/Products/ProductsDetail";
import UserDetailsLayout from "../layout/UserDetailsLayout";
import UserDetails from "../pages/UserDetails";
import FavouriteProduct from "../pages/Favourite";
import DeliveryAddress from "../pages/DeliveryAddress";
import ListProductsLayout from "../layout/ListProductsLayout";
import Product from "../pages/Products";
import Categories from "../pages/Categories";
import Suppliers from "../pages/Suppliers";
import Search from "../pages/Search";
import Post from "../pages/Posts";
import PostDetail from "../pages/Posts/PostDetail";
import CheckOut from "../pages/Cart/CheckOut";
import Payment from "../pages/Order/Payment";
import Orders from "../pages/Order";
import OrderHistory from "../pages/Order/OrderHistory";
import ResetPassword from "../pages/Auth/ResetPassword";

export const routes = [
  {
    // Public Routes
    path: "/",
    element: <UserLayoutDefault />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/login-with-google",
        element: <LoginWithGoogle />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/logout",
        element: <Logout />
      },
      {
        path: "/reset-password",
        element: <ResetPassword />
      },
      {
        path: "/products/:slug",
        element: <ProductsDetail />
      },
      {
        path: "/posts",
        element: <Post />
      },
      {
        path: "/post/:slug",
        element: <PostDetail />
      },
      {
        path: "/orders/payment",
        element: <Payment />
      },
      {
        path: "/products",
        element: <ListProductsLayout />,
        children: [
          {
            path: "/products",
            element: <Product />
          },
          {
            path: "/products/categories/:slug",
            element: <Categories />
          },
          {
            path: "/products/suppliers/:slug",
            element: <Suppliers />
          },
          {
            path: "/products/search/:search",
            element: <Search />
          }
        ]
      },
      {
        path: "/",
        element: <PrivateRouter />,
        children: [
          {
            path: "/user/",
            element: <UserDetailsLayout />,
            children: [
              {
                path: "/user/detail",
                element: <UserDetails />
              },
              {
                path: "/user/delivery-address",
                element: <DeliveryAddress />
              },
              {
                path: "/user/orders",
                element: <Orders />
              },
              {
                path: "/user/orders-history",
                element: <OrderHistory />
              },
              {
                path: "/user/favorites",
                element: <FavouriteProduct />
              }
            ]
          },
          {
            path: "/cart",
            element: <Cart />
          },
          {
            path: "/cart/check-out",
            element: <CheckOut />
          }
        ]
      }
    ]
  },
  ,
  // END Private for Admin routes
  {
    path: "*",
    element: <Error404 />
  }
]
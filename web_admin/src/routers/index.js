import { Navigate } from "react-router-dom";
import RouterSettings from "../components/Routers/RouterSettings";
import DefaultLayout from "../layout/DefaultLayout";
import Error404 from "../pages/Error404";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Trash from "../pages/Trash";
import UserActions from "../pages/UserActions";
import Users from "../pages/Users";
import Blogs from "../pages/Blogs";
import Posts from "../pages/Posts";
import CreatePosts from "../pages/Posts/CreatePosts";
import UpdatePosts from "../pages/Posts/UpdatePosts";
import Suppliers from "../pages/Suppliers";
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import CreateProducts from "../pages/Products/CreateProducts";
import UpdateProducts from "../pages/Products/UpdateProducts";
import ReviewProducts from "../pages/Reviews";
import Orders from "../pages/Orders";
import UnconfirmedOrder from "../pages/Orders/UnconfirmedOrder";
import ProcessingOrder from "../pages/Orders/ProcessingOrder";
import CompletedOrder from "../pages/Orders/CompletedOrder";
import CancelledOrder from "../pages/Orders/CancelledOrder";
import Comments from "../pages/Comments";
import Dashboard from "../pages/Dashboard";

export const routes = [
  {
    path: "/admin",
    element: <RouterSettings />,
    children: [
      {
        path: "/admin",
        element: <DefaultLayout />,
        children: [
          {
            path: "",
            element: <Navigate to="/admin/dashboard" replace />
          },
          {
            path: "/admin/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/admin/user-actions",
            element: <UserActions />,
          },
          {
            path: "/admin/products",
            element: <Products />,
          },
          {
            path: "/admin/products/create",
            element: <CreateProducts />,
          },
          {
            path: "/admin/reviews",
            element: <ReviewProducts />,
          },
          {
            path: "/admin/comments",
            element: <Comments />,
          },
          {
            path: "/admin/products/update/:slug",
            element: <UpdateProducts />,
          },
          {
            path: "/admin/suppliers",
            element: <Suppliers />,
          },
          {
            path: "/admin/categories",
            element: <Categories />,
          },
          {
            path: "/admin/users",
            element: <Users />,
          },
          {
            path: "/admin/trash",
            element: <Trash />,
          },
          {
            path: "/admin/orders",
            element: <Orders />,
          },
          {
            path: "/admin/orders/unconfirmed",
            element: <UnconfirmedOrder />,
          },
          {
            path: "/admin/orders/processing",
            element: <ProcessingOrder />,
          },
          {
            path: "/admin/orders/completed",
            element: <CompletedOrder />,
          },
          {
            path: "/admin/orders/cancelled",
            element: <CancelledOrder />,
          },
          {
            path: "/admin/blogs",
            element: <Blogs />,
          },
          {
            path: "/admin/posts",
            element: <Posts />,
          },
          {
            path: "/admin/posts/create",
            element: <CreatePosts />,
          },
          {
            path: "/admin/posts/update/:slug",
            element: <UpdatePosts />,
          }
        ]
      }
    ]
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  ,
  {
    path: "/admin/logout",
    element: <Logout />
  },
  {
    path: "/",
    element: <Navigate to="/admin" replace />
  },
  {
    path: "*",
    element: <Error404 />
  },
]
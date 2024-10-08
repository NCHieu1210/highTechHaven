import { useRoutes } from "react-router-dom";
import { routes } from "../../../routers";

const AllRouter = () => {
  const elements = useRoutes(routes); // useRoutes
  return (
    <>
      {elements}
    </>
  );
}

export default AllRouter;
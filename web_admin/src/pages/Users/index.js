import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRolesService, getAllUserService } from "../../services/usersService";
import { Button, Spin } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import CreateUsers from "./CreateUsers";
import { reRender } from "../../actions/reRender";
import UsersGridStyle from "./UsersGridStyle";
import UsersTableStyle from "./UsersTableStyle";
import "../../baseSCSS/App.scss";

const Users = () => {
  const [responseAPI, setResponseAPI] = useState();
  const [roles, setRoles] = useState();
  const [isGrid, setIsGrid] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispath = useDispatch();
  const isReRender = useSelector(state => state.reRender);

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const response = await getAllUserService();
        const sortedData = response.data.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        setResponseAPI(sortedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    setTimeout(() => {
      getAllUser();
    }, 200);
    if (isReRender) {
      dispath(reRender(false));
    }
  }, [isReRender, dispath]);

  //Call API get roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllRolesService();
        setRoles(response.data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 200);
  }, [])
  //END Call API get roles//Call API get roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllRolesService();
        setRoles(response.data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 200);
  }, [])
  //END Call API get roles
  return (
    <>
      <div className="admin">
        <div className='admin__header admin__headerUser' >
          <div>
            <h1>Danh sách tài khoản</h1>
          </div>
          <div>
            <Button onClick={() => setIsGrid(true)} className={`${isGrid ? "admin__headerUser--active" : ""}`}>
              <AppstoreOutlined />
            </Button>
            <Button onClick={() => setIsGrid(false)} className={`${!isGrid ? "admin__headerUser--active" : ""}`}>
              <UnorderedListOutlined />
            </Button>
            {/* <DeleteRangeSuppliers selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeSuppliers> */}
            <CreateUsers roles={roles}></CreateUsers>
          </div>
        </div>
        <br></br>
        <div className="admin__body">
          <Spin spinning={loading}>
            {isGrid ?
              (<UsersGridStyle responseAPI={responseAPI} roles={roles} ></UsersGridStyle>) :
              (<UsersTableStyle responseAPI={responseAPI} roles={roles}  ></UsersTableStyle>)}
          </Spin>
        </div>
      </div >
    </>
  );
};
export default Users;
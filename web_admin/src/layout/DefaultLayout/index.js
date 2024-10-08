import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UserOutlined,
  DesktopOutlined,
  ContainerOutlined,
  DeleteOutlined,
  LogoutOutlined,
  HomeOutlined,
  FieldTimeOutlined,
  AuditOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import { Button, FloatButton, Layout, Menu, theme, Tooltip } from 'antd';
import "./DefaultLayout.scss";
import { getUserByTokenService } from "../../services/usersService";
import { getPathImage } from "../../helpers/getPathImage";
import logoWebsite from "../../assets/images/logoWebsite.jpg";
import AdminBreadcrumb from "../../components/AdminBreadcrumb";
import { getDomainName_Client } from "../../helpers/getDomainName_Client";
import Notification from "../../components/Notification";
const { Header, Sider, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const DefaultLayout = () => {
  const [isShow, setIsShow] = useState(false);
  const location = useLocation();

  //Ant Design
  const [collapsed, setCollapsed] = useState(false);
  //ENDAnt Design

  //Call API
  const [responseAPI, setResponseAPI] = useState();
  const [pathImage, setPathImage] = useState("");

  useEffect(() => {
    try {
      const fetchAPI = async () => {
        const respone = await getUserByTokenService();
        setResponseAPI(respone);
        setPathImage(getPathImage(respone.data.avatar));
      }
      fetchAPI();
    }
    catch (error) {
      console.log(error);
    }
  }, [])
  //END Call API

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    getItem(<NavLink to="/admin/">Thống Kê</NavLink>, '1', <PieChartOutlined />),
    getItem('Đơn hàng', 'sub1', <ContainerOutlined />, [
      getItem(<NavLink to="/admin/orders/">Tất cả</NavLink>, '2'),
      getItem(<NavLink to="/admin/orders/unconfirmed">Chưa xác nhận</NavLink>, '3'),
      getItem(<NavLink to="/admin/orders/processing">Đang xử lý</NavLink>, '4'),
      getItem(<NavLink to="/admin/orders/completed">Đã hoàn thành</NavLink>, '5'),
      getItem(<NavLink to="/admin/orders/cancelled">Đã hủy</NavLink>, '6'),
    ]),
    getItem('Sản phẩm', 'sub2', <DesktopOutlined />, [
      getItem(<NavLink to="/admin/products">Sản phẩm</NavLink>, '8'),
      getItem(<NavLink to="/admin/categories">Danh mục</NavLink>, '9'),
      getItem(<NavLink to="/admin/suppliers">Hãng sản xuất</NavLink>, '10'),
    ]),
    getItem('Bài viết', 'sub3', <AuditOutlined />, [
      getItem(<NavLink to="/admin/posts">Bài viết</NavLink>, '11'),
      getItem(<NavLink to="/admin/blogs">Chuyên mục</NavLink>, '12'),
    ]),
    getItem('CSKH', 'sub4', <CustomerServiceOutlined />, [
      getItem(<NavLink to="/admin/reviews">Đánh giá</NavLink>, '13'),
      getItem(<NavLink to="/admin/comments">Bình luận</NavLink>, '14'),
    ]),
    getItem(<NavLink to="/admin/users">Tài Khoản</NavLink>, '15', <UserOutlined />),
    getItem(<NavLink to="/admin/user-actions">Lịch sử</NavLink>, '16', <FieldTimeOutlined />),
    getItem(<NavLink to="/admin/trash">Thùng rác</NavLink>, '17', <DeleteOutlined />),
  ];
  //END Ant Design

  const isShowSider = (isShow) => {
    return isShow ? "adminLayout__sider" : "adminLayout__sider--show";
  }

  const iShowHeadSider = (iShow) => {
    return iShow ? "adminLayout__headerSider" : "adminLayout__headerSider--show";
  }

  const iShowFooterSider = (iShow) => {
    return iShow ? "adminLayout__footerSider" : "adminLayout__footerSider--show";
  }

  const pathToKeyMap = {

    '/admin/orders/unconfirmed': '3',
    '/admin/orders/processing': '4',
    '/admin/orders/completed': '5',
    '/admin/orders/cancelled': '6',
    '/admin/orders/': '2',
    '/admin/products': '8',
    '/admin/categories': '9',
    '/admin/suppliers': '10',
    '/admin/posts': '11',
    '/admin/blogs': '12',
    '/admin/reviews': '13',
    '/admin/comments': '14',
    '/admin/users': '15',
    '/admin/user-actions': '16',
    '/admin/trash': '17'
  };
  // Xác định mục được chọn dựa trên URL hiện tại
  const getSelectedKeys = () => {
    const matchingPath = Object.keys(pathToKeyMap).find(path => location.pathname.startsWith(path));
    return matchingPath ? [pathToKeyMap[matchingPath]] : ['1']; // Mục mặc định
  };
  //END Xác định mục được chọn dựa trên URL hiện tại

  return (
    <>
      <div className="adminLayout">
        <Layout>
          <div className={isShowSider(isShow)} >
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              width={256}
            >
              <div className={iShowHeadSider(isShow)}>
                <img src={logoWebsite} alt="logo" />
                <h5>HTHaven</h5>
              </div>
              <br></br>
              <Menu
                theme="light"
                mode="inline"
                selectedKeys={getSelectedKeys()}
                items={items}
              />
              {responseAPI &&
                (
                  <div>
                    <div className={iShowFooterSider(isShow)}>
                      <div>
                        <img src={pathImage} alt="avatar"></img>
                      </div>
                      <div>
                        <h5>{`${responseAPI.data.firstName}  ${responseAPI.data.lastName}`}</h5>
                        <em>{responseAPI.data.email}</em>
                      </div>
                    </div>
                  </div>
                )}
            </Sider>
          </div>
          <Layout>
            {/* Header =========================================*/}
            <Header
              style={{
                position: 'sticky',
                top: 0,
                padding: 0,
                background: colorBgContainer,
              }}
            >
              <div className="adminLayout__header">
                <div className="adminLayout__header--left">
                  <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => (setCollapsed(!collapsed), setIsShow(!isShow))}
                    style={{
                      fontSize: '16px',
                      width: 64,
                      height: 64,
                    }}
                  />
                  <AdminBreadcrumb></AdminBreadcrumb>
                </div>
                <div className="adminLayout__header--right">
                  <ul>
                    <li>
                      <Notification />
                    </li>
                    <li>
                      <a href={getDomainName_Client()} target="_blank">
                        <Tooltip title="Trang chủ">
                          <Button><HomeOutlined />Trang chủ</Button>
                        </Tooltip>
                      </a>
                    </li>
                    <li>
                      <Tooltip title="Đăng xuất">
                        <NavLink to="/admin/logout"><Button><LogoutOutlined />Đăng xuất</Button></NavLink>
                      </Tooltip>
                    </li>
                  </ul>
                </div>
              </div>
            </Header>
            {/*END Header========================================= */}

            <Content
              style={{
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet></Outlet>
            </Content>
          </Layout>
          <FloatButton.BackTop visibilityHeight={0} />
        </Layout >

      </div >
    </>

  );
};

export default DefaultLayout;
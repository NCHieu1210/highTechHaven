import React, { useEffect, useState } from "react";
import { CarOutlined, FieldTimeOutlined, HeartOutlined, SnippetsOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Space, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./UserDetailsLayout.scss";
import ChangePassword from "../../pages/UserDetails/ChangePassword";


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const UserDetailsLayout = () => {
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  window.scrollTo(0, 0);

  const [isTablet, setIsTablet] = useState(false);
  const handleResize = () => {
    setIsTablet(window.innerWidth <= 1024); // Thay đổi kích thước này theo nhu cầu của bạn
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    getItem(<NavLink to="/user/detail"> <UserOutlined />{!isTablet && <span>&nbsp;Thông tin</span>}</NavLink>, '1'),
    getItem(<NavLink to="/user/delivery-address"><SnippetsOutlined />{!isTablet && <span>&nbsp;Thông tin giao hàng</span>}</NavLink>, '2'),
    getItem(<NavLink to="/user/orders"><CarOutlined />{!isTablet && <span>&nbsp;Tra cứu đơn hàng</span>}</NavLink>, '3'),
    getItem(<NavLink to="/user/orders-history"><FieldTimeOutlined />{!isTablet && <span>&nbsp;Lịch sử mua hàng</span>}</NavLink>, '4'),
    getItem(<NavLink to="/user/favorites"><HeartOutlined />{!isTablet && <span>&nbsp;Sản phẩm yêu thích</span>}</NavLink>, '5'),
    getItem(<ChangePassword isTablet={isTablet} />, '6'),
  ];

  const pathToKeyMap = {
    '/user/detail': '1',
    '/user/delivery-address': '2',
    '/user/orders-history': '4',
    '/user/orders': '3',
    '/user/favorites': '5'
  };

  // Xác định mục được chọn dựa trên URL hiện tại
  const getSelectedKeys = () => {
    const matchingPath = Object.keys(pathToKeyMap).find(path => location.pathname.startsWith(path));
    return matchingPath ? [pathToKeyMap[matchingPath]] : ['1']; // Mục mặc định
  };
  //END Xác định mục được chọn dựa trên URL hiện tại

  //END Call api

  return (
    <>
      <div className="userDetailsLayout">
        <Layout>
          {isTablet ?
            (<Space.Compact>
              <Menu
                mode="inline"
                selectedKeys={getSelectedKeys()}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{
                  height: '100%'
                }}
                items={items}
              />
            </Space.Compact>) :
            (<div className="userDetailsLayout__sider">
              <Sider
                width={250}
              >
                <Menu
                  mode="inline"
                  selectedKeys={getSelectedKeys()}
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{
                    height: '100%'
                  }}
                  items={items}
                />
              </Sider>
            </div>)
          }
          <Content className="userDetailsLayout__content">
            <Outlet />
          </Content>
        </Layout >
      </div >
    </>
  )
};

export default UserDetailsLayout;

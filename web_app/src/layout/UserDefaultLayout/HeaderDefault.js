import React from 'react';
import { Button, Space } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';
import logoWebsite from "../../assets/images/logoWebsite.jpg";
import logoWebsite2 from "../../assets/images/logoCopy.png";
import CategoriesLayout from '../../components/HeaderLayout/CategoriesLayout';
import ContainUserHeader from './ContainUserHeader';
import SearchForm from '../../components/HeaderLayout/SearchForm';


const HeaderDefault = () => {
  return (
    <>
      <Header className=" userlayout__header userlayout__header--top" style={{
        headerPadding: 0,
        display: 'flex',
        alignItems: 'center',
      }}
      >
        <Space className='header'>
          {/* Trang chủ */}
          <NavLink key={1} to="/">
            <div className='header__logo'>
              <img alt="logo" src={logoWebsite}></img>
              <h2 className='header__setHide'>HT Haven</h2>
            </div>
          </NavLink>
          {/* END trang chủ */}

          {/* Ô tìm kiếm */}
          <div className="header__searchBar">
            <SearchForm></SearchForm>
          </div>
          {/* END ô tìm kiếm */}

          {/* Số điện thoại */}
          <div className='header__phone'>
            <a href='tel:039903378'>
              <Button >
                <div>
                  <PhoneOutlined />
                </div>
                <div>
                  <p>whatsapp:</p>
                  <strong>039903378</strong>
                </div>
              </Button>
            </a>
          </div>
          {/* END Số điện thoại */}
          {/* <li>
            <NavLink key={2} to="/login">Login</NavLink>
          </li> */}
        </Space>
      </Header>

      <Header className=" userlayout__header userlayout__header--bottom" style={{
        headerPadding: 0,
        display: 'flex',
        alignItems: 'center',
      }}
      >
        <CategoriesLayout></CategoriesLayout>
        <ContainUserHeader></ContainUserHeader>
      </Header>
    </>
  )
};

export default HeaderDefault;

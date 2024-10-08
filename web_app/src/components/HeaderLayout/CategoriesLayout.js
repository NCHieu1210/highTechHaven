import React, { useEffect, useState } from 'react';
import { AlignLeftOutlined, DownOutlined, RightOutlined, SoundOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { getAllCategoriesAsync } from '../../services/categoriesService';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoriesData } from '../../actions/dataAction';


const CategoriesLayout = () => {
  const [items, setItems] = useState([]);
  const categories = useSelector(state => state.data.categories);

  useEffect(() => {
    if (categories) {
      const menuItems = buildMenuItems(categories);
      setItems(menuItems);
    }
  }, [categories])

  const buildMenuItems = (categories) => {
    const menuItems = [];
    const categoryMap = new Map();


    categories.map((item, index) => {
      menuItems.push({
        key: index,
        label: <NavLink to={`/products/categories/${item.slug}`}>{item.name}</NavLink>,
        children: item.subCategories.length > 0 && (
          item.subCategories.map((subCategory, index) => {
            return {
              key: `sub-${index}`,
              label: <NavLink to={`/products/categories/${subCategory.slug}`}>{subCategory.name}</NavLink>,
            };
          })
        )
      })
    });

    menuItems.push({
      key: 'more',
      label: <NavLink to={`/Products`}>Tất Cả Sản Phẩm</NavLink>,
    })
    return menuItems;
  };

  return (
    <>
      <Space >
        <div className='bottom__categories'>
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
            overlayClassName="dropdown-one"
          >
            <Button onClick={(e) => e.preventDefault()}>
              <div className='bottom__categories--btn'>
                <AlignLeftOutlined />
                <span className='categories__text'>Danh mục</span>
                <span className='header__setHide'>&nbsp;sản phẩm</span>
              </div>
            </Button>
          </Dropdown>
        </div>
        <div className='bottom__posts '>
          <NavLink to="/posts">
            <Button >
              <div>
                <SoundOutlined />&nbsp;&nbsp;
                <span>Tin Tức</span>
              </div>
            </Button>
          </NavLink>
        </div>
      </Space>
    </>
  )
}

export default CategoriesLayout;
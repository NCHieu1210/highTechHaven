import { FilterOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Cascader, Drawer, Layout, Select, Space, Tree } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useParams } from "react-router-dom";
import './UserListProductLayout.scss'
import { arrangeProducts, categoriesIsSelect, suppliersIsSelect } from "../../actions/optionsProductAction";
import Filter from "./Filter";

const ListProductsLayout = () => {

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const [title, setTitle] = useState('');
  const categories = useSelector((state) => state.data.categories);
  const suppliers = useSelector((state) => state.data.suppliers);
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const url = location.pathname;
  const [open, setOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const handleResize = () => {
    setIsTablet(window.innerWidth <= 1024); // Thay đổi kích thước này theo nhu cầu của bạn
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buildTreeCategories = (categories) => {
    const roots = [];
    categories.forEach(category => {
      roots.push({
        title: category.name,
        key: `category_${category.id}`,
        children: category.subCategories.length > 0 && category.subCategories.map(subCategory => ({
          title: subCategory.name,
          key: `category_${subCategory.id}`,
        })),
      });
    });
    return roots;
  }

  const buildTreeSuppliers = (suppliers) => {
    const roots = [];
    suppliers.forEach(suppliers => {
      roots.push({
        title: suppliers.name,
        key: `supplier_${suppliers.id}`,
      });
    });
    return roots;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const listCategories = buildTreeCategories(categories);
      const listSuppliers = buildTreeSuppliers(suppliers);
      if (url.includes('/products/categories')) {
        let category = categories.find(category => category.slug === params.slug);
        category && setTitle(category.name.toUpperCase());
        if (category === undefined) {
          categories.map(item => {
            if (item.subCategories.find(subCategory => subCategory.slug === params.slug)) {
              category = item.subCategories.find(subCategory => subCategory.slug === params.slug);
              setTitle(category.name.toUpperCase());
            }
          })
        }
        setTreeData([
          {
            title: 'Hãng sản xuất',
            key: `supplier_-2`,
            children: listSuppliers
          }
        ]);
      }
      else if (url.includes('/products/suppliers')) {
        const supplier = suppliers.find(supplier => supplier.slug === params.slug);
        setTitle(supplier.name.toUpperCase());
        setTreeData([
          {
            title: 'Danh mục sản phẩm',
            key: "category_-1",
            children: listCategories
          }
        ]);
      }
      else if (url.includes('/products/search')) {
        setTreeData([])
      }
      else {
        setTreeData([
          {
            title: 'Danh mục sản phẩm',
            key: "category_-1",
            children: listCategories
          },
          {
            title: 'Hãng sản xuất',
            key: `supplier_-2`,
            children: listSuppliers
          }
        ]);
      }

    } catch (error) {
      console.error('Failed to fetch categories and suppliers:', error);
    }
  }, [params, categories, suppliers, url]);


  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    // Separate category and supplier keys
    const categoryKeys = checkedKeysValue.filter(key => key.startsWith('category_')).map(key => key.split('_')[1]);
    const supplierKeys = checkedKeysValue.filter(key => key.startsWith('supplier_')).map(key => key.split('_')[1]);

    dispatch(categoriesIsSelect(categoryKeys));
    dispatch(suppliersIsSelect(supplierKeys));
  };
  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  //END bộ lọc


  //sắp xếp
  const options = [
    {
      value: '0',
      label: 'Mặc định',
    },
    {
      value: '1',
      label: 'Giá từ cao tới thấp',
    },
    {
      value: '2',
      label: 'Giá từ thấp tới cao',
    },
    {
      value: '3',
      label: 'Giảm giá',
    }
  ]
  const handleChange = (value) => {
    dispatch(arrangeProducts(value));
  };
  //END sắp xếp

  //Drawer
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  //END Drawer

  return (
    <>
      <div className="userListPructsLayout">
        <div className="userListPructsLayout__title">
          <Space.Compact>
            <>
              {url.includes('/Products') && <h1>TẤT CẢ SẢN PHẨM</h1>}
              {url.includes('/products/categories') && <h1><p>DANH MỤC</p> {title}</h1>}
              {url.includes('/products/suppliers') && <h1><p>HÃNG SẢN XUẤT</p> {title}</h1>}
              {url.includes('/products/search') && <h1>KẾT QUẢ TÌM KIẾM</h1>}
            </>
            {isTablet &&
              <>
                <Button className="btn__filter" onClick={showDrawer}>
                  <FilterOutlined /> Bộ lọc
                </Button>
                <br></br>
                <Drawer title={<><FilterOutlined /> Bộ lọc</>} onClose={onClose} open={open} width={300} >
                  <Filter
                    autoExpandParent={autoExpandParent}
                    selectedKeys={selectedKeys}
                    handleChange={handleChange}
                    expandedKeys={expandedKeys}
                    checkedKeys={checkedKeys}
                    onExpand={onExpand}
                    onSelect={onSelect}
                    treeData={treeData}
                    onCheck={onCheck}
                    options={options}
                    url={url}
                  >
                  </Filter>
                </Drawer>
              </>
            }
          </Space.Compact>
          <br></br>
          <hr></hr>
          <br></br>
        </div>
        <Layout>
          <div className="layout">
            {!isTablet && <div className="layout__filter">
              <Filter
                autoExpandParent={autoExpandParent}
                selectedKeys={selectedKeys}
                handleChange={handleChange}
                expandedKeys={expandedKeys}
                checkedKeys={checkedKeys}
                onExpand={onExpand}
                onSelect={onSelect}
                treeData={treeData}
                onCheck={onCheck}
                options={options}
                url={url}
              >
              </Filter>
            </div>}
            <div className="layout__content">
              <Content>
                <Outlet />
              </Content>
            </div >
          </div >
        </Layout >
      </div >
    </>
  )
};
export default ListProductsLayout;
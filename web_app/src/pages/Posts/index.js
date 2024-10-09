import { Avatar, Button, Drawer, Layout, List, Pagination, Space, Tree } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import '../../layout/ListProductsLayout'
import { getAllBlogsService } from "../../services/blogsService";
import { getPathImage } from "../../helpers/getPathImage";
import "./Posts.scss";
import parse from 'html-react-parser';
import { EyeOutlined, FieldTimeOutlined, FilterOutlined } from "@ant-design/icons";
import moment from "moment";

const Post = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [treeData, setTreeData] = useState([]);
  const postStore = useSelector(state => state.data.posts);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);

  const [isTablet, setIsTablet] = useState(false);
  const handleResize = () => {
    setIsTablet(window.innerWidth <= 1024); // Thay đổi kích thước này theo nhu cầu của bạn
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getBlogs = async () => {
      const res = await getAllBlogsService();
      if (res.success) {
        setBlogs(res.data);
      }
    }
    getBlogs();
    setPosts(postStore);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const listBlogs = blogs.map(blog => (
        {
          title: blog.name,
          key: `${blog.id}`,
        }));
      setTreeData([{
        title: 'Tất cả',
        key: '-1',
      }, ...listBlogs]);
    } catch (error) {
      console.error('Failed to fetch categories and suppliers:', error);
    }
  }, [blogs]);


  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = (checkedKeysValue) => {
    console.log(checkedKeysValue)
    setCheckedKeys(checkedKeysValue);
    if (checkedKeysValue.find(key => key === '-1')) {
      setPosts(postStore);
    }
    else {
      const postKeys = postStore.filter(post =>
        post.blogID !== null && checkedKeysValue.includes(post.blogID.toString())
      );
      setPosts(postKeys);
    }
  };
  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  //END bộ lọc
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  const paginatedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  //END Pagination

  const getParamsByStatus = (arr, key, value) => {
    const foundObj = arr.find(obj => obj.name === key); // Sử dụng find để tìm đối tượng
    if (foundObj) {
      return foundObj[value]; // Trả về giá trị của thuộc tính nếu tìm thấy
    }
    return null; // Trả về null nếu không tìm thấy
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
            <h1>TIN TỨC MỚI</h1>
            {isTablet &&
              <>
                <Button className="btn__filter" onClick={showDrawer}>
                  <FilterOutlined /> Bộ lọc
                </Button>
                <br></br>
                <Drawer title={<><FilterOutlined /> Bộ lọc</>} onClose={onClose} open={open} width={300} >
                  <h2>Chuyên mục bài viết</h2>
                  <br></br>
                  <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={treeData}
                  />
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
            {!isTablet &&
              <div className="layout__sidebar">
                <h2>Chuyên mục bài viết</h2>
                <br></br>
                <Tree
                  checkable
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={onCheck}
                  checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                  treeData={treeData}
                />
              </div>
            }
            <div className="layout__content">
              <Content>
                {paginatedPosts &&
                  <List
                    className="layout__content--post"
                    itemLayout="horizontal"
                    dataSource={paginatedPosts}
                    renderItem={(item, index) => (
                      <NavLink to={`/post/${item.slug}`}>
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar className="content__avatar" src={getPathImage(item.thumbnail)} alt={item.name} />}
                            title={<h2>{item.name}</h2>}
                            description={
                              <>
                                <div className="content__description">{parse(item.content)}</div>
                                <div className="content__footer">
                                  <div>
                                    <Space>
                                      <Avatar src={getPathImage(getParamsByStatus(item.postStatus, "Created", "avatar"))}></Avatar>
                                      <em>{getParamsByStatus(item.postStatus, "Created", "userFullName")}</em>
                                    </Space>
                                  </div>
                                  <div>
                                    <Space>
                                      <EyeOutlined />
                                      <em> {item.views} Lượt xem</em>
                                    </Space>
                                  </div>
                                  <div>
                                    <Space>
                                      <FieldTimeOutlined />
                                      <em>
                                        {moment.utc(getParamsByStatus(item.postStatus, "Created", "date")).
                                          utcOffset("+07:00").format("HH:mm - DD/MM/YYYY")}
                                      </em>
                                    </Space>
                                  </div>
                                </div>
                              </>
                            }
                          />
                        </List.Item>
                      </NavLink>
                    )}
                  />}
                <br></br>
                <Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '7px' }}
                  current={currentPage}
                  pageSize={pageSize}
                  total={posts.length}
                  onChange={handlePageChange}
                />
                <br></br>
                <br></br>
                <br></br>
              </Content>
            </div >
          </div >
        </Layout >
      </div >
    </>
  )
}

export default Post;
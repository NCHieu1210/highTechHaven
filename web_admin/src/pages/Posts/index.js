import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPostsService } from "../../services/postsService";
import { reRender } from "../../actions/reRender";
import { Button, Spin, Table, Tag } from "antd";
import { getPathImage } from "../../helpers/getPathImage";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import DeleteRangePosts from "./DeleteRangePosts";
import DeletePosts from "./DeletePosts";
import PostDetail from "./PostDetail";
import { getParamsByStatus } from "../../helpers/getParamsByStatus";

const Posts = () => {
  const [responseAPI, setResponseAPI] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();

  //Call API
  useEffect(() => {
    setLoading(true);
    const getAllPost = async () => {
      try {
        const response = await getAllPostsService();
        response.data.reverse();
        setResponseAPI(response.data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    setTimeout(() => {
      getAllPost();
    }, 200);

    if (isReRender) {
      dispatch(reRender(false));
    }
    setLoading(false);
  }, [isReRender]);
  //END Call API

  //Set colums
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageAvatar',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'name',
      width: '40%',
    },
    {
      title: 'Tác giả',
      dataIndex: 'userCreate',
    },
    {
      title: 'Ngày viết bài',
      dataIndex: 'createDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Chức năng',
      dataIndex: 'function',
      width: '10%',
      render: (_, record) => {
        return (
          <div>
            {/* Xem chi tiết */}
            <PostDetail postSlug={record.slug} ></PostDetail>
            {/* Xem chi tiết */}
            {/* Chỉnh sửa bài viết */}
            <NavLink to={`/admin/posts/update/${record.slug}`}>
              <Button shape="circle" className="btn__edit" >
                <EditOutlined />
              </Button>
            </NavLink>
            {/* END chỉnh sửa sản phảm */}

            {/* Xóa sản phẩm */}
            <DeletePosts productId={record.key} nameProduct={record.name}></DeletePosts>
            {/* END xóa sản phẩm */}

          </div >
        );
      }
    },
  ];
  //END set colums

  //Ant Design
  //Set data to table
  const data = [];
  responseAPI && (responseAPI.map((item) => {
    data.push({
      key: item.id,
      name: item.name,
      slug: item.slug,
      content: item.content,
      imageAvatar: item.thumbnail ? (<img src={getPathImage(item.thumbnail)} style={{ width: "70px", height: "auto", borderRadius: "10px" }} alt={item.name}></img>) : <Tag color="magenta">Không có ảnh!</Tag>,
      createDate: moment.utc(item.createDate).utcOffset('+07:00').format('HH:mm - DD/MM/YYYY '),
      userCreate: getParamsByStatus(item.postStatus, "Created", "userFullName"),
      updateDate: moment.utc(getParamsByStatus(item.postStatus, "Created", "date")).utcOffset('+07:00').format('HH:mm - DD/MM/YYYY '),
      views: item.views,
      status: item.status ? <Tag color="green" style={{ minWidth: "125px" }}>Công khai</Tag> : <Tag color="red" style={{ minWidth: "125px" }}>Ẩn</Tag>,
      blog: item.blog || <Tag color="magenta">Trống nhà sản xuất!</Tag>
    })
  }))
  //END Set data to table

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  //END Ant Design

  //End set data to table

  return (
    <>
      <div className='admin'>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div className='admin__header' >
            <h1>DANH SÁCH BÀI VIẾT</h1>
            <div>
              <DeleteRangePosts selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangePosts>
              <NavLink to="/admin/posts/create">
                <Button type="primary" className='admin__button admin__button--add'>
                  <PlusOutlined /> Thêm mới
                </Button></NavLink>
            </div>
          </div>
        </div>
        <br></br>
        <Spin spinning={loading}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={data} size='small' pagination={{ position: ['bottomCenter'] }} />
        </Spin>
        {/* pagination={{ position: ['bottomCenter'] }}  */}
      </div>
    </>
  )
}
export default Posts
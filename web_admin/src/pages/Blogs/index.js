import { Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../actions/reRender";
import { getAllBlogsService } from "../../services/blogsService";
import UpdateBlogs from "./UpdateBlogs";
import DeleteBlogs from "./DeleteBlogs";
import CreateBlogs from "./CreateBlogs";
import DeleteRangeBlgos from "./DeleteRangeBlogs";


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Lượng bài viết',
    dataIndex: 'quantityPosts',
  },
  {
    title: 'Chức năng',
    dataIndex: 'function',
    width: '15%',
    render: (_, record) => {
      return (
        <div>
          <UpdateBlogs blog={record} ></UpdateBlogs>
          <DeleteBlogs blogsId={record.key}></DeleteBlogs>
        </div >
      );
    }
  },
];
const Blogs = () => {
  const [responseAPI, setResponseAPI] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();

  //Call api
  useEffect(() => {

    const getAllBLogs = async () => {
      try {
        const response = await getAllBlogsService();
        response.data.reverse();
        setResponseAPI(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    setTimeout(() => {
      getAllBLogs();
    }, 200);

    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender]);
  //END Call api

  //AntDesign
  const data = [];
  responseAPI && (responseAPI.map((index) => {
    data.push({
      key: index.id,
      name: index.name,
      quantityPosts: `${index.quantityPosts} Bài viết`,
    })
  }))


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
  //END AntDesign

  return (
    <div>
      <div className='admin'>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div className='admin__header' >
            <h1>DANH SÁCH CHUYÊN MỤC</h1>
            <div>
              <DeleteRangeBlgos selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeBlgos>
              <CreateBlogs></CreateBlogs>
            </div>
          </div>
        </div>
        <Spin spinning={loading}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={data} size='small' pagination={{ position: ['bottomCenter'] }} />
        </Spin>
        {/* pagination={{ position: ['bottomCenter'] }}  */}
      </div>
    </div>
  );
};
export default Blogs;
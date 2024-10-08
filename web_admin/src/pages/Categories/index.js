import React, { useEffect, useState } from 'react';
import "./Categories.scss"
import { useDispatch, useSelector } from 'react-redux';
import { reRender } from '../../actions/reRender';
import { getAllCategoriesService } from '../../services/categoriesService';
import { getPathImage } from '../../helpers/getPathImage';
import { Spin, Table, Tag } from 'antd';
import CreateCategories from './CreateCategories';
import DeleteCategories from './DeleteCategories';
import UpdateCategories from './UpdateCategories';
import DeleteRangeCategories from './DeleteRangeCategories';


const Categories = () => {
  const [responseAPI, setResponseAPI] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();

  //Call API
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await getAllCategoriesService();
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
      getAllCategories();
    }, 200);

    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender]);
  //END Call API

  //Set colums
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Danh mục cha',
      dataIndex: 'parentCategory',
    },
    {
      title: 'Lượng sản phẩm',
      dataIndex: 'quantityProducts',
    },
    {
      title: 'Chức năng',
      dataIndex: 'function',
      width: '15%',
      render: (_, record) => {
        return (
          <div>
            <UpdateCategories category={record} options={responseAPI} ></UpdateCategories>
            <DeleteCategories categoriesId={record.key}></DeleteCategories>
          </div>
        );
      }
    },
  ];
  //END set colums


  //Ant Design
  //Set data to table
  const data = [];
  responseAPI && (responseAPI.map((index) => {
    data.push({
      key: index.id,
      thumbnail: index.thumbnail ? (<img src={getPathImage(index.thumbnail)} style={{ width: "70px", height: "auto", borderRadius: "10px" }} alt={index.name}></img>) : <Tag color="magenta">Không có ảnh!</Tag>,
      name: index.name,
      quantityProducts: `${index.quantityProducts} sản phẩm`,
      parentCategory: index.parentCategory || <Tag color="magenta">Không có danh mục cha!</Tag>
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
            <h1>DANH SÁCH DANH MỤC</h1>
            <div>
              <DeleteRangeCategories selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeCategories>
              <CreateCategories categories={responseAPI}></CreateCategories>
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
  );
};
export default Categories;
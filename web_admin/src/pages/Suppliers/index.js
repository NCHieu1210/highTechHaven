import React, { useEffect, useState } from 'react';
import { Spin, Table, Tag } from 'antd';
import { getAllSupplierService } from '../../services/suppliersService';
import { getPathImage } from '../../helpers/getPathImage';
import "./Suppliers.scss"
import CreateSuppliers from './CreateSuppliers';
import { useDispatch, useSelector } from 'react-redux';
import { reRender } from '../../actions/reRender';
import DeleteSuppliers from './DeleteSuppliers';
import UpdateSuppliers from './UpdateSuppliers';
import DeleteRangeSuppliers from './DeleteRangeSuppliers';

const columns = [
  {
    title: 'Logo',
    dataIndex: 'logo',
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
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
          <UpdateSuppliers supplier={record}></UpdateSuppliers>
          <DeleteSuppliers idSupplier={record.key}></DeleteSuppliers>
        </div>
      );
    }
  },
];
const Suppliers = () => {
  //Call api
  const [responseAPI, setResponseAPI] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();

  useEffect(() => {

    const getAllSupplier = async () => {
      try {
        const response = await getAllSupplierService();
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
      getAllSupplier();
    }, 200);

    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender]);

  //END Call api

  //Ant Design
  //Set data to table
  const data = [];
  responseAPI && (responseAPI.map((index) => {
    data.push({
      key: index.id,
      logo: index.logo ? (<img src={getPathImage(index.logo)} style={{ width: "70px", height: "auto", borderRadius: "10px" }} alt={index.name}></img>) : <Tag color="magenta">Không có ảnh!</Tag>,
      name: index.name,
      email: index.email,
      phone: index.phone,
      quantityProducts: `${index.quantityProducts} sản phẩm`,
    })
  }))

  //End set data to table

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

  return (
    <div className='admin'>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <div className='admin__header' >
          <h1>DANH SÁCH HÃNG SẢN XUẤT</h1>
          <div>
            <DeleteRangeSuppliers selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeSuppliers>
            <CreateSuppliers></CreateSuppliers>
          </div>
        </div>
      </div>
      <Spin spinning={loading}>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} size='small' pagination={{ position: ['bottomCenter'] }} />
      </Spin>
      {/* pagination={{ position: ['bottomCenter'] }}  */}
    </div>
  )
}
export default Suppliers;
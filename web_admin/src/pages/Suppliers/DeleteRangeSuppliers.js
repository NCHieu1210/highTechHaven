import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Spin, message } from "antd";
import { useDispatch } from "react-redux";
import "./Suppliers.scss";
import { deleteRangeSupplierService } from "../../services/suppliersService";
import { reRender } from "../../actions/reRender";
import { useState } from "react";


const DeleteRangeSuppliers = (props) => {
  const { selectedRowKeys, setSelectedRowKeys } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const hasSelected = selectedRowKeys.length > 0;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteRangeSupplierService(selectedRowKeys);
      if (response.success) {
        message.success('Xóa thành công!');
        console.log('Delete response:', response);
        setSelectedRowKeys([]);
        dispatch(reRender(true));
      } else {
        message.error('Xóa thất bại!');
        console.log('Delete response:', response);
      }
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error('Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau.');
      setLoading(false);
    }
  }

  const confirm = (e) => {
    handleDelete();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <span
        style={{
          marginLeft: 8,
          color: hasSelected ? '#FF7875' : undefined,
          fontWeight: hasSelected ? 'bold' : undefined,
          padding: '0 8px',
        }}
      >
        {hasSelected ? `Đã chọn ${selectedRowKeys.length} items để xóa! ` : ''}
      </span>

      <Popconfirm
        title={`Xóa ${selectedRowKeys.length} nhà sản xuất!`}
        description="Bạn có chắc chắn muốn xóa?"
        onConfirm={confirm}
        onCancel={cancel}
        icon={
          <QuestionCircleOutlined
            style={{
              color: 'red',
            }}
          />
        }
      >
        <Button
          type="primary"
          danger
          // disabled={selectedRowKeys.length === 0}
          className='admin__button admin__button--delete'
          disabled={!hasSelected}
        >
          <DeleteOutlined /> Xóa
        </Button >
      </Popconfirm >

    </>
  );
}

export default DeleteRangeSuppliers;
import { Tag } from 'antd';
import React from 'react';
const ActionType = (props) => {
  const { method } = props
  return (
    <>
      {method === 'POST' && <Tag style={{ minWidth: "165px" }} color="green">Tạo mới</Tag >}
      {method === 'PUT' && <Tag style={{ minWidth: "165px" }} color="cyan">Chỉnh sửa</Tag>}
      {method === 'DELETE' && <Tag style={{ minWidth: "165px" }} color="red">Xóa vĩnh viễn</Tag>}
      {method === 'DELETE_RANGE' && <Tag style={{ minWidth: "165px" }} color="magenta">Xóa hàng loạt</Tag>}
      {method === 'PERMANENTLY_DELETE' && <Tag style={{ minWidth: "165px" }} color="red">Xóa vĩnh viễn</Tag>}
      {method === 'RESTORE' && <Tag style={{ minWidth: "165px" }} color="blue">Khôi phục</Tag>}
      {method === 'RESTORE_RANGE' && <Tag style={{ minWidth: "165px" }} color="geekblue">Khôi phục hàng loạt</Tag>}
      {/* {method === 'Unconfirmed' && <Tag style={{ minWidth: "165px" }} color="cyan">Xác nhận đơn</Tag>} */}
      {method === 'Processing' && <Tag style={{ minWidth: "165px" }} color="cyan">Xác nhận đơn hàng</Tag>}
      {method === 'Delivering' && <Tag style={{ minWidth: "165px" }} color="purple">Giao đơn hàng</Tag>}
      {method === 'Completed' && <Tag style={{ minWidth: "165px" }} color="green">Hoàn thành</Tag>}
      {method === 'Cancelled' && <Tag style={{ minWidth: "165px" }} color="red">Hủy đơn hàng</Tag>}
    </>
  );
};

export default ActionType;

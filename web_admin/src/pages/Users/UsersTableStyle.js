import { LockOutlined } from "@ant-design/icons";
import UpdateUsers from "./UpdateUsers";
import DeleteUsers from "./DeleteUsers";
import { Image, Table, Tag } from "antd";
import moment from "moment";
import { getPathImage } from "../../helpers/getPathImage";
import "./AdminUsers.scss";


const UsersTableStyle = (props) => {
  const { responseAPI, roles } = props;

  //Set colums
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Giới tính',
      dataIndex: 'checkSex',
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
    },

    {
      title: 'Ngày khởi tạo',
      dataIndex: 'createDate',
    },
    {
      title: 'Chức năng',
      dataIndex: 'function',
      width: '10%',
      render: (_, record) => {
        return (
          <div>
            {/* <LockOutlined key="setting" /> */}

            {/* Chỉnh sửa sản phẩm */}
            <UpdateUsers user={record} roles={roles} viewStyle={"table"} />
            {/* END chỉnh sửa sản phảm */}

            {/* Xóa tài khoản */}
            <DeleteUsers userId={record.id} viewStyle={"table"} />
            {/* END Xóa tài khoản*/}
          </div >
        );
      }
    },
  ];
  //END set colums

  //Set data to table
  const data = [];
  responseAPI && (responseAPI.map((index) => {
    data.push({
      key: index.id,
      id: index.id,
      userName: index.userName,
      firstName: index.firstName,
      lastName: index.lastName,
      fullName: `${index.firstName} ${index.lastName}`,
      slug: index.slug,
      email: index.email,
      phoneNumber: index.phoneNumber,
      avatar: index.avatar ? (<Image src={getPathImage(index.avatar)} alt={index.lastName}></Image>) : <Tag color="magenta">Không có ảnh!</Tag>,
      sex: index.sex,
      checkSex: index.sex ? <Tag style={{ minWidth: "52px" }} color="green">Nam</Tag> : <Tag style={{ minWidth: "52px" }} color="red">Nữ</Tag>,
      numberPosts: index.numberPosts,
      birthday: index.birthday,
      createDate: moment.utc(index.createDate).utcOffset('+07:00').format('DD/MM/YYYY '),
      roles: index.roles[0],
    })
  }))
  //END Set data to table

  return (
    <>
      <div className="admin__body--table">
        <Table columns={columns} dataSource={data} size='small' pagination={{ position: ['bottomCenter'] }} />
      </div>
    </>
  );
}

export default UsersTableStyle;
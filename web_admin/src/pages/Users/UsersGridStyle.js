import { Badge, Card, Col, Row } from "antd";
import { getPathImage } from "../../helpers/getPathImage";
import { LockOutlined } from "@ant-design/icons";
import UpdateUsers from "./UpdateUsers";
import DeleteUsers from "./DeleteUsers";
import Meta from "antd/es/card/Meta";

const UsersGridStyle = (props) => {
  const { responseAPI, roles } = props;
  return (
    <>
      <div className="admin__body--grid">
        <Row gutter={[45, 45]} >
          {responseAPI && roles && (
            responseAPI.map((item, _) => (
              <Col span={4} offset={0} key={item.id}>
                <Card
                  hoverable
                  style={{ width: 222, }}
                  cover={<img style={{ width: 222, aspectRatio: "1/1", objectFit: "cover" }} alt={item.name} src={getPathImage(item.avatar)} />}
                  actions={[
                    <LockOutlined key="setting" />,
                    <UpdateUsers user={item} roles={roles} viewStyle={"grid"} />,
                    <DeleteUsers userId={item.id} viewStyle={"grid"} />,
                  ]}
                >
                  <Meta title={`${item.firstName} ${item.lastName}`} description={`${item.email} ${item.phoneNumber} `} />
                  <Badge color="cyan" text={item.roles[0]} size="large" />
                </Card>
              </Col>
            )))}
        </Row>
      </div>
    </>
  );
}

export default UsersGridStyle;
import { EyeOutlined, InfoCircleOutlined, LikeOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import { getPathImage } from "../../helpers/getPathImage";
import { Button, Card, Image, Modal, Space } from "antd";
import { getPostsBySlugService } from "../../services/postsService";
import { getParamsByStatus } from "../../helpers/getParamsByStatus";
import moment from "moment";

const PostDetail = (props) => {
  const { postSlug } = props
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);

    const getPostsBySlug = async () => {
      try {
        const response = await getPostsBySlugService(postSlug);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
      finally {
        setLoading(false);
      };
    };
    getPostsBySlug();
  }, [props])

  //Call API
  useEffect(() => {
    setLoading(true);

  }, [props])
  //END Call API

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} className="btn__detail"
        shape="circle"
        icon={<InfoCircleOutlined />}>
      </Button>
      {data &&
        <Modal
          title={`Bài viết`}
          className="productDetail"
          centered
          width={1000}
          loading={loading}
          onOk={handleOk}
          onCancel={handleCancel}
          open={isModalOpen}
          footer={null}
        >
          <Space >
            <Space.Compact direction="vertical">
              <strong>Tiêu đề </strong>
              <strong>Chuyên mục</strong>
            </Space.Compact>
            <Space.Compact direction="vertical">
              <p>: {data.name}</p>
              <p>: {data.blog}</p>
            </Space.Compact>
          </Space>
          <br></br>
          <br></br>
          <Space>
            <Image style={{ width: 200, height: 200 }} src={getPathImage(data.thumbnail)}></Image>
            <Card title="Khởi tạo">
              <p>Thời gian: <em> {moment.utc(getParamsByStatus(data.postStatus, "Created", "date")).utcOffset('+07:00').format('HH:mm - DD/MM/YYYY ')}</em></p>
              <p>Tác giả&nbsp; &nbsp; : <em> {getParamsByStatus(data.postStatus, "Created", "userFullName")}</em></p>
            </Card>
            <Card title="Cập nhập">
              {getParamsByStatus(data.postStatus, "Updated", "date") != null ?
                (
                  <>
                    <p>Thời gian:<em> {moment.utc(getParamsByStatus(data.postStatus, "Updated", "date")).utcOffset('+07:00').format('HH:mm - DD/MM/YYYY ')}</em></p>
                    <p>Người chỉnh sửa: <em>{getParamsByStatus(data.postStatus, "Updated", "userFullName")}</em></p>
                  </>
                ) :
                (
                  <>
                    <p>Bài viết chưa được chỉnh sửa</p>
                    <br></br>
                  </>
                )
              }
            </Card>
          </Space>
          <hr></hr>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space size={24}>
              <p><EyeOutlined /> {new Intl.NumberFormat('vi-VN').format(data.views)}</p>
              <p><LikeOutlined /> {data.quantityLiked}</p>
            </Space>
          </div>
        </Modal >
      }

    </>
  )
}

export default PostDetail
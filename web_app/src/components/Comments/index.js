import { SendOutlined } from "@ant-design/icons";
import { Button, Col, Form, message, Row, Spin } from "antd";
import "./Comments.scss"
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { createCommentsService, getCommentsByProductIdService, getCommentsByPostIdService, getLikeCommentByTokenService } from "../../services/commentsService";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from '../../actions/reRender';
import CommentsContainer from "./ListComments";
import NotLoggedInYet from "../NotLoggedInYet";

const Comments = (props) => {
  const { productId, postId } = props
  const [comments, setComment] = useState();
  const [likedComment, setLikedComment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [form] = Form.useForm();
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllByProductIdAsync = async () => {
      try {
        const response = await getCommentsByProductIdService(productId);
        if (response.success) {
          setComment(response.data.reverse());
        }
        else {
          console.log("Error:", response.message);
        }
      }
      catch (error) {
        console.log("Error:", error.message);
      }
    }
    const getAllByPostIdAsync = async () => {
      try {
        const response = await getCommentsByPostIdService(postId);
        if (response.success) {
          setComment(response.data.reverse());
        }
        else {
          console.log("Error:", response.message);
        }
      }
      catch (error) {
        console.log("Error:", error.message);
      }
    }
    const getLikeCommentByToken = async () => {
      try {
        const response = await getLikeCommentByTokenService();
        if (response.success) { setLikedComment(response.data) }
      } catch (ex) {
        console.log("Error:", ex.message);
      }
    }
    productId && getAllByProductIdAsync();
    postId && getAllByPostIdAsync();
    getLikeCommentByToken();
    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender])

  const onFinish = async (values) => {
    setLoading(true);
    const data = new FormData();
    data.append("content", values["content"]);
    productId && data.append("ProductID", productId);
    postId && data.append("PostID", postId);
    try {
      const response = await createCommentsService(data);
      if (response === 401) {
        console.log("Error: Unauthorized");
        setShowModalLogin(true);
      }
      else if (response.success) {
        form.resetFields();
        dispatch(reRender(true));
        message.success("Gửi thành công!")
      }
      else {
        message.error("Lỗi hệ thống, vui lòng thử lại sau!")
        console.log("Error:", response);
      }
    }
    catch (ex) {
      console.log("Error:", ex.message);
    }
    finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div className="comments">
        <NotLoggedInYet
          content="bình luận sản phẩm."
          showModalLogin={showModalLogin}
          setShowModalLogin={setShowModalLogin}>
        </NotLoggedInYet>

        <h2>{productId ? "Hỏi và đáp" : "Bình luận"}</h2>
        <br></br>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              remember: true,
            }}>
            <Row>
              <Col span={20}>
                <Form.Item
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập bình luận!',
                    },
                  ]}
                  className="comments__input" >
                  <TextArea autoSize={{ minRows: 2, maxRows: 12 }}></TextArea>
                </Form.Item>
              </Col>
              <Col offset={1} span={1}>
                <Form.Item>
                  <Button htmlType="submit"><SendOutlined /> Gửi</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form >
        </Spin>
        <CommentsContainer comments={comments} likedComment={likedComment} productId={productId} postId={postId}></CommentsContainer>
      </div >

    </>
  );
}

export default Comments;
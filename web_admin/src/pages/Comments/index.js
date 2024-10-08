import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../actions/reRender";
import { getAllCommentsService, getLikeCommentByTokenService } from "../../services/commentsService";
import { Avatar, List, Space, Table, Tag } from "antd";
import moment from "moment";
import { getPathImage } from "../../helpers/getPathImage";
import "./Comments.scss";
import { getPostsByIdService } from "../../services/postsService";
import { getProductsByIdService } from "../../services/productsService";
import RepComents from "./RepComents";
import LikeComments from "./LikeComments";

const Comments = () => {
  const [comments, setComments] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();
  const [postData, setPostData] = useState(); // Lưu dữ liệu bài viết
  const [productData, setProductData] = useState(); // Lưu dữ liệu bài viết
  const [likedComment, setLikedComment] = useState([]);

  const columns = [
    {
      title: 'Sản phẩm/ Bài viết',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Loại',
      dataIndex: 'areas',
      key: 'areas',
    },
    {
      title: 'Nội dung bình luận',
      dataIndex: 'content',
      key: 'content',
      width: '30%',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: '10%',
    },
    {
      title: 'Tài khoản',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '',
      dataIndex: 'function',
      render: (_, record) => {
        return (
          <Space.Compact className="comments__func">
            <LikeComments id={record.id} quantityLiked={record.quantityLiked} likedComment={likedComment}></LikeComments>
            <RepComents id={record.id} productId={record.productID} postId={record.postID}></RepComents>
          </Space.Compact>
        );
      }
    },
  ];

  const data = [];
  comments && postData && productData && comments.map((item, index) => {
    data.push({
      key: index,
      id: item.id,
      areas: item.productID ? <Tag color="purple">Sản phẩm</Tag> : <Tag color="orange">Bài viết</Tag>,
      name: item.productID ?
        (<Space>
          <img className="comments__thumbnail" src={getPathImage(productData[item.productID].productVariants.thumbnail)} alt="thumbnail" />
          <p>{productData[item.productID].name}</p>
        </Space>) :
        (<Space>
          <img className="comments__thumbnail" src={getPathImage(postData[item.postID].thumbnail)} alt="thumbnail" />
          <p>{postData[item.postID].name}</p>
        </Space>),
      user: <><Avatar src={getPathImage(item.user.avatar)} />&nbsp;{`${item.user.firstName} ${item.user.lastName}`}</>,
      content: item.content,
      createdDate: <div style={{ textAlign: "center" }}> {moment.utc(item.createdDate).utcOffset('+07:00').format('HH:mm  DD/MM/YYYY ')}</div>,
      productID: item.productID,
      postID: item.postID,
      quantityLiked: item.quantityLiked,
      subComments: item.subComments.length > 0 &&
        <div className="comments__subComments">
          <h2>PHẢN HỒI</h2>
          <List
            itemLayout="horizontal"
            dataSource={item.subComments}
            renderItem={(subListItem, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={getPathImage(subListItem.user.avatar)} alt="avatar" />}
                  title={
                    <Space>
                      {subListItem.user.firstName + " " + subListItem.user.lastName}
                      <em>&nbsp;({moment.utc(subListItem.createdDate).utcOffset('+07:00').format('HH:mm - DD/MM/YYYY')})&nbsp;</em>
                      <Space.Compact className="comments__func comments__subComments--like">
                        <LikeComments id={subListItem.id} quantityLiked={subListItem.quantityLiked} likedComment={likedComment}></LikeComments>
                        <RepComents id={item.id} productId={item.productID} postId={item.postID}></RepComents>
                      </Space.Compact>
                    </Space>
                  }
                  description={<div className="comments__subComments--content">{subListItem.content}</div>}
                />
              </List.Item>
            )}
          />
        </div>
    })
  });
  const getPost = async (postId) => {
    const response = await getPostsByIdService(parseInt(postId));
    return response.data; // Trả về tên bài viết
  }

  const getProduct = async (productId) => {
    const response = await getProductsByIdService(parseInt(productId));
    return response.data; // Trả về tên bài viết
  }
  useEffect(() => {
    const getLikeCommentByToken = async () => {
      try {
        const response = await getLikeCommentByTokenService();
        if (response.success) { setLikedComment(response.data) }
      } catch (ex) {
        console.log("Error:", ex.message);
      }
    }
    const getAllComments = async () => {
      try {
        const response = await getAllCommentsService();
        if (response.success) {
          response.data.reverse();
          setComments(response.data);

          const newPostData = {};
          const newProductData = {};
          for (const item of response.data) {
            if (!item.productID) {
              newPostData[item.postID] = await getPost(item.postID);
            }
            else {
              newProductData[item.productID] = await getProduct(item.productID);
            }
          }
          setPostData(newPostData);
          setProductData(newProductData);
        }
        else {
          console.log(response.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    setTimeout(() => {
      getAllComments();
      getLikeCommentByToken();
    }, 200);

    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender]);

  return (
    <>
      <Table
        className="comments"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <div
              style={{
                margin: 0,
              }}
            >
              {record.subComments}
            </div>
          ),
          rowExpandable: (record) => record.subComments !== false,
        }}
        dataSource={data}
        pagination={{ position: ['bottomCenter'] }}
      />
    </>
  )
}

export default Comments;
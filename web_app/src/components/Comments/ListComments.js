import { CaretDownOutlined, CaretUpOutlined, DownOutlined, FieldTimeOutlined, HeartOutlined, MessageOutlined, UpOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, List, message, Tag, Tooltip, Tree } from "antd";
import { getPathImage } from "../../helpers/getPathImage";
import moment from "moment";
import { Children, useEffect, useState } from "react";
import RepComments from "./RepComments";
import { caCulateLastTime } from "../../helpers/calculateLastTime";
import Icon from "@ant-design/icons/lib/components/Icon";
import { createLikedService } from "../../services/commentsService";
import NotLoggedInYet from "../NotLoggedInYet";
import { useDispatch } from "react-redux";
import { reRender } from "../../actions/reRender";
import { checkRolesInvalid } from "../../helpers/checkRolesInvalid";

//Heart Icon
const HeartSvg = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <title></title>
    <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
  </svg>
);
const HeartIcon = (props) => <Icon component={HeartSvg} {...props} />;
//END Heart Icon

const ListComments = (props) => {
  const { comments, likedComment, productId, postId, checkId, setCheckId, isSubComment } = props;
  const [listSubCommentShow, setListSubCommentShow] = useState([]);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showComment, setShowComment] = useState(3);
  const dispatch = useDispatch();

  const handleLikeComment = async (commentId) => {
    try {
      const response = await createLikedService(commentId);
      if (response === 401) {
        setShowModalLogin(true);
      }
      else if (response.success) {
        dispatch(reRender(true));
      }
      else {
        console.log("Error:", response.message);
        message.error("Lỗi hệ thống, vui lòng thử lại sau!");
      }
    } catch (ex) {
      console.log("Error:", ex.message);
      message.error("Lỗi hệ thống, vui lòng thử lại sau!");
    }
  }
  return (
    <>
      <div className="comments__list">
        <List
          itemLayout="vertical"
          size="large"
          dataSource={comments && (isSubComment ? comments : comments.slice(0, showComment))}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                //Avatar
                avatar={<Avatar src={getPathImage(item.user.avatar)} />}
                //END Avatar

                //Title and Description
                //Title
                title={
                  <div>
                    <strong>
                      {item.user.firstName} {item.user.lastName} &nbsp;
                      {item.user.isCustomer ? '' : (<Tag color="gold">Quản trị viên</Tag>)}
                    </strong>
                  </div>}
                //Description
                description={<div>
                  {item.content}
                  <div className="comments__footer">
                    {/* Last Comment Time */}
                    <NotLoggedInYet
                      content="bình luận sản phẩm."
                      showModalLogin={showModalLogin}
                      setShowModalLogin={setShowModalLogin}>
                    </NotLoggedInYet>
                    <Tooltip placement="left" title={moment.utc(item.createDate).utcOffset('+07:00').format('HH:mm - DD/MM/YYYY')}>
                      <FieldTimeOutlined style={{ color: "gray" }} />
                      <em> {caCulateLastTime(item.lastCommentTime)}</em>
                    </Tooltip>
                    {/* Like comment button */}
                    <Button
                      className="comments__footer--like"
                      onClick={() => handleLikeComment(item.id)}>
                      {likedComment && likedComment.find(lkc => lkc.commentID === item.id) ?
                        (<><HeartIcon style={{ color: 'red' }} /> <span style={{ color: 'red' }}>Thích</span></>) :
                        (<><HeartOutlined /> <span>Thích</span></>)}
                    </Button>
                    {/* Rep comments button */}
                    <Button
                      onClick={() => {
                        item.parentCommentID ? setCheckId(item.parentCommentID) : setCheckId(item.id);
                        setListSubCommentShow([...listSubCommentShow, item.id]);
                      }}>
                      <MessageOutlined />Phản hồi
                    </Button>
                    {/* Quantity liked */}
                    {item.quantityLiked > 0 &&
                      <div className="comments__footer--quantityLike">
                        <HeartIcon style={{ color: 'red' }} />
                        {item.quantityLiked > 1 && item.quantityLiked}
                      </div>
                    }
                    {/* END RepComments button */}
                  </div>
                </div>}
              //End Title and Description
              />
              {/*List subComments */}
              {item.subComments.length > 0 &&
                <div className="subComments">
                  {listSubCommentShow.filter(id => id === item.id).length > 0 &&
                    <ListComments
                      comments={item.subComments}
                      likedComment={likedComment}
                      productId={productId}
                      postId={postId}
                      checkId={checkId}
                      setCheckId={setCheckId}
                      isSubComment={true}
                    />
                  }
                  {/* Button show subComment */}
                  {listSubCommentShow.filter(id => id === item.id).length === 0 ?
                    (<Divider className="comments__divider" orientation="left" >
                      <Button
                        className="subComments__button"
                        onClick={() => { setListSubCommentShow([...listSubCommentShow, item.id]) }}
                      >Xem {item.subComments.length} câu trả lời <DownOutlined />
                      </Button>
                    </Divider>) :
                    (
                      <Divider className="comments__divider comments__divider--show" orientation="left" >
                        <Button
                          className="subComments__button subComments__button--show"
                          onClick={() => { setListSubCommentShow(listSubCommentShow.filter(itemId => itemId !== item.id)) }}
                        >Ẩn {item.subComments.length} câu trả lời <UpOutlined />
                        </Button>
                      </Divider>
                    )

                  }
                  {/* END Button show subComment */}

                </div>
              }
              {/*END List subComments */}

              <div className="subComments">
                <RepComments
                  parentCommentId={item.id}
                  checkId={checkId}
                  productId={productId}
                  postId={postId}>
                </RepComments>
              </div>
            </List.Item>
          )}
        />
        <div className={isSubComment ? "subComments__hide" : "comments__showMore"}>
          {comments && comments.length > showComment &&
            (<>
              <br></br>
              <Button onClick={() => setShowComment(showComment + 3)}>Hiển thị thêm 3 bình luận <CaretDownOutlined /></Button>
            </>)
          }
        </div >
      </div >
    </>
  )
}

const CommentsContainer = ({ comments, productId, postId, likedComment }) => {
  const [checkId, setCheckId] = useState(null);

  return (
    <>
      <ListComments
        comments={comments}
        likedComment={likedComment}
        productId={productId}
        postId={postId}
        checkId={checkId}
        setCheckId={setCheckId}
        isSubComment={false}
      />
    </>
  );
}

export default CommentsContainer
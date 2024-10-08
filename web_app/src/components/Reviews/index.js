import { Avatar, Flex, List, Progress, Rate } from "antd";
import { getPathImage } from "../../helpers/getPathImage";
import { FieldTimeOutlined } from "@ant-design/icons";
import ButtonReviews from "./ButtonReviews";
import "./Reviews.scss";
import { caCulateLastTime } from "../../helpers/calculateLastTime";

const Reviews = (props) => {
  let { reviews } = props;
  const { productOptionId, productOptionName } = props;
  if (reviews == null) {
    reviews = {
      "reviewsNumber": 0,
      "totalRating": 0,
      "listStar": {
        "oneStar": 0,
        "twoStar": 0,
        "threeStar": 0,
        "fourStar": 0,
        "fiveStar": 0
      },
      "reviews": []
    }
  };

  const ratio = (star) => {
    return star * 100 / reviews.reviewsNumber.toFixed(1);
  }


  return (
    <>
      {props && (
        <div className="reviews">
          <h2>Đánh giá & nhận xét {productOptionName}</h2>
          <br></br>
          {/* Rating */}
          <div className="reviews__rating">
            <div className="reviews__rating--left">
              <h2> {reviews.totalRating}/5</h2>
              <Rate allowHalf disabled value={reviews.totalRating} />
              <p><strong>{reviews.reviewsNumber} Lượt đánh giá</strong></p>
            </div>
            <div className="reviews__rating--right">
              <div>
                <Rate disabled defaultValue={5} />
                <Flex gap="small" vertical>
                  <Progress
                    percent={ratio(reviews.listStar.fiveStar)}
                    size={[150, 10]}
                    strokeColor="#FFAA3D"
                    showInfo={false}
                  />
                </Flex>
                <em>{reviews.listStar.fiveStar} đánh giá</em>
              </div>
              <div><Rate disabled defaultValue={4} />
                <Flex gap="small" vertical>
                  <Progress
                    percent={ratio(reviews.listStar.fourStar)}
                    size={[150, 10]}
                    strokeColor="#FFAA3D"
                    showInfo={false}
                  />
                </Flex>
                <em>{reviews.listStar.fourStar} đánh giá</em>
              </div>
              <div>
                <Rate disabled defaultValue={3} />
                <Flex gap="small" vertical>
                  <Progress
                    percent={ratio(reviews.listStar.threeStar)}
                    size={[150, 10]}
                    strokeColor="#FFAA3D"
                    showInfo={false}
                  />
                </Flex>
                <em>{reviews.listStar.threeStar} đánh giá</em>
              </div>
              <div>
                <Rate disabled defaultValue={2} />
                <Flex gap="small" vertical>
                  <Progress
                    percent={ratio(reviews.listStar.twoStar)}
                    size={[150, 10]}
                    strokeColor="#FFAA3D"
                    showInfo={false}
                  />
                </Flex>
                <em>{reviews.listStar.twoStar} đánh giá</em>
              </div>
              <div>
                <Rate disabled defaultValue={1} />
                <Flex gap="small" vertical>
                  <Progress
                    percent={ratio(reviews.listStar.oneStar)}
                    size={[150, 10]}
                    strokeColor="#FFAA3D"
                    showInfo={false}
                  />
                </Flex>
                <em>{reviews.listStar.oneStar} đánh giá</em>
              </div>
            </div>
          </div>

          {/* END Rating */}
          <div className="reviews__add">
            <div>
              <p><em>Bạn nghĩ sao về sản phẩm này?</em></p>
              <br></br>
              <ButtonReviews productOptionId={productOptionId} productOptionName={props.productOptionName}></ButtonReviews>
            </div>
          </div>
          {/* List Reviews */}
          <div className="reviews__list">
            <h3>Đánh giá về sản phẩm</h3>
            <br></br>
            <List
              itemLayout="horizontal"
              dataSource={reviews.reviews}
              renderItem={(item, index) => (
                <List.Item >
                  <List.Item.Meta
                    avatar={<Avatar src={`${getPathImage(item.userAvatar)}`} />}
                    title={<div><strong>{item.userFullName}</strong>
                      <FieldTimeOutlined style={{ marginLeft: "15px", color: "gray" }} />
                      <em> {caCulateLastTime(item.lastReviewTime)}</em></div>}
                    description={
                      <div>
                        <Rate disabled defaultValue={item.rating} />
                        <p style={{ color: "black" }}>{item.content}</p>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
          {/*END List Reviews */}

        </div>
      )}
    </>
  );
}

export default Reviews;
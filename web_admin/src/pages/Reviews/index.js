import { Rate, Spin, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { getAllReviewService } from "../../services/reviewsService";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../actions/reRender";
import moment from "moment";
import { NavLink } from "react-router-dom";
import DeleteReviews from "./DeleteReviews";
import { getDomainName_Client } from "../../helpers/getDomainName_Client";
import { getPathImage } from "../../helpers/getPathImage";
import "./Reviews.scss";
import ConfirmReviews from "./ConfirmReviews";

const ReviewProducts = () => {
  const [responseAPI, setResponseAPI] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();


  const columns = [
    {
      title: '',
      dataIndex: 'thumbnail',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      width: '20%',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      width: '15%',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
    },
    {
      title: 'Thời gian',
      dataIndex: 'reviewDate',
      width: '10%',
    },
    {
      title: 'Tài khoản',
      dataIndex: 'userName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: '',
      dataIndex: 'function',
      render: (_, record) => {
        return (
          <div className="review__func">
            {!record.isConfirmed && <ConfirmReviews reviewsID={record.key}></ConfirmReviews>}
            {/* <UpdateBlogs blog={record}></UpdateBlogs> */}
            <DeleteReviews reviewsID={record.key}></DeleteReviews>
          </div >
        );
      }
    },
  ];
  //Call api
  useEffect(() => {

    const getAllReviews = async () => {
      try {
        const response = await getAllReviewService();
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
      getAllReviews();
    }, 200);

    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender]);
  //END Call api

  //AntDesign
  const data = [];
  responseAPI && (responseAPI.map((item) => {
    data.push({
      key: item.id,
      rating: <Rate disabled defaultValue={item.rating} />,
      content: item.content,
      reviewDate: <div style={{ textAlign: "center" }}> {moment.utc(item.reviewDate).utcOffset("+07:00").format("HH:mm  DD/MM/YYYY")}</div>,
      productName:
        <a href={`${getDomainName_Client()}/products/${item.productSlug}?option=${item.productOption.option}`} target="_blank">
          <p style={{ color: "black" }}>{item.productName} - {item.productOption.option}</p>
        </a>,
      thumbnail:
        item.productOption.productVariants[0].thumbnail ?
          (<img src={getPathImage(item.productOption.productVariants[0].thumbnail)}
            style={{ width: "70px", height: "auto", borderRadius: "10px" }} alt={item.productName}></img>) :
          (<Tag color="magenta">Không có ảnh!</Tag>),
      userName: item.userFullName,
      isConfirmed: item.isConfirmed,
      status: item.isConfirmed ?
        <Tag className="review__tag" color="green">Đã phê duyệt</Tag> :
        <Tag className="review__tag" color="magenta">Chưa phê duyệt</Tag>,
    })
  }))

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
  //END AntDesign
  const rowClassName = (record) => {
    return record.isConfirmed ? 'review__confirmed' : 'review__notConfirmed';
  };

  return (
    <>
      <div className='admin'>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div className='admin__header' >
            <h1>DANH SÁCH ĐÁNH GIÁ</h1>
            <div>
              {/* <DeleteRangeBlgos selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeBlgos>
              <CreateBlogs></CreateBlogs> */}
            </div>
          </div>
        </div>
        <Spin spinning={loading}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data} size='small'
            pagination={{ position: ['bottomCenter'] }}
            rowClassName={rowClassName}
          />
        </Spin>
        {/* pagination={{ position: ['bottomCenter'] }}  */}
      </div>
    </>
  )
}

export default ReviewProducts;
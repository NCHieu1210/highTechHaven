import { useNavigate, useParams } from "react-router-dom"
import { createLikedService, getLikedPostByTokenService, getPostsBySlugService } from "../../services/postsService";
import { useEffect, useState } from "react";
import { Avatar, Button, Divider, Image, Spin } from "antd";
import { ArrowLeftOutlined, EyeOutlined, FieldTimeOutlined, LikeFilled, LikeOutlined } from "@ant-design/icons";
import parse from 'html-react-parser';
import { getPathImage } from "../../helpers/getPathImage";
import moment from "moment";
import Comments from "../../components/Comments";
import NotLoggedInYet from "../../components/NotLoggedInYet";
import { getProductBySearchService } from "../../services/productsService";
import CardProduct from "../Products/CardProduct";
import "./Posts.scss";


const PostDetail = () => {
  const params = useParams()
  const [posts, setPosts] = useState();
  const [product, setProduct] = useState();
  const [isLike, setIsLike] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProductByKeyWord = async (keyword) => {
      try {
        const response = await getProductBySearchService(keyword);
        if (response.success) {
          const dataRes = response.data;
          setProduct(dataRes.reverse().slice(0, 2));
        }
        else {
          console.log("erorr:", response.message);
        }
      }
      catch (error) {
        console.log("erorr", error.message);
      }
    }
    const getPosts = async () => {
      setLoading(true);
      try {
        const response = await getPostsBySlugService(params.slug);
        if (response.success) {
          getProductByKeyWord(response.data.keywordProduct);
          const dataRes = response.data;
          setPosts(dataRes);
        }
        else {
          console.log("erorr:", response.message);
        }
      }
      catch (error) {
        console.log("erorr", error.message);
      }
      finally {
        setLoading(false);
      }
    }
    const handleLikePost = async () => {
      try {
        const response = await getLikedPostByTokenService()
        if (response.success) {
          const dataRes = response.data.filter(p => p.postID === posts.id);
          dataRes.length > 0 ? setIsLike(true) : setIsLike(false);
        }
        else {
          console.log("Error:", response)
        }
      }
      catch (error) {
        console.log("Error:", error)
      }
    }

    getPosts();
    handleLikePost();

    reRender && setReRender(false)
  }, [params, reRender]);

  const handleLike = async (postId) => {
    try {
      const response = await createLikedService(postId);
      if (response === 401) {
        setShowModalLogin(true);
      }
      else if (!response.success) {
        console.log("Error:", response)
      }
    }
    catch (error) {
      console.log("Error:", error)
    }
    setReRender(true);
  }

  const getParamsByStatus = (arr, key, value) => {
    const foundObj = arr.find(obj => obj.name === key); // Sử dụng find để tìm đối tượng
    if (foundObj) {
      return foundObj[value]; // Trả về giá trị của thuộc tính nếu tìm thấy
    }
    return null; // Trả về null nếu không tìm thấy
  };

  return (
    <>
      <Spin spinning={loading}>
        <div style={{ minHeight: "70vh" }}>
          {showModalLogin &&
            <NotLoggedInYet
              content="thích bài viết"
              showModalLogin={showModalLogin}
              setShowModalLogin={setShowModalLogin}
            ></NotLoggedInYet >}
          {
            posts && (
              <div className="postDetails">
                <div className="postDetails__left">
                  <div className="postDetails__left--image">
                    <Button onClick={() => navigate(-1)} shape="circle" className="header__setHide">
                      <ArrowLeftOutlined />
                    </Button>
                    <div>
                      <br></br>
                      <Image src={getPathImage(posts.thumbnail)} alt={posts.name}></Image>
                    </div>
                  </div>
                  <div className="postDetails__left--content">
                    <div>
                      <div className="content__blog"><strong>{posts.blog}</strong></div>
                      <br></br>
                      <h1>{posts.name}</h1>
                      <div className="content__author">
                        <div className="content__author--left">
                          <Avatar src={getPathImage(getParamsByStatus(posts.postStatus, "Created", "avatar"))}></Avatar>
                          <div>
                            <strong>{getParamsByStatus(posts.postStatus, "Created", "userFullName")}</strong>
                            <div className="content__author--time">
                              <FieldTimeOutlined />
                              <em>Ngày đăng: {moment.utc(getParamsByStatus(posts.postStatus, "Created", "date")).utcOffset('+07:00').format('DD/MM/YYYY')}</em>
                              {posts.updateDate && <em> - Cập nhập: {moment.utc(getParamsByStatus(posts.postStatus, "Updated", "date")).utcOffset('+07:00').format('DD/MM/YYYY')}</em>}
                            </div>
                          </div>
                        </div>
                        <div className="content__author--right">
                          <em><EyeOutlined /> {posts.views} <span className="content__author--span">Lượt xem</span></em>
                          <br></br>
                          <Button onClick={() => handleLike(posts.id)}>
                            {isLike ? (<LikeFilled style={{ color: '#067CFC' }} />) : (<LikeOutlined />)}
                          </Button>
                          {posts.quantityLiked ?
                            (<em> {posts.quantityLiked} <span className="content__author--span">Lượt thích</span></em>) :
                            (<em><span className="content__author--span">Lượt thích</span></em>)
                          }
                        </div>
                      </div>
                      <br></br>
                      <br></br>
                      <div className="content__content">
                        {parse(posts.content)}
                      </div>
                      <br></br>
                      <div className="postDetails__left--like" >
                        <Divider style={{ borderColor: 'gray' }} orientation="right" orientationMargin="0">
                          <Button onClick={() => handleLike(posts.id)}>
                            {isLike ? (<LikeFilled style={{ color: '#067CFC' }} />) : (<LikeOutlined />)}
                          </Button>
                          <em>Like nếu bài viết này giúp ích cho bạn</em>
                        </Divider>
                      </div>
                    </div>
                  </div>
                  <div className="postDetails__left--comment">
                    <Comments postId={posts.id}></Comments>
                  </div>
                </div>
                <div className="postDetails__right">
                  <h2>Bạn có thể quan tâm</h2>
                  <hr></hr>
                  <br></br>
                  <div>
                    {product && product.map((item, index) => (
                      <div className="postDetails__right--card" key={index}>
                        <CardProduct product={item} ></CardProduct>
                        <br></br>
                      </div>
                    ))}
                  </div>
                </div>
              </div >
            )
          }
        </div>
      </Spin>
    </>
  )
}
export default PostDetail
import { CustomerServiceOutlined, DollarOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, TruckOutlined } from "@ant-design/icons";
import { Col, Row, Space, Spin } from "antd";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getPathImage } from "../../helpers/getPathImage";
import logoFacebook from "../../assets/images/logoFacebook.jpg";
import logoYoutube from "../../assets/images/logoYoutube.jpg";
import logoTiktok from "../../assets/images/logoTiktok.jpg";
import daThongBao from "../../assets/images/daThongBao.png";
import dmca from "../../assets/images/dmca.png";
import { useEffect, useState } from "react";

const FooterDefault = (props) => {
  const categoriesStore = useSelector(state => state.data.categories);
  const suppliersStore = useSelector(state => state.data.suppliers);
  const blogsStore = useSelector(state => state.data.blogs);
  const [loading, setLoading] = useState(props.loading);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setCategories(categoriesStore.slice(0, 12));
    setSuppliers(suppliersStore.slice(0, 24));
    setBlogs(blogsStore.slice(0, 6));
    setLoading(false);
  }, [props]);
  return (
    <>
      <Spin spinning={loading}>
        <div className="userlayout__footer--introduce">
          <Row >
            <Col offset={3} span={5}><DollarOutlined /><span> Miễn Phí Vận Chuyển</span></Col>
            <Col offset={3} span={5}><TruckOutlined /><span> Giao hàng tận nơi</span></Col>
            <Col offset={3} span={5}><CustomerServiceOutlined /><span> Hỗ trợ 24/7</span></Col>
          </Row>
        </div >
        <br></br>
        <div className="userlayout__footer">
          <div>
            <h2>Thông tin cửa hàng</h2>
            <br></br>
            <Row>
              <Col span={24}><EnvironmentOutlined /><span> 65 Huỳnh Thúc Kháng, P.Bến Nghé, Quận 1, Tp.HCM.</span></Col>
              <Col span={24}><PhoneOutlined /><a href="tel:0379903378"><span> 0379903378</span></a></Col>
              <Col span={24}><MailOutlined /><span> nguyenconghieuhb93@gmail.com </span></Col>
            </Row>
            <br></br>
            <h2>Kết nối với chúng tôi</h2>
            <br></br>
            <Row className="userlayout__footer--social">
              <Col span={7}><a href="https://www.facebook.com/" target="_blank"><img src={logoFacebook} alt="facebook" /></a></Col>
              <Col offset={1} span={7}><a href="https://www.tiktok.com/" target="_blank"><img src={logoTiktok} alt="tiktok" /></a></Col>
              <Col offset={1} span={7}><a href="https://www.youtube.com/" target="_blank"><img src={logoYoutube} alt="youtube" /></a></Col>
            </Row>
          </div>
          <div className="header__setHide">
            <h2>Danh mục sản phẩm</h2>
            <br></br>
            <Row>
              {categories && categories.map((item, index) => (
                <Col key={index} span={12}><NavLink to={`/products/categories/${item.slug}`}><span>{item.name}</span></NavLink></Col>
              ))}
            </Row>
          </div>
          <div>
            <h2>Hãng sản xuất</h2>
            <br></br>
            <Row>
              {suppliers && suppliers.map((item, index) => (
                <Col className="userlayout__footer--supplier" key={index} span={6} xs={8} md={6} ><NavLink to={`/products/suppliers/${item.slug}`}><img src={getPathImage(item.logo)} /> <span>{item.name}</span></NavLink></Col>
              ))}
            </Row>
          </div>
          <div className="header__setHide">
            <h2>Chuyên mục bài viết</h2>
            <br></br>
            <Row>
              {blogs && blogs.map((item, index) => (
                <Col key={index} span={12}><NavLink to={`/posts`}><span>{item.name}</span></NavLink></Col>
              ))}
            </Row>
            <br></br>
            <br></br>
            <h2>Cam kết chính hãng</h2>
            <br></br>
            <Row className="userlayout__footer--commitment">
              <Space>
                <Col span={10}><img src={daThongBao} /></Col>
                <Col offset={4} span={10}><a href="https://www.dmca.com/Protection/Status.aspx?ID=a64e1165-4907-4a1a-a503-fce1e331737e&refurl=http://http://localhost:3000.com/" target="_blank"><img src={dmca} /></a></Col>
              </Space>
            </Row>
          </div>
        </div >
        <div className="userlayout__footer--copyright" style={{ textAlign: "center" }}><em>Copyright @ 2024 NCH</em></div>
      </Spin>
    </>
  );
}
export default FooterDefault
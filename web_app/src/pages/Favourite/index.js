import { Button, Spin, Table, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPathImage } from "../../helpers/getPathImage";
import { NavLink } from "react-router-dom";
import { DeleteFilled, ShoppingCartOutlined } from "@ant-design/icons";
import DeleteFormFavorites from "./DeleteFormFavorites";
import { getProductByListProductOptionIdService } from "../../services/productsService";
import { AddToCart } from "../../helpers/cartHelper";
import { generateQueryParams } from "../../helpers/generateQueryParams";
import NoData from "../../components/NoData";

const FavouriteProduct = () => {
  const favorites = useSelector(state => state.data.favorites);
  const [listFavorites, setListFavorites] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = (productVariantID) => {
    AddToCart(productVariantID, 1, dispatch);
  }

  const [isTablet, setIsTablet] = useState(false);
  const handleResize = () => {
    setIsTablet(window.innerWidth <= 1024); // Thay đổi kích thước này theo nhu cầu của bạn
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    const setData = (response) => {
      const data = [];
      (response.map((item) => {
        const pV = item.productVariants;
        data.push({
          key: item.id,
          optionId: pV.optionID,
          variantId: pV.id,
          // dateAdded: moment.utc(index.dateAdded).utcOffset("+07:00").format("DD-MM-YYYY"),
          productName:
            <NavLink to={`/products/${item.slug}?option=${pV.option}`}>
              <strong><em style={{ color: "gray" }}>{item.name}&nbsp;{pV.option !== "No Option" && pV.option}</em></strong>
            </NavLink>,
          productPrice: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pV.price),
          produtcDiscount: `${pV.discount}%`,
          produtcAvatar: pV.thumbnail ?
            (<img src={getPathImage(pV.thumbnail)} style={{ width: "70px", height: "auto", borderRadius: "10px" }} alt={item.name}></img>) :
            (<Tag color="magenta">Không có ảnh!</Tag>)
        })
      }))
      setListFavorites(data);
    }

    const getProductFavorites = async () => {
      setLoading(true);
      try {
        let listProductOptionId = favorites.map(item => ({ id: item.productOptionID }));
        const queryParams = generateQueryParams(listProductOptionId);
        const response = await getProductByListProductOptionIdService(queryParams);
        if (response.success) {
          setData(response.data);
        }
        else {
          console.log("Error", response.message);
        }
      }
      catch (error) {
        console.log("Error", error);
      }
      finally {
        setLoading(false);
      }
    }
    getProductFavorites();
  }, [favorites])

  const columns = [
    {
      title: '',
      dataIndex: 'produtcAvatar',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: '35%',
    },
    {
      title: 'Giá gốc',
      dataIndex: 'productPrice',
    },
    {
      title: 'Giảm',
      dataIndex: 'produtcDiscount',
    },
    // {
    //   title: 'Ngày thêm',
    //   dataIndex: 'dateAdded',
    // }
    ,
    {
      title: '',
      dataIndex: 'function',
      render: (_, record) => {
        return (
          <div>
            <Button shape="circle" style={{ marginRight: "20px" }} onClick={() => handleAddToCart(record.variantId)} ><ShoppingCartOutlined /></Button>
            <DeleteFormFavorites productOptionID={record.optionId}></DeleteFormFavorites>
          </div>
        );
      }
    },
  ];

  const columnsTablet = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: '45%',
    },
    {
      title: 'Giá gốc',
      dataIndex: 'productPrice',
    },
    {
      title: 'Giảm',
      dataIndex: 'produtcDiscount',
    },
    // {
    //   title: 'Ngày thêm',
    //   dataIndex: 'dateAdded',
    // }
    ,
    {
      title: '',
      dataIndex: 'function',
      render: (_, record) => {
        return (
          <div>
            <Button shape="circle" style={{ marginBottom: "5px" }} onClick={() => handleAddToCart(record.variantId)} ><ShoppingCartOutlined /></Button>
            <DeleteFormFavorites productOptionID={record.optionId}></DeleteFormFavorites>
          </div>
        );
      }
    },
  ];


  return (
    <>
      <Spin spinning={loading}>
        <div className="userDetails">
          <h1>SẢN PHẨM YÊU THÍCH CỦA BẠN</h1>
          <br></br>
          {listFavorites && (listFavorites.length > 0 ?
            (<>
              <Table columns={isTablet ? columnsTablet : columns} dataSource={listFavorites} size='large' title={null} // Ẩn tiêu đề
                pagination={{ position: ['bottomCenter'], pageSize: 4 }} />
            </>) :
            (<NoData content="Bạn hiện chưa có sản phẩm yêu thích nào"></NoData>)
          )}
        </div>
      </Spin>
    </>
  )
}

export default FavouriteProduct;
import { MinusOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Image, List, message, Popconfirm, Space, Spin } from "antd";
import { AddToCart, ReduceQuantity } from "../../helpers/cartHelper";
import { getPathImage } from "../../helpers/getPathImage";
import { useSelector } from "react-redux";
import { generateQueryParams } from "../../helpers/generateQueryParams";
import { useState } from "react";

const CartContainersLeft = (props) => {
  const { cart, dispatch, setLoading } = props;
  const formatCurrency = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const discountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  const totalPrice = (price, discount, quantity) => {
    return (price - (price * discount / 100)) * quantity;
  };
  const handleAddToCart = async (productID) => {
    setLoading(true);
    await AddToCart(productID, 1, dispatch);
    setLoading(false);
  }

  const handleReduceQuantity = async (productID) => {
    setLoading(true);
    await ReduceQuantity(productID, 1, dispatch);
    setLoading(false);
  }
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={item => {
          let productVariant = item.productVariant;
          return (
            <List.Item style={{ padding: "30px 0" }}>
              <List.Item.Meta
                avatar={<Image width={150} src={getPathImage(productVariant.thumbnail)} />}
                title={
                  <a href={`/products/${productVariant.slug}?${generateQueryParams({ option: productVariant.option, color: productVariant.color })}`}>
                    {productVariant.name}&nbsp;
                    {productVariant.option !== "No Option" && productVariant.option}
                    {productVariant.color && `- ${productVariant.color}`}
                  </a>}
                description={
                  <div className="cart__contains" style={{ paddingLeft: "20px" }}>
                    <div className="cart__contains--content">
                      <strong style={{ color: 'red', paddingRight: "10px" }}>
                        {formatCurrency(discountedPrice(productVariant.price, productVariant.discount))}
                      </strong>
                      <span style={{ textDecoration: 'line-through', color: 'rgba(0, 0, 0, 0.45)' }}>
                        {formatCurrency(parseInt(productVariant.price))}
                      </span>
                      <br></br>
                      <strong>
                        Tổng cộng: {formatCurrency(totalPrice(productVariant.price, productVariant.discount, item.quantity))}
                      </strong>
                    </div>
                    <div className="cart__contains--func">
                      {
                        item.quantity == 1 ?
                          (<Popconfirm
                            title="Xóa sản phẩm?"
                            description="Sản phẩm sẽ biến mất trong giỏ hàng!"
                            onConfirm={() => (handleReduceQuantity(productVariant.id))}
                            onCancel={cancel}
                            icon={
                              <QuestionCircleOutlined
                                style={{
                                  color: 'red',
                                }}
                              />
                            }
                          >
                            <Button><MinusOutlined /></Button>
                          </Popconfirm>) :
                          (
                            <Button onClick={() => handleReduceQuantity(productVariant.id)}><MinusOutlined /></Button>
                          )
                      }
                      <p><strong>{item.quantity}</strong></p>
                      <Button onClick={() => handleAddToCart(productVariant.id)}><PlusOutlined /></Button>

                    </div>
                  </div>
                }
              />
            </List.Item >
          )
        }}
      />
    </>
  );
}

export default CartContainersLeft;
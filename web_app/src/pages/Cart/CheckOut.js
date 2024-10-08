import { Button } from "antd";
import { useState } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import InputAddress from "./InputAddress";
import MyAddress from "./MyAddress";
import "./Cart.scss";


const CheckOut = () => {
  const [select, setSelect] = useState(false);
  const [display, setDisplay] = useState(false);
  window.scrollTo(0, 0);
  return (
    <div>
      <div className="cart__title cart__checkout">
        <br></br>
        <div className="cart__title--text" >
          <div>
            <h1>THÔNG TIN NHẬN HÀNG</h1>
          </div>
          <div>
            {select ?
              <Button onClick={() => setSelect(false)}>Nhập địa chỉ mới</Button> :
              <Button onClick={() => setSelect(true)}> Chọn từ sổ tay địa chỉ của bạn</Button>}
          </div>
        </div>
        <hr></hr>
        <br></br>
        <br></br>
        <div style={{ display: select ? "none" : "block" }}>
          <InputAddress></InputAddress>
        </div>
        <div style={{ display: select ? "block" : "none" }}>
          <MyAddress></MyAddress>
        </div>
        <br></br>
        <br></br>
      </div>

    </div >
  );
};
export default CheckOut;
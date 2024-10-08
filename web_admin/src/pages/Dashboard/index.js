import { useEffect, useState } from "react";
import { getAllRevenueService } from "../../services/ordersService";
import { Line } from "@ant-design/plots";
import moment from "moment";
import { format } from 'fecha';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const Dashboard = () => {
  const [dataChart, setDataChart] = useState([]);

  useEffect(() => {
    const getDataChart = async () => {
      try {
        const response = await getAllRevenueService();
        if (response.success) {
          const data = [];
          response.data.map((item) => {
            data.push({
              "Ngày": moment.utc(item.saleDate).utcOffset('+07:00').format('DD/MM/YYYY '),
              "Tổng tiền": Number(item.totalAmount),
              // item.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
              // moment.utc(item.saleDate).utcOffset('+07:00').format('DD/MM/YYYY ')
            })
          })
          setDataChart(data);
        }
        else {
          console.log(response.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getDataChart();
  }, []);

  const config = {
    data: dataChart,
    xField: 'Ngày',
    yField: 'Tổng tiền',
    smooth: true,
    point: true,
    interaction: {
      tooltip: {
        render: (event, { title, items }) =>
          <div>
            <strong>Danh thu ngày {title}</strong>
            <br></br>
            <br></br>
            <p>{items[0].name} : {items[0].value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
          </div>
      },
    },
    axis: {
      x: { title: false, size: 50 },
      y: {
        title: false,
        size: 30,
        labelFormatter: '~s',
      }
    },
    slider: {
      x: { from: 0, to: 1 },
      y: {
        from: 0,
        to: 1,
        labelFormatter: '~s'
      },
    },
  };

  return (
    <div>
      <RangePicker />
      {dataChart.length > 0 &&
        <div className="admin">
          <h1>THỐNG KÊ</h1>
          <br></br>
          <Line {...config} />
        </div>
      }
    </div>
  )
}

export default Dashboard;
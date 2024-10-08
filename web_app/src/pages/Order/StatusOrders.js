import { Steps } from "antd"
import moment from "moment";
import { useEffect, useState } from "react";

const StatusOrders = (props) => {
  const { status, time } = props
  const [currentStep, setCurrentStep] = useState(0);

  const statusMap = {
    "Unconfirmed": 0,
    "Processing": 1,
    "Delivering": 2,
    "Completed": 3
  };

  useEffect(() => {
    setCurrentStep(statusMap[status]);
  }, [status]);

  // console.log(status)
  return (
    <>
      {/* {status} */}

      <Steps
        className="userOrder__steps"
        current={currentStep}
        items={[
          {
            title: 'Chờ xác nhận',
            description: 'Chúng tôi sẽ xác nhận đơn hàng nhanh nhất có thể',
            subTitle: `${statusMap[status] === 0 ? moment.utc(time).utcOffset('+07:00').format('HH:mm -- DD/MM ') : ''}`,
          },
          {
            title: 'Đang xử lý',
            description: 'Chúng tôi hiện đang xử lý đơn hàng',
            subTitle: `${statusMap[status] === 1 ? moment.utc(time).utcOffset('+07:00').format('HH:mm -- DD/MM ') : ''}`,
          },
          {
            title: 'Đang giao hàng',
            description: 'Đơn hàng đang được giao tới bạn',
            subTitle: `${statusMap[status] === 2 ? moment.utc(time).utcOffset('+07:00').format('HH:mm -- DD/MM ') : ''}`,
          },
          {
            title: 'Đã giao hàng',
            description: '',
            subTitle: `${statusMap[status] === 3 ? moment.utc(time).utcOffset('+07:00').format('HH:mm -- DD/MM ') : ''}`,
          }
        ]}
      />
    </>
  )
}

export default StatusOrders
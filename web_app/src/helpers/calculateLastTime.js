export const caCulateLastTime = (lastTime) => {
  const time = lastTime.split('.');
  if (time.length === 3) {
    const date = parseInt(time[0]);
    if (date < 7) {
      return `${date} ngày trước`;
    } else if (date < 30) {
      return `${Math.floor(date / 7)} tuần trước`;
    } else if (date < 365) {
      return `${Math.floor(date / 30)} tháng trước`;
    } else {
      return `${Math.floor(date / 365)} năm trước`;
    }
  }
  else {
    const [hours, minutes, second] = time[0].split(':');
    if (hours === "00" && minutes === "00") {
      return `${parseInt(second, 10)} giây trước`;
    }
    else if (hours === "00" && minutes !== "00") {
      return `${parseInt(minutes)} phút trước`;
    }
    else {
      return `${parseInt(hours)} giờ trước`;
    }
  }
}
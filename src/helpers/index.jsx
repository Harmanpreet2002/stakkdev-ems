export const formatWithLeadingZero = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const fullMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = formatWithLeadingZero(currentDate.getMonth() + 1);
  const day = formatWithLeadingZero(currentDate.getDate());
  return `${year}-${month}-${day}`;
};

export const calculateTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${formatWithLeadingZero(hours)}:${formatWithLeadingZero(
    minutes
  )}:${formatWithLeadingZero(remainingSeconds)}`;
};

export const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = formatWithLeadingZero(date.getDate());
  const month = formatWithLeadingZero(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatTime = (inputTime) => {
  const time = new Date(inputTime);
  const formattedTime = `${formatWithLeadingZero(
    time.getHours()
  )}:${formatWithLeadingZero(time.getMinutes())}:${formatWithLeadingZero(
    time.getSeconds()
  )}`;
  return formattedTime;
};

const DAY_OF_A_WEEK = {
  0: "Неділя",
  1: "Понеділок",
  2: "Вівторок",
  3: "Середа",
  4: "Четвер",
  5: "П'ятниця",
  6: "Субота",
};
const MONTH_OF_A_YEAR = {
  1: "Січня",
  2: "Лютого",
  3: "Березня",
  4: "Квітня",
  5: "Травня",
  6: "Червня",
  7: "Липня",
  8: "Серпня",
  9: "Вересня",
  10: "Жовтня",
  11: "Листопада",
  12: "Грудня",
};
let dayNum = 0;
function formatNumber(num, size = 2) {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: size,
    useGrouping: false,
  });
}

//////   UPDATE TIME  /////////////////////
var updateTime = () => {
  var time = new Date();
  var curTime = `${formatNumber(time.getHours())}:${formatNumber(
    time.getMinutes()
  )}`; //:${formatNumber(time.getSeconds())} seconds
  var curDate = ` ${DAY_OF_A_WEEK[time.getDay()]} ${time.getDate()} ${
    MONTH_OF_A_YEAR[time.getMonth() + 1]
  }`;
  headerClock.innerText = curDate + "\t" + curTime;
};
updateTime();
const timeInterval = setInterval(updateTime, 1000);

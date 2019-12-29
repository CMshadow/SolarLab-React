import Numeral from "./NumeralCustom";

const UtilFunctions = {
  monthList: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  daysList: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  getDayOfMonth: (month) => {
    return UtilFunctions.daysList[month - 1];
  },
  getDayOfMonthList: (month) => {
    let days = UtilFunctions.getDayOfMonth(month);
    return [...Array(days)].map((v, k) => (k + 1));
  },
  getMonthOfYearList: () => {
    return UtilFunctions.monthList;
  },
  getMonthName: (month) => {
    return UtilFunctions.monthList[month - 1];
  },
  getHourList: () => {
    return [...Array(24)].map((v, k) => (k + 1));
  },

  isoStringParser: (isoString) => {
    let t = new Date(isoString);
    return t.toLocaleString();
  },

  thousandMeterConverter: (value) => {
    if (value >= 1000)
      value = Numeral(value / 1000).format('0,0.0') + ' kM';
    else
      value = Numeral(value).format('0,0.0') + ' M';
    return value;
  },
};

export default UtilFunctions;
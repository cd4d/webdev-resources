// return a date formatted YY-MM-DD: dec 31 2010 -> 2010-12-31

module.exports = function getTodayDate(date) {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

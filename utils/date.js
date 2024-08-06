module.exports = {
  firstDay: function (date) {
    var date = new Date(date),
      y = date.getFullYear(),
      m = date.getMonth();
    return new Date(y, m, 1);
  },
  lastDay: function (date) {
    var date = new Date(date),
      y = date.getFullYear(),
      m = date.getMonth();
    return new Date(y, m + 1, 1);
  },
};

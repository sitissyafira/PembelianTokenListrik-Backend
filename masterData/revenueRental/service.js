const RevenueRental = require("./model").RevenueRental;

module.exports = {
  listRevenueRental: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let revenue;
      if (Object.keys(query).length === 0) {
        revenue = await RevenueRental.find()
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ revenueName: "ascending" });
      } else {
        revenue = await RevenueRental.find()
          .or([{ revenueName: { $regex: `${query.revenueName}` } }])
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (revenue) {
        return revenue;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstRevenueRentalById: async function (id) {
    try {
      const revenue = await RevenueRental.findById(id);
      if (revenue) {
        return revenue;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addRevenueRental: async function (eng) {
    try {
      const revenue = await new RevenueRental(eng).save();
      if (revenue) {
        return revenue;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  editRevenueRental: async function (id, eng) {
    try {
      const revenue = await RevenueRental.findByIdAndUpdate(id, eng);
      if (revenue) {
        return revenue;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteRevenueRental: async function (id) {
    try {
      const revenue = await RevenueRental.findByIdAndRemove(id);
      if (revenue) {
        return revenue;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

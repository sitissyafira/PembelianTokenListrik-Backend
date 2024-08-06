const Fiscal = require("./model").Fiscalasset;

module.exports = {
  listFiscal: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      // let fiscal = await Fiscal.find(query).skip(skip).limit(limit).sort({$natural:1});
      let fiscal;
      if (Object.keys(query).length === 0) {
        fiscal = await Fiscal.find()
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ fiscalName: "ascending" });
      } else {
        fiscal = await Fiscal.find()
          .or([{ fiscalName: { $regex: `${query.fiscalName}` } }])
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (fiscal) {
        return fiscal;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  lstFiscalById: async function (id) {
    try {
      const fiscal = await Fiscal.findById(id);
      if (fiscal) {
        return fiscal;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addFiscal: async function (eng) {
    try {
      const fiscal = await new Fiscal(eng).save();
      if (fiscal) {
        return fiscal;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  editFiscal: async function (id, eng) {
    try {
      const fiscal = await Fiscal.findByIdAndUpdate(id, eng);
      if (fiscal) {
        return fiscal;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteFiscal: async function (id) {
    try {
      const fiscal = await Fiscal.findByIdAndRemove(id);
      if (fiscal) {
        return fiscal;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

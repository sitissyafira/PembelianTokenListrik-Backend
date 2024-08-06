const Acctbank = require("./model").Acctbank;

module.exports = {
  listAcctbank: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let acctbank;
      if (Object.keys(query).length === 0) {
        acctbank = await Acctbank.find()
          .skip(skip)
          .limit(limit)
          .populate("bank", "-__v")
          .select("-__v")
          .sort({ acctName: "ascending" });
      } else {
        acctbank = await Acctbank.find()
          .or([{ acctName: { $regex: `${query.acctName}` } }])
          .skip(skip)
          .limit(limit)
          .populate("bank", "-__v")
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (acctbank) {
        return acctbank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstAcctbankById: async function (id) {
    try {
      const acctbank = await Acctbank.findById(id);
      if (acctbank) {
        return acctbank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addAcctbank: async function (eng) {
    try {
      const acctbank = await new Acctbank(eng).save();
      if (acctbank) {
        return acctbank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  editAcctbank: async function (id, eng) {
    try {
      const acctbank = await Acctbank.findByIdAndUpdate(id, eng);
      if (acctbank) {
        return acctbank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteAcctbank: async function (id) {
    try {
      const acctbank = await Acctbank.findByIdAndRemove(id);
      if (acctbank) {
        return acctbank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

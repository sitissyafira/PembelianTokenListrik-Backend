const Bank = require("./model").Bank;
const { Acct } = require("../COA/account/model");

module.exports = {
  listBank: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let bank;
      if (Object.keys(query).length === 0) {
        bank = await Bank.find().skip(skip).limit(limit).select("-__v").sort({ codeBank: "ascending" });
      } else {
        bank = await Bank.find()
          .or([{ bank: { $regex: `${query.bank}` } }])
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (bank) {
        return bank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  listBankCOA: async function (query) {
    try {
      let bankCOA;

      const getQuery = query.filter;

      bankCOA = await Acct.find({ acctNo: { $regex: "111-20-" } }, { createdDate: 0, __v: 0 })
        .sort({ acctNo: 1 })
        .lean();

      if (query.filter !== "") {
        let basketResult = [];

        for (let e of bankCOA) {
          basketResult.push(e.acctNo);
          basketResult.push(e.acctName);
        }

        const filterRes = basketResult.filter((x) => {
          if (new RegExp(getQuery, "gi").test(x)) return x;
        });

        if (new RegExp(/^\d/).test(getQuery)) {
          bankCOA = await Acct.find({ acctNo: { $in: filterRes } }, { createdDate: 0, __v: 0 })
            .sort({ acctNo: 1 })
            .populate("AccType")
            .lean();
        }

        if (new RegExp(/^[a-zA-Z]/).test(getQuery)) {
          bankCOA = await Acct.find({ acctName: { $in: filterRes } }, { createdDate: 0, __v: 0 })
            .sort({ acctNo: 1 })
            .populate("AccType")
            .lean();
        }
      }

      if (!bankCOA) return false;

      if (bankCOA) return bankCOA;
    } catch (e) {
      console.log(e);
    }
  },

  lstBankById: async function (id) {
    try {
      const bank = await Bank.findById(id);
      if (bank) {
        return bank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addBank: async function (eng) {
    try {
      const bank = await new Bank(eng).save();
      if (bank) {
        return bank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  editBank: async function (id, eng) {
    try {
      const bank = await Bank.findByIdAndUpdate(id, eng);
      if (bank) {
        return bank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteBank: async function (id) {
    try {
      const bank = await Bank.findByIdAndRemove(id);
      if (bank) {
        return bank;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

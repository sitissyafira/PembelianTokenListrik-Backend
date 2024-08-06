const { listBank, listBankCOA, lstBankById, addBank, editBank, deleteBank } = require("./service");

module.exports = {
  Bank: async function (req, res, next) {
    try {
      var str = JSON.parse(req.query.param);
      let query = {};
      const allData = await listBank({}, 1, 0);

      if (str.filter !== null) query = { bank: str.filter.bank };
      const bank = await listBank(query, str.pageNumber, str.limit);
      if (bank) {
        return res.status(200).json({ status: "success", data: bank, totalCount: allData.length });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },

  bankCOA: async function (req, res, next) {
    try {
      let str;
      let query = {};

      if (!req.query.params) query = { filter: "" };

      if (req.query.params) {
        str = JSON.parse(req.query.params);
        query = { filter: str.filter };
      }

      const bank = await listBankCOA(query);

      if (!bank) return res.status(500).json({ status: "error", data: "internal server error" });

      if (bank) return res.status(200).json({ status: "success", totalCount: bank.length, data: bank });
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },

  BankById: async function (req, res, next) {
    try {
      const list = await lstBankById(req.params.id);
      if (list) {
        return res.status(200).json({ status: "success", data: list });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  tambahBank: async function (req, res, next) {
    try {
      const addEng = await addBank(req.body);
      if (addEng) {
        return res.status(200).json({ status: "success", data: addEng });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  updateBank: async function (req, res, next) {
    try {
      const updateEng = await editBank(req.params.id, req.body);
      if (updateEng) {
        return res.status(200).json({ status: "success", data: updateEng });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  hapusBank: async function (req, res, next) {
    try {
      const hapusEng = await deleteBank(req.params.id);
      if (hapusEng) {
        return res.status(200).json({ status: "success", data: "data already delete" });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
};

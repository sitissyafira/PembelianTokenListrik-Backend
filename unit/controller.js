const {
  getUnitById,
  addUnit,
  deleteUnit,
  listUnit,
  listUnitById,
  updateUnit,
  getUnitByParent,
  listUnitBast,
  listUnitMobile,
  getUnitByParentMobile,
  listUnitByIdMobile,
  addUnitMobile,
  deleteUnitMobile,
  updateUnitMobile,
  getUnitByParentforPwr,
  getUnitByParentforWtr,
  getUnitByContract,
  getUnitByContractRenter,
  getUnitForContractID,
  searchUnitService,
  addLogAction, 
  updateLogAction, 
  deleteLogAction
} = require("./service");
const { listTenant } = require("../contract/tenant/service");
const { listOwnership } = require("../contract/owner/service");
const { listTransaksiforConsumption } = require("../water/transaksi/service");
const { listTransaksiforlastconsumption } = require("../power/transaksi/service");

module.exports = {
  addUnt: async function (req, res, next) {
    const unit = await addUnit(req.body);
    if (unit) {
      // -- Log Action (add kurnia)
      if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
      {
          const addlogaction = await addLogAction(req.body, req.user._id);
      }
      // --
      return res.status(200).json({ status: "success", data: unit });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  deleteUnt: async function (req, res, next) {
    const data = await listUnitById(req.params.id);
    const unit = await deleteUnit(req.params.id);
    if (unit) {
       // -- Log Action (add kurnia)
       if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
       {
           const deletelogaction = await deleteLogAction(data, req.user._id);
       }
       // --
      return res.status(200).json({ status: "success", data: "data already delete" });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  getByParentId: async function (req, res, next) {
    try {
      const unit = await getUnitByParent(req.params.id);
      if (unit) {
        return res.status(200).json({ status: "success", data: unit });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },

  getByUnitforPwr: async function (req, res, next) {
    try {
      const unit = await getUnitByParentforPwr(req.params.id);
      if (unit) {
        return res.status(200).json({ status: "success", data: unit });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },

  getByUnitforWtr: async function (req, res, next) {
    try {
      const unit = await getUnitByParentforWtr(req.params.id);
      if (unit) {
        return res.status(200).json({ status: "success", data: unit });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },

  getByUnitforContract: async function (req, res, next) {
    try {
      const unit = await getUnitByContract(req.params.id);
      if (unit) {
        return res.status(200).json({ status: "success", data: unit });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },

  getByUnitforContractRenter: async function (req, res, next) {
    try {
      const unit = await getUnitByContractRenter(req.params.id);
      if (unit) {
        return res.status(200).json({
          status: "success",
          data: unit,
        });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },

  listUnitFromBAST: async function (req, res, next) {
    const str = JSON.parse(req.query.param);
    let query = {};

    if (str.filter !== null) query = { cdunt: str.filter.cdunt };
    const unit = await listUnitBast(query, str.pageNumber, str.limit);
    if (unit) {
      return res.status(200).json({ status: "success", data: unit, totalCount: unit.length });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  listUntById: async function (req, res, next) {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);

    const unit = await listUnitById(req.params.id);
    const lastWater = await listTransaksiforConsumption({ billmnt: { $gte: fromDate, $lte: toDate }, wat: unit.wtrmtr }, 1, 0);
    const lastPower = await listTransaksiforlastconsumption({ billmnt: { $gte: fromDate, $lte: toDate }, pow: unit.pwrmtr }, 1, 0);

    if (unit) {
      return res.status(200).json({
        status: "success",
        data: unit,
        lastConsumtionWater: lastWater[0],
        lastConsumtionPower: lastPower[0],
      });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  findUnitByID: async function (req, res, next) {
    const unit = await getUnitById(req.params.id);
    if (unit) {
      return res.status(200).json({ status: "success", data: unit });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  getUnitCustomer: async function (req, res, next) {
    try {
      const costumerTenantUnit = await listTenant({ unit: req.params.id }, 1, 1000);
      if (costumerTenantUnit.length == 0) {
        const costumerOwnerUnit = await listOwnership({ unit: req.params.id }, 1, 1000);
        if (costumerOwnerUnit) {
          return res.status(200).json({ status: "status", data: costumerOwnerUnit });
        } else {
          return res.status(500).json({ status: "error", data: "internal server error" });
        }
      } else if (costumerTenantUnit) {
        return res.status(200).json({ status: "success", data: costumerTenantUnit });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  listUntRate: async function (req, res, next) {
    var str = JSON.parse(req.query.param);
    let query = {};
    if (str.filter !== null) {
      query = { unit_rate_name: str.filter.unit_rate_name };
    }
    const allData = await listUnitRate({}, 1, 0);
    const unitrate = await listUnitRate(query, str.pageNumber, str.limit);
    if (unitrate) {
      return res.status(200).json({
        status: "success",
        data: unitrate,
        totalCount: allData.length,
      });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  listUnt: async function (req, res, next) {
    const str = JSON.parse(req.query.param);
    let query = {};

    if (str.filter !== null) query = { cdunt: str.filter.cdunt };
    const allData = await listUnit({}, 1, 0);
    const unit = await listUnit(query, str.pageNumber, str.limit);
    if (unit) {
      return res.status(200).json({ status: "success", data: unit, totalCount: allData.length });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  listUntForParking: async function (req, res, next) {
    try {
      let query = {};
      const allData = await getUnitForContractID({}, 1, 0);
      const unit = await getUnitForContractID(query);

      if (unit) {
        return res.status(200).json({ status: "success", data: unit, totalCount: allData.length });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (error) {
      console.log(error);
    }
  },

  searchUnit: async function (req, res, next) {
    const str = JSON.parse(req.query.param);

    const allData = await searchUnitService({}, 1, 0);

    let query = {};
    if (str.filter !== null) query = { unit2: str.filter };

    const unit = await searchUnitService(query);

    if (unit) {
      return res.status(200).json({ status: "success", data: unit, totalCount: allData.length });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  updateUnt: async function (req, res, next) {
    const beforetransaksi = await listUnitById(req.params.id);
    const unit = await updateUnit(req.params.id, req.body);
    if (unit) {
      // -- Log Action (add kurnia)
      if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
      {
          const aftertransaksi = await listUnitById(req.params.id);
          const updatelogaction = await updateLogAction(beforetransaksi, aftertransaksi, req.user._id);
      }
      // --
      return res.status(200).json({ status: "success", data: unit });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  //mobile

  updateUntMobile: async function (req, res, next) {
    const beforetransaksi = await listUnitById(req.params.id);
    const unit = await updateUnitMobile(req.params.id, req.body);
    if (unit) {
       // -- Log Action (add rehan)
       if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
       {
           const aftertransaksi = await listUnitById(req.params.id);
           const updatelogaction = await updateLogAction(beforetransaksi, aftertransaksi, req.user._id);
       }
       // --
      return res.status(200).json({ status: "success", data: unit });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  listUntByIdMobile: async function (req, res, next) {
    const unit = await listUnitByIdMobile(req.params.id);
    if (unit) {
      return res.status(200).json({ status: "success", data: unit });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  listUntMobile: async function (req, res, next) {
    const list = await listUnitMobile(req.params.filter, req.params.page, req.params.limit);
    if (list) {
      return res.status(200).json({ status: "success", data: list, totalCount: list.length });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  getByParentIdMobile: async function (req, res, next) {
    try {
      const unit = await getUnitByParentMobile(req.params.id);
      if (unit) {
        return res.status(200).json({ status: "success", data: unit });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteUntMobile: async function (req, res, next) {
    const data = await listUnitById(req.params.id);
    const unit = await deleteUnitMobile(req.params.id);
    if (unit) {
      // -- Log Action (add kurnia)
      if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
      {
          const deletelogaction = await deleteLogAction(data, req.user._id);
      }
      // --
      return res.status(200).json({ status: "success", data: unit });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },

  addUntMobile: async function (req, res, next) {
    const unit = await addUnitMobile(req.body);
    if (unit) {
      // -- Log Action (add kurnia)
      if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
      {
          const addlogaction = await addLogAction(req.body, req.user._id);
      }
      // --
      return res.status(200).json({ status: "success", data: unit });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  },
};

/**
 *
 * Unit database services
 */

const UnitType = require("./model").UnitType;
const LogAction = require("../logAction/model").LogAction;

module.exports = {
  listUnitType: async function (query, page = 1, limit = 1000) {
    try {
      const skip = (page - 1) * limit;
      let unittype;
      if (Object.keys(query).length === 0) {
        unittype = await UnitType.find(query).skip(skip).limit(limit).select("-__v").sort({ unttp: "ascending" });
      } else {
        unittype = await UnitType.find()
          .or([{ unttp: { $regex: `${query.unttp}`, $options: "i" } }])
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (unittype) {
        return unittype;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstUnitTypeById: async function (id) {
    try {
      const unittype = await UnitType.findById(id);
      if (unittype) {
        return unittype;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  addUnitType: async function (type) {
    try {
      const unitType = await new UnitType(type).save();
      if (unitType) {
        return unitType;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  editUnitType: async function (id, unit) {
    try {
      const unittype = await UnitType.findByIdAndUpdate(id, unit);
      if (unittype) {
        return unittype;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteUnitType: async function (id) {
    try {
      const unittype = await UnitType.findByIdAndRemove(id);
      if (unittype) {
        return unittype;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addLogAction: async function (transaksi, _id) {
    try {
      const insert = {
        log_number: transaksi.unttp,
        log_category: "master",
        log_task: "Create Master Unit Type",
        log_status: "C",
        log_after: transaksi,
        updated_by: _id,
      };

      const createLogAction = await new LogAction(insert).save();

      if (createLogAction) {
        return createLogAction;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  updateLogAction: async function (beforetransaksi, transaksi, _id) {
    try {
      const insert = {
        log_number: transaksi.unttp,
        log_category: "master",
        log_task: "Update Master Unit Type",
        log_status: "U",
        log_before: beforetransaksi,
        log_after: transaksi,
        updated_by: _id,
      };

      const createLogAction = await new LogAction(insert).save();

      if (createLogAction) {
        return createLogAction;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteLogAction: async function (transaksi, _id) {
    try {
      const insert = {
        log_number: transaksi.unttp,
        log_category: "master",
        log_task: "Delete Master Unit Type",
        log_status: "D",
        log_after: transaksi,
        updated_by: _id,
      };

      const deleteLogAction = await new LogAction(insert).save();

      if (deleteLogAction) {
        return deleteLogAction;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

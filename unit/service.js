/**
 *
 * Unit database services
 */

const Unit = require("./model").Unit;
const Ownership = require("../contract/owner/model").Ownership;
const { Addplot } = require("../parkinglot/additional/model");
const LogAction = require("../logAction/model").LogAction;
function validationUnit() {}

const Floor = require("./../floor/model").Floor;

module.exports = {
  listUnit: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let unit;
      if (Object.keys(query).length === 0) {
        unit = await Unit.find({})
          .skip(skip)
          .limit(limit)
          .populate([
            {
              path: "flr",
              model: "Floor",
              select: "-__v",
              populate: {
                path: "blk",
                model: "Block",
                select: "-__v",
                populate: {
                  path: "grpid",
                  model: "BlockGroup",
                  select: "-__v",
                },
              },
            },
            {
              path: "unttp",
              model: "UnitType",
              select: "-__v",
            },
            {
              path: "untrt",
              model: "UnitRate",
              select: "-__v",
            },
          ])
          .select("-__v")
          .sort({ $natural: 1 });
      } else {
        unit = await Unit.find()
          .or([{ cdunt: { $regex: `${query.cdunt}`, $options: "i" } }])
          .skip(skip)
          .limit(limit)
          .populate([
            {
              path: "flr",
              model: "Floor",
              select: "-__v",
              populate: {
                path: "blk",
                model: "Block",
                select: "-__v",
                populate: {
                  path: "grpid",
                  model: "BlockGroup",
                  select: "-__v",
                },
              },
            },
            {
              path: "unttp",
              model: "UnitType",
              select: "-__v",
            },
            {
              path: "untrt",
              model: "UnitRate",
              select: "-__v",
            },
          ])
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  getUnitByParent: async function (id) {
    try {
      const unit = await Unit.find({ flr: id })
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .select("-__v");

      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  //for Power Meter

  getUnitByParentforPwr: async function (id) {
    try {
      const unit = await Unit.find({ $and: [{ flr: id }, { pwrmtr: null }] })
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .populate("Unit", "-__v")
        .select("-__v");
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  getUnitByParentforWtr: async function (id) {
    try {
      const unit = await Unit.find({ $and: [{ flr: id }, { wtrmtr: null }] })
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .populate("Unit", "-__v")
        .select("-__v");
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  getUnitByContract: async function (id) {
    try {
      const unit = await Unit.find({ flr: id, type: { $in: ["", null] } })
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .populate("Unit", "-__v")
        .select("-__v");
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  getUnitByContractRenter: async function (id) {
    try {
      const unit = await Unit.find({ $and: [{ flr: id }, { type: "owner" }, { isSewa: true }] })
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .populate("Unit", "-__v")
        .sort({ cdunt: 1 })
        .select("-__v");
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  listUnitBast: async function (query, pageNumber, limit) {
    try {
      const skip = (pageNumber - 1) * limit;
      let unit;
      unit = await Ownership.find({
        unit2: { $regex: `${query.cdunt}`, $options: "i" },
      })
        .skip(skip)
        .limit(limit)
        .select("unit unit2")
        .sort({ $natural: 1 })
        .lean();

      let newUnit = [];

      unit.map((item) => {
        unitItem = {
          _id: item.unit,
          nmunt: item.unit2,
        };
        newUnit.push(unitItem);
      });

      if (unit) {
        return newUnit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  listUnitById: async function (id) {
    try {
      const unit = await Unit.findById(id)
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .populate({
          path: "pwrmtr",
          model: "Power",
          select: "-__v",
          populate: {
            path: "rte",
            model: "RatePower",
            select: "-__v",
          },
        })
        .populate({
          path: "wtrmtr",
          model: "Water",
          select: "-__v",
          populate: {
            path: "rte",
            model: "RateWater",
            select: "-__v",
          },
        })
        .populate({
          path: "untrt",
          model: "UnitRate",
          select: "-__v",
        });

      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  getUnitForContractID: async function () {
    try {
      const unit = await Unit.find({
        $or: [{ type: "owner" }, { type: "pp" }, { type: "tenant" }],
      })
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .select("-__v");
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  searchUnitService: async function (query) {
    try {
      let unit;

      if (Object.keys(query).length === 0) {
        unit = await Unit.find({
          $or: [{ type: "owner" }, { type: "pp" }, { type: "tenant" }],
        })
          .populate({
            path: "flr",
            model: "Floor",
            select: "-__v",
            populate: {
              path: "blk",
              model: "Block",
              select: "-__v",
              populate: {
                path: "grpid",
                model: "BlockGroup",
                select: "-__v",
              },
            },
          })
          .limit(100)
          .sort({ cdunt: 1 })
          .select("-__v")
          .lean();
      } else if (query.unit2 === "" || query.unit2 !== "") {
        unit = await Unit.find({ cdunt: { $regex: query.unit2, $options: "i" } })
          .populate({
            path: "flr",
            model: "Floor",
            select: "-__v",
            populate: {
              path: "blk",
              model: "Block",
              select: "-__v",
              populate: {
                path: "grpid",
                model: "BlockGroup",
                select: "-__v",
              },
            },
          })
          .limit(50)
          .sort({ cdunt: 1 })
          .select("-__v")
          .lean();
      }

      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addUnit: async function (unit) {
    try {
      const newUnit = await new Unit(unit).save();
      if (newUnit) {
        return newUnit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  updateUnit: async function (id, unit) {
    try {
      const updateUnit = await Unit.findByIdAndUpdate(id, unit);
      if (updateUnit) {
        return updateUnit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  deleteUnit: async function (id) {
    try {
      const deleteUnit = await Unit.findByIdAndRemove(id);
      if (deleteUnit) {
        return deleteUnit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  getUnitById: async function (id) {
    try {
      const unit = await Unit.findById(id);
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  //mobile

  //delete unit mobile
  deleteUnitMobile: async function (id) {
    try {
      const deleteUnit = await Unit.findByIdAndRemove(id);
      if (deleteUnit) {
        return deleteUnit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  //update unit mobile
  updateUnitMobile: async function (id, unit) {
    try {
      const updateUnit = await Unit.findByIdAndUpdate(id, unit);
      if (updateUnit) {
        return updateUnit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  // add unit mobile
  addUnitMobile: async function (unit) {
    try {
      const newUnit = await new Unit(unit).save();
      if (newUnit) {
        return newUnit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  listUnitByIdMobile: async function (id) {
    try {
      const unit = await Unit.findById(id)
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .select("-__v");
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  //get unit by parent mobile
  getUnitByParentMobile: async function (id) {
    try {
      const unit = await Unit.find({ flr: id })
        .populate({
          path: "flr",
          model: "Floor",
          select: "-__v",
          populate: {
            path: "blk",
            model: "Block",
            select: "-__v",
            populate: {
              path: "grpid",
              model: "BlockGroup",
              select: "-__v",
            },
          },
        })
        .select("-__v");
      if (unit) {
        return unit;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  //list Unit Mobile
  listUnitMobile: async function (query, page = 1, limit = 1000) {
    try {
      const skip = (page - 1) * limit;
      unit = await Unit.find({})
        .skip(skip)
        .limit(limit)
        .populate([
          {
            path: "flr",
            model: "Floor",
            select: "-__v",
            populate: {
              path: "blk",
              model: "Block",
              select: "-__v",
              populate: {
                path: "grpid",
                model: "BlockGroup",
                select: "-__v",
              },
            },
          },
          {
            path: "unttp",
            model: "UnitType",
            select: "-__v",
          },
          {
            path: "untrt",
            model: "UnitRate",
            select: "-__v",
          },
        ])
        .select("-__v")
        .sort({ $natural: 1 });
      // }else{
      //     unit = await Unit.find().or([
      //         { 'cdunt': { $regex: `${query.cdunt}` }}
      //     ])
      //     .skip(skip)
      //     .limit(limit)
      //     .populate([{
      //         path: "flr",
      //         model: "Floor",
      //         select: "-__v",
      //         populate: {
      //             path: "blk",
      //             model: "Block",
      //             select: "-__v",
      //             populate: {
      //                 path: "grpid",
      //                 model: "BlockGroup",
      //                 select: "-__v",
      //             }
      //         }
      //     }, {
      //         path: "unttp",
      //         model: "UnitType",
      //         select: "-__v",
      //     },
      //     {
      //         path: "untrt",
      //         model: "UnitRate",
      //         select: "-__v",
      //     }]).select('-__v')
      //     .sort({$natural:1});
      // }

      if (unit) {
        return unit;
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
        log_number: transaksi.cdunt,
        log_category: "master",
        log_task: "Create Master Unit",
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
        log_number: transaksi.cdunt,
        log_category: "master",
        log_task: "Update Master Unit",
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
        log_number: transaksi.cdunt,
        log_category: "master",
        log_task: "Delete Master Unit",
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

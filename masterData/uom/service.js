const Uom = require("./model").Uom;

module.exports = {
  listUom: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let uom;
      if (Object.keys(query).length === 0) {
        uom = await Uom.find()
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ uomAssetTypeName: "ascending" });
      } else {
        uom = await Uom.find()
          .or([{ uom: { $regex: `${query.uom}` } }])
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (uom) {
        return uom;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstUomById: async function (id) {
    try {
      const uom = await Uom.findById(id);
      if (uom) {
        return uom;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addUom: async function (eng) {
    try {
      const uom = await new Uom(eng).save();
      if (uom) {
        return uom;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  editUom: async function (id, eng) {
    try {
      const uom = await Uom.findByIdAndUpdate(id, eng);
      if (uom) {
        return uom;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteUom: async function (id) {
    try {
      const uom = await Uom.findByIdAndRemove(id);
      if (uom) {
        return uom;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

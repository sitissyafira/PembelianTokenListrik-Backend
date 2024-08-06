const Fixed = require("./model").Fixedasset;

module.exports = {
  listFixed: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let fixed;
      if (Object.keys(query).length === 0) {
        fixed = await Fixed.find()
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .populate("fiscalFixedType", "-__v")
          .sort({ fixedAssetTypeName: "ascending" });
      } else {
        fixed = await Fixed.find()
          .or([{ fixedAssetTypeName: { $regex: `${query.fixedAssetTypeName}` } }])
          .skip(skip)
          .limit(limit)
          .populate("fiscalFixedType", "-__v")
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (fixed) {
        return fixed;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstFixedById: async function (id) {
    try {
      const fixed = await Fixed.findById(id);
      if (fixed) {
        return fixed;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addFixed: async function (eng) {
    try {
      const fixed = await new Fixed(eng).save();
      if (fixed) {
        return fixed;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  editFixed: async function (id, eng) {
    try {
      const fixed = await Fixed.findByIdAndUpdate(id, eng);
      if (fixed) {
        return fixed;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteFixed: async function (id) {
    try {
      const fixed = await Fixed.findByIdAndRemove(id);
      if (fixed) {
        return fixed;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

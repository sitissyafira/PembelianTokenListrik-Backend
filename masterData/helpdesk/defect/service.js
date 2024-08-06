/**
 *
 * Defect database services
 */

const Defect = require("./model").Defect;
const Category = require("../category/model").Category;

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

module.exports = {
  listDefect: async function (query, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      let defect;
      if (Object.keys(query).length === 0) {
        defect = await Defect.find()
          .skip(skip)
          .limit(limit)
          .populate({
            path: "category",
            model: "Category",
            select: "-__v",
          })
          .select("-__v")
          .sort({ $natural: 1 });
      } else {
        defect = await Defect.find()
          .or([
            {
              defect_name: { $regex: query.defect_name },
            },
          ])
          .skip(skip)
          .limit(limit)
          .populate({
            path: "category",
            model: "Category",
            select: "-__v",
          })
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (defect) {
        return defect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  findDefectByParent: async function (id) {
    try {
      const defect = await Defect.find({ category: id });

      if (defect) {
        return defect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstDefectById: async function (id) {
    try {
      const defect = await Defect.findById(id);
      if (defect) {
        return defect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  listCategory: async function (query, page = 1, limit = 1000) {
    try {
      const skip = (page - 1) * limit;
      const category = await Category.find(query).skip(skip).limit(limit);
      if (category) {
        return category;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  lstCategoryById: async function (id) {
    try {
      const category = await Category.findById(id);
      if (category) {
        return category;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addDefect: async function (def) {
    try {
      const defect = await new Defect(def).save();
      if (defect) {
        return defect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  editDefect: async function (id, def) {
    try {
      const defect = await Defect.findByIdAndUpdate(id, def);
      if (defect) {
        return defect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  deleteDefect: async function (id) {
    try {
      const defect = await Defect.findByIdAndRemove(id);
      if (defect) {
        return defect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  GenerateDefectCode: async function (val) {
    try {
      const defectCount = await Defect.countDocuments();
      const newNumber = pad(defectCount + 1, 5);
      var code = newNumber;

      return code;
    } catch (e) {
      console.log(e);
    }
  },
};

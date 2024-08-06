/**
 *
 * SubDefect database services
 */

const SubDefect = require("./model").SubDefect;
const Defect = require("../defect/model").Defect;

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
          .populate("category", "-__v")
          .select("-__v")
          .sort({ $natural: 1 });
      } else {
        defect = await Defect.find()
          .or([
            {
              subtype: { $regex: query.subtype },
            },
          ])
          .skip(skip)
          .limit(limit)
          .populate("category", "-__v")
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

  listSubDefect: async function (query, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      let subdefect;
      if (Object.keys(query).length === 0) {
        subdefect = await SubDefect.find()
          .skip(skip)
          .limit(limit)
          .populate("defect", "-__v")
          .populate("category", "-__v")
          .select("-__v")
          .sort({ $natural: 1 });
      } else {
        subdefect = await SubDefect.find()
          .or([
            {
              subtype: { $regex: query.subtype },
            },
          ])
          .skip(skip)
          .limit(limit)
          .populate("defect", "-__v")
          .populate("category", "-__v")
          .select("-__v")
          .sort({ $natural: 1 });
      }

      if (subdefect) {
        return subdefect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  findSubDefectByParent: async function (id) {
    try {
      const subdefect = await SubDefect.find({ defect: id }).select("-__v");
      if (subdefect) {
        return subdefect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstSubDefectById: async function (id) {
    try {
      const subdefect = await SubDefect.findById(id)
        .populate("defect", "-__v")
        .populate("category", "-__v");

      if (subdefect) {
        return subdefect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  listDefect: async function (query, page = 1, limit = 1000) {
    try {
      const skip = (page - 1) * limit;
      const defect = await Defect.find(query).skip(skip).limit(limit).populate({ path: "Defect" });
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

  addSubDefect: async function (def) {
    try {
      const subdefect = await new SubDefect(def).save();
      if (subdefect) {
        return subdefect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  editSubDefect: async function (id, def) {
    try {
      const subdefect = await SubDefect.findByIdAndUpdate(id, def);
      if (subdefect) {
        return subdefect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  deleteSubDefect: async function (id) {
    try {
      const subdefect = await SubDefect.findByIdAndRemove(id);
      if (subdefect) {
        return subdefect;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  GenerateSubDefectCode: async function (val) {
    try {
      const subdefectCount = await SubDefect.countDocuments();
      const newNumber = pad(subdefectCount + 1, 5);
      var code = newNumber;

      return code;
    } catch (e) {
      console.log(e);
    }
  },
};

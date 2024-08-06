/**
 *
 * Engineer database services
 */

const Engineer = require("./model").Engineer;

module.exports = {
  listEngineer: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let engineer;
      if (Object.keys(query).length === 0) {
        engineer = await Engineer.find()
          .skip(skip)
          .populate("department division shift")
          .limit(limit)
          .select("-__v")
          .sort({ $natural: 1 });
      } else {
        engineer = await Engineer.find()
          .or([{ name: { $regex: `${query.name}` } }])
          .skip(skip)
          .populate("department division shift")
          .limit(limit)
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (engineer) {
        return engineer;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstEngineerById: async function (id) {
    try {
      const engineer = await Engineer.findById(id).populate("department division shift");
      if (engineer) {
        return engineer;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addEngineer: async function (eng) {
    try {
      const engineer = await new Engineer(eng).save();
      if (engineer) {
        return engineer;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  editEngineer: async function (id, eng) {
    try {
      const engineer = await Engineer.findByIdAndUpdate(id, eng);
      if (engineer) {
        return engineer;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  deleteEngineer: async function (id) {
    try {
      const engineer = await Engineer.findByIdAndRemove(id);
      if (engineer) {
        return engineer;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  getEngineerCode: async function (val) {
    try {
      var a = new Date();
      var month = ("0" + (a.getMonth() + 1)).slice(-2);
      var date = ("0" + a.getDate()).slice(-2);
      var year = a.getFullYear().toString().substr(-2);
      var unique = Math.floor(1000 + Math.random() * 9000);
      var code = "TC-" + date + month + year + "-" + unique;
      console.log(code);
      return code;
    } catch (e) {
      console.log(e);
    }
  },
};

const { listRole, lstRoleById, addRole, editRole, deleteRole } = require("./service");

const Role = require("./model").Role;
const Sequence = require("../../models/sequence");

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

module.exports = {
  roleCodeGenerator: async function (req, res, next) {
    try {
      const dates = new Date();
      const sequences = await Sequence.find({
        menu: "role",
        year: dates.getFullYear(),
      });

      const newNumber = pad(sequences[0].sequence, 6);
      const code = "ROLE" + "-" + newNumber;

      res.status(200).json({
        status: "success",
        data: code,
      });
    } catch (error) {
      console.error(error);
      return errorHandler(error);
    }
  },

  tambahRole: async function (req, res, next) {
    try {
      const dates = new Date();
      const createRole = await Role.create(req.body);

      if (createRole) {
        return res.status(200).json({ status: "success", data: createRole });
      } else {
        res.status(500).json({
          status: "error",
          data: "Something Went Wrong",
        });
      }
    } catch (error) {
      console.error(error);
      return errorHandler(error);
    }
  },

  Role: async function (req, res, next) {
    try {
      var str = JSON.parse(req.query.param);
      let query = {};
      const allData = await listRole({}, 1, 0);

      if (str.filter !== null) query = { role: str.filter.role };
      const role = await listRole(query, str.pageNumber, str.limit);
      if (role) {
        return res.status(200).json({ status: "success", data: role, totalCount: allData.length });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },

  RoleById: async function (req, res, next) {
    try {
      const list = await lstRoleById(req.params.id);
      if (list) {
        return res.status(200).json({ status: "success", data: list });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },

  updateRole: async function (req, res, next) {
    try {
      const updateEng = await editRole(req.params.id, req.body);
      if (updateEng) {
        return res.status(200).json({ status: "success", data: updateEng });
      } else {
        return res.status(500).json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },

  hapusRole: async function (req, res, next) {
    try {
      const hapusEng = await deleteRole(req.params.id);
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

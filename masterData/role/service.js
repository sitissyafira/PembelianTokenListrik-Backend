const Role = require("./model").Role;

module.exports = {
  listRole: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let role;

      if (Object.keys(query).length === 0) {
        role = await Role.find().skip(skip).limit(limit).select("-__v").sort({ role: "ascending" });
      } else {
        role = await Role.find()
          .or([{ role: { $regex: `${query.role}`, $options: "i" } }])
          .skip(skip)
          .limit(limit)
          .select("-__v")
          .sort({ $natural: 1 });
      }
      if (role) {
        return role;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  lstRoleById: async function (id) {
    try {
      const role = await Role.findById(id);
      if (role) {
        return role;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addRole: async function (eng) {
    try {
      const role = await new Role(eng).save();
      if (role) {
        return role;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  editRole: async function (id, eng) {
    try {
      const role = await Role.findByIdAndUpdate(id, eng);
      if (role) {
        return role;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteRole: async function (id) {
    try {
      const role = await Role.findByIdAndRemove(id);
      if (role) {
        return role;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

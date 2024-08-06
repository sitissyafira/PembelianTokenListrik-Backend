/**
 * User database services
 *
 * @type {*|User Service}
 */
const User = require("./../models/user");
const Role = require("./../masterData/role/model");

module.exports = {
  /**
   *Find all user
   *
   * @param query
   * @param page
   * @param limit
   * @returns {User}
   *
   */

  findAll: async function (query, pageNumber = 1, limit = 1000) {
    try {
      const skip = (pageNumber - 1) * limit;
      let users;
      if (Object.keys(query).length === 0) {
        users = await User.find(query).select(["-password", "-__v"]).populate("role").skip(skip).limit(limit).sort({ updated_date: -1 }).lean();
      } else {
        users = await User.find()
          .or([{ username: { $regex: `${query.username}` } }])
          .select(["-password", "-__v"])
          .populate("role")
          .skip(skip)
          .limit(limit)
          .sort({ updated_date: -1 })
          .lean();
      }

      if (users) {
        return users;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  /**
   *
   * @param username
   * @returns {User}
   */
  findByUsername: async function (username) {
    try {
      var user = await User.findOne({ username }).populate({
        path: "role",
        model: "Role",
        select: "-__v",
      });
      return user;
    } catch (e) {
      console.log(e);
    }
  },
  /**
   *
   * @param id
   * @returns {User}
   */
  findUser: async function (id) {
    try {
      var user = await User.findById(id)
        .select("username last_name first_name role userUnits")
        .populate("role", "role")
        .populate("userUnits", "nmunt");
      return user;
    } catch (e) {
      console.log(e);
    }
  },
  /**
   *
   * @param user
   * @returns {User}
   */
  createUser: async function (user) {
    const userData = user;
    try {
      let newUser = await new User(userData).save();
      if (newUser) {
        return newUser;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  /**
   *
   * @param id
   * @param user
   * @returns {User}
   */
  updateUser: async function (id, user) {
    try {
      var updatedUser = await User.findByIdAndUpdate(id, user).populate({
        path: "role",
        model: "Role",
        select: "-__v",
      });
      if (updatedUser) {
        return updatedUser;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  /**
   *
   * @param id
   * @returns {Promise<boolean>}
   */

  updateFCMToken: async function (id, body) {
    try {
      const updateToken = await User.findByIdAndUpdate(id, body);
      if (updateToken) {
        return updateToken;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  },
  deleteUser: async function (id) {
    try {
      var deletedUser = await User.findByIdAndRemove(id);
      if (deletedUser) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
};

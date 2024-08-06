const { InternalUser } = require("./model")

module.exports = {
    listInternalUser: async function (query, pageNumber = 1, limit = 10000) {
        try {
          const skip = (pageNumber - 1) * limit;
          let internalUser;
          if (Object.keys(query).length === 0) {
            internalUser = await InternalUser.find()
              .skip(skip)
              .limit(limit)
              .populate("department division location shift")
              .sort({ $natural: -1 });
          } else {
            internalUser = await InternalUser.find()
              .or([{ name: { $regex: `${query.name}`, $options: "i" } }])
              .skip(skip)
              .limit(limit)
              .populate("department division location shift")
              .sort({ $natural: -1 });
          }
          if (internalUser) {
            return internalUser;
          } else {
            return false;
          }
        } catch (e) {
          console.log(e);
        }
      },
}
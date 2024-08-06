const { ExternalUser } = require("./model")

module.exports = {
    listExternalUser: async function (query, pageNumber = 1, limit = 10000) {
        try {
          const skip = (pageNumber - 1) * limit;
          let externalUser;
          if (Object.keys(query).length === 0) {
            externalUser = await ExternalUser.find()
              .skip(skip)
              .limit(limit)
              .populate("department division location shift")
              .sort({ $natural: -1 });
          } else {
            externalUser = await ExternalUser.find()
              .or([{ name: { $regex: `${query.name}`, $options: "i" } }])
              .skip(skip)
              .limit(limit)
              .populate("department division location shift")
              .sort({ $natural: -1 });
          }
          if (externalUser) {
            return externalUser;
          } else {
            return false;
          }
        } catch (e) {
          console.log(e);
        }
      },
}
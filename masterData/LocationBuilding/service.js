const { LocationBuilding } = require("./model")

module.exports = {
    listLocationBuilding: async function (query, pageNumber = 1, limit = 10000) {
        try {
          const skip = (pageNumber - 1) * limit;
          let locationBuilding;
          if (Object.keys(query).length === 0) {
            locationBuilding = await LocationBuilding.find()
              .skip(skip)
              .limit(limit)
              .sort({ $natural: 1 });
          } else {
            locationBuilding = await LocationBuilding.find()
              .or([{ name: { $regex: `${query.name}` } }])
              .skip(skip)
              .limit(limit)
              .sort({ $natural: 1 });
          }
          if (locationBuilding) {
            return locationBuilding;
          } else {
            return false;
          }
        } catch (e) {
          console.log(e);
        }
      },
}
const { ShiftSchedule } = require("./model")
const { Engineer } = require("../engineer/model")
const { ExternalUser } = require("../externalUser/model")
const { InternalUser } = require("../internalUser/model")

module.exports = {
    listShiftSchedule: async function (query, pageNumber = 1, limit = 10000) {
        try {
          const skip = (pageNumber - 1) * limit;
          let shiftSchedule;
          if (Object.keys(query).length === 0) {
            shiftSchedule = await ShiftSchedule.find()
              .populate("department division")
              .skip(skip)
              .limit(limit)
              .sort({ $natural: 1 });
          } else {
            shiftSchedule = await ShiftSchedule.find()
              .or([{ name: { $regex: `${query.name}`, $options: "i" } }])
              .populate("department division")
              .skip(skip)
              .limit(limit)
              .sort({ $natural: 1 });
          }
          if (shiftSchedule) {
            return shiftSchedule;
          } else {
            return false;
          }
        } catch (e) {
          console.log(e);
        }
      },
  
    listShiftScheduleMobile: async function (query, pageNumber = 1, limit = 10000) {
        try {
          const skip = (pageNumber - 1) * limit;
          let shiftSchedule;
          if (Object.keys(query).length === 0) {
            shiftSchedule = await ShiftSchedule.find()
              .populate("department division")
              .skip(skip)
              .limit(limit)
              .sort({ $natural: 1 });
          } else {
            shiftSchedule = await ShiftSchedule.find(query)
              .populate("department division")
              .skip(skip)
              .limit(limit)
              .sort({ $natural: 1 });
          }
          if (shiftSchedule) {
            return shiftSchedule;
          } else {
            return false;
          }
        } catch (e) {
          console.log(e);
        }
      },
  
   findUserDivision: async function (id, role) {
    try{
      let division = ''
      if(role === "engineer"){
        division = await Engineer.findById(id)
      }
      else if(role === "security" || role === "housekeeping"){
        division = await ExternalUser.findById(id)
      }
      else {
        division = await InternalUser.findById(id)
      }

      return division
    }
    catch(e){

    }
   }
}
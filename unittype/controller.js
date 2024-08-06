const {addUnitType, deleteUnitType, editUnitType, listUnitType, lstUnitTypeById, addLogAction, updateLogAction, deleteLogAction} = require("./service");

module.exports = {
    unitType: async function (req, res, next) {
        try {
            var str = JSON.parse(req.query.param);
            let query = {};
            const allData = await listUnitType({}, 1, 0);
            if (str.filter !== null){
                query = {unttp: str.filter.unttp};
            }
            const list = await listUnitType(query, str.pageNumber, str.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    unitTypeById: async function(req, res, next){
        try {
            const list = await lstUnitTypeById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahUnitType: async function (req, res, next) {
        try {
            const addUnit = await addUnitType(req.body);
            if (addUnit) {
                // -- Log Action (add kurnia)
                if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
                {
                    const addlogaction = await addLogAction(req.body, req.user._id);
                }
                // --
                return res.status(200).json({"status": "success", "data": addUnit});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateUnitType: async function (req, res, next) {
        try {
            const beforetransaksi = await lstUnitTypeById(req.params.id);
            const updateUnit = await editUnitType(req.params.id, req.body);
            if (updateUnit) {
                // -- Log Action (add kurnia)
                if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
                {
                    const aftertransaksi = await lstUnitTypeById(req.params.id);
                    const updatelogaction = await updateLogAction(beforetransaksi, aftertransaksi, req.user._id);
                }
                // --
                return res.status(200).json({"status": "success", "data": updateUnit});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },

    hapusUnitType: async function (req, res, next) {
        try {
            const data = await lstUnitTypeById(req.params.id);
            const hapusUnit = await deleteUnitType(req.params.id);
            if (hapusUnit) {
                // -- Log Action (add kurnia)
                if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
                {
                    const deletelogaction = await deleteLogAction(data, req.user._id);
                }
                // --
                return res.status(200).json({"status": "success", "data": "success delete unit type data"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    }
};
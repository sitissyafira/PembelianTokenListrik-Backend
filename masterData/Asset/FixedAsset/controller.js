const {listFixed, lstFixedById, addFixed, editFixed, deleteFixed } = require("./service");

module.exports = {
    Fixed: async function (req, res, next) {
        try {
            var str = JSON.parse(req.query.param);
            let query = {}
            const allData = await listFixed({}, 1, 0);

            if(str.filter !== null) query={fixedAssetTypeName: str.filter.fixedAssetTypeName};
            const fixed = await listFixed(query, str.pageNumber, str.limit);

            if (fixed) {
                return res.status(200).json({"status": "success", "data": fixed, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    FixedById: async function(req, res, next){
        try {
            const list = await lstFixedById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahFixed: async function (req, res, next) {
        try {
            const addEng = await addFixed(req.body);
            if (addEng) {
                return res.status(200).json({"status": "success", "data": addEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateFixed: async function (req, res, next) {
        try {
            const updateEng = await editFixed(req.params.id, req.body);
            if (updateEng) {
                return res.status(200).json({"status": "success", "data": updateEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusFixed: async function (req, res, next) {
        try {
            const hapusEng = await deleteFixed(req.params.id);
            if (hapusEng) {
                return res.status(200).json({"status": "success", "data": "data already delete"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
};
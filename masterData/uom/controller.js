const {listUom, lstUomById, addUom, editUom, deleteUom } = require("./service");

module.exports = {
    Uom: async function (req, res, next) {
        try {
            var str = JSON.parse(req.query.param);
            let query = {}
            const allData = await listUom({}, 1, 0);

            if(str.filter !== null) query={uom: str.filter.uom};
            const uom = await listUom(query, str.pageNumber, str.limit);

            if (uom) {
                return res.status(200).json({"status": "success", "data": uom, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    UomById: async function(req, res, next){
        try {
            const list = await lstUomById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahUom: async function (req, res, next) {
        try {
            const addEng = await addUom(req.body);
            if (addEng) {
                return res.status(200).json({"status": "success", "data": addEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateUom: async function (req, res, next) {
        try {
            const updateEng = await editUom(req.params.id, req.body);
            if (updateEng) {
                return res.status(200).json({"status": "success", "data": updateEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusUom: async function (req, res, next) {
        try {
            const hapusEng = await deleteUom(req.params.id);
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
const {listFiscal, lstFiscalById, addFiscal, editFiscal, deleteFiscal, getFiscalCode} = require("./service");

module.exports = {
    Fiscal: async function (req, res, next) {
        try {
            var str = JSON.parse(req.query.param);
            let query = {}
            const allData = await listFiscal({}, 1, 0);

            if(str.filter !== null) query={fiscalName: str.filter.fiscalName};
            const fiscal = await listFiscal(query, str.pageNumber, str.limit);

            if (fiscal) {
                return res.status(200).json({"status": "success", "data": fiscal, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    FiscalById: async function(req, res, next){
        try {
            const list = await lstFiscalById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahFiscal: async function (req, res, next) {
        try {
            const addEng = await addFiscal(req.body);
            if (addEng) {
                return res.status(200).json({"status": "success", "data": addEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateFiscal: async function (req, res, next) {
        try {
            const updateEng = await editFiscal(req.params.id, req.body);
            if (updateEng) {
                return res.status(200).json({"status": "success", "data": updateEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusFiscal: async function (req, res, next) {
        try {
            const hapusEng = await deleteFiscal(req.params.id);
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
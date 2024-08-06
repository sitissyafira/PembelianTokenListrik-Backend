const {listSubDefect, lstSubDefectById, addSubDefect, editSubDefect, deleteSubDefect, GenerateSubDefectCode, 
    findSubDefectByParent, listDefect, lstDefectById} = require("./service");

module.exports = {
    SubDefect: async function (req, res, next) {
        try {
            
            const str = JSON.parse(req.query.param);
            const allData = await listSubDefect({}, 1, 0);
            let query = {}
            if(str.filter !== null) query = {subtype: str.filter.subtype}
            const subdefect = await listSubDefect(query, str.pageNumber, str.limit);
            if (subdefect) {
                return res.status(200).json({"status": "success", "data": subdefect, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    listDefect: async function (req, res, next) {
        try {
            const list = await listDefect(req.params.filter, req.params.page, req.params.limit);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    SubDefectById: async function(req, res, next){
        try {
            const list = await lstSubDefectById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    DefectById: async function(req, res, next){
        try {
            const list = await lstDefectById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    SubDefectByParent: async function(req, res, next){
        try {
            const list = await findSubDefectByParent(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahSubDefect: async function (req, res, next) {
        try {
            const addDef = await addSubDefect(req.body);
            if (addDef) {
                return res.status(200).json({"status": "success", "data": addDef});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateSubDefect: async function (req, res, next) {
        try {
            const updateDef = await editSubDefect(req.params.id, req.body);
            if (updateDef) {
                return res.status(200).json({"status": "success", "data": "update success!"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusSubDefect: async function (req, res, next) {
        try {
            const hapusDef = await deleteSubDefect(req.params.id);
            if (hapusDef) {
                return res.status(200).json({"status": "success", "data": "Delete Success!"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    SubDefectGenerator: async function(req, res, next){
        try {
            const number = await GenerateSubDefectCode(req.params.id);
            if(number){
                res.status(200).json({status: "success", data: number});
            }else{
                res.status(500).json({status: "error", data: "internal server error"});
            }
        }catch (e) {
            res.status(500).json({status: "error", data: e});
        }
    },
};
const {listCategory, lstCategoryById, addCategory, editCategory, deleteCategory, GenerateCategoryCode} = require("./service");

module.exports = {
    CategoryMobile: async function (req, res, next) {
        try {
        let query = {};
        const allData = await listCategory({}, 1, 0);
        if (allData) {
            return res.status(200).json({"status": "success", "data": allData, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
        } catch (e) {
            console.log(e);
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    
    Category: async function (req, res, next) {
        try {
        const str = JSON.parse(req.query.param);
        const allData = await listCategory({}, 1, 0);

        let query = {};
        if(str.filter !== null) query = {name: str.filter.name}
        const category = await listCategory(query, str.pageNumber, str.limit);
        if (category) {
            return res.status(200).json({"status": "success", "data": category, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
        } catch (e) {
            console.log(e);
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    CategoryById: async function(req, res, next){
        try {
            const list = await lstCategoryById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahCategory: async function (req, res, next) {
        try {
            const addCat = await addCategory(req.body);
            if (addCat) {
                return res.status(200).json({"status": "success", "data": addCat});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateCategory: async function (req, res, next) {
        try {
            const updateCat = await editCategory(req.params.id, req.body);
            if (updateCat) {
                return res.status(200).json({"status": "success", "data": updateCat});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusCategory: async function (req, res, next) {
        try {
            const hapusCat = await deleteCategory(req.params.id);
            if (hapusCat) {
                return res.status(200).json({"status": "success", "data": hapusCat});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    CategoryGenerator: async function(req, res, next){
        try {
            const number = await GenerateCategoryCode(req.params.id);
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
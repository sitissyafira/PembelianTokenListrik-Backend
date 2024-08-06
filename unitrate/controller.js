const {addUnitRate, deleteUnitRate, listUnitRate, getUnitRateById, updateUnitRate, addLogAction, updateLogAction, deleteLogAction} = require("./service");
const {listTenant} = require("../contract/tenant/service");
const {listOwnership} = require("../contract/owner/service");

module.exports = {
    addUntRate : async function(req, res, next){
        const unitrate = await addUnitRate(req.body);
        if(unitrate){
            
            // -- Log Action (add kurnia)
            if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
            {
                const addlogaction = await addLogAction(req.body, req.user._id);
            }
            // --
            return res.status(200).json({"status": "success", "data": unitrate});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    deleteUntRate : async function(req, res, next){
        const data = await getUnitRateById(req.params.id);
        const unitrate = await deleteUnitRate(req.params.id);
        if(unitrate){

            // -- Log Action (add kurnia)
            if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
            {
                const deletelogaction = await deleteLogAction(data, req.user._id);
            }
            // --
            return res.status(200).json({"status": "success", "data": "data already delete"});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    listUntRate : async function(req, res, next){
        var str = JSON.parse(req.query.param);
        let query = {};
        if (str.filter !== null){
            query = {unit_rate_name: str.filter.unit_rate_name};
        }
        const allData = await listUnitRate({}, 1, 0);
        const unitrate = await listUnitRate(query, str.pageNumber, str.limit);
        if(unitrate){
            return res.status(200).json({"status": "success", "data": unitrate, "totalCount": allData.length});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    listUntRateById : async function(req, res, next){
        const unitrate = await getUnitRateById(req.params.id);
        if(unitrate){
            return res.status(200).json({"status": "success", "data": unitrate});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    },
    updateUntRate : async function(req, res, next){
        const beforetransaksi = await getUnitRateById(req.params.id);
        const unitrate = await updateUnitRate(req.params.id, req.body);
        if(unitrate){
            // -- Log Action (add kurnia)
            if (process.env.LOG_ACTION_STATUS && process.env.LOG_ACTION_STATUS == 1)
            {
                const aftertransaksi = await getUnitRateById(req.params.id);
                const updatelogaction = await updateLogAction(beforetransaksi, aftertransaksi, req.user._id);
            }
            // --
            return res.status(200).json({"status": "success", "data": unitrate});
        }else{
            return res.status(500).json({"status": "error", "data": "internal server error"});
        }
    }
};
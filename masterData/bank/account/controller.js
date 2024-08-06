const {listAcctbank, lstAcctbankById, addAcctbank, editAcctbank, deleteAcctbank } = require("./service");
const errorHandler = require("../../../controllers/errorController");
const services = require("../../../services/handlerFactory");
const AcctBank = require("./model").Acctbank;

module.exports = {
    Acctbank: async function (req, res, next) {
        try {
            var str = JSON.parse(req.query.param);
            let query = {}
            const allData = await listAcctbank({}, 1, 0);

            if(str.filter !== null) query={acctName: str.filter.acctName};
            const acctbank = await listAcctbank(query, str.pageNumber, str.limit);

            if (acctbank) {
                return res.status(200).json({"status": "success", "data": acctbank, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    AcctbankById: async function(req, res, next){
        try {
            const list = await lstAcctbankById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahAcctbank: async function (req, res, next) {
        try {
            const addEng = await addAcctbank(req.body);
            if (addEng) {
                return res.status(200).json({"status": "success", "data": addEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateAcctbank: async function (req, res, next) {
        try {
            const updateEng = await editAcctbank(req.params.id, req.body);
            if (updateEng) {
                return res.status(200).json({"status": "success", "data": updateEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusAcctbank: async function (req, res, next) {
        try {
            const hapusEng = await deleteAcctbank(req.params.id);
            if (hapusEng) {
                return res.status(200).json({"status": "success", "data": "data already delete"});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },

    //mobile
    AcctBankMobile: async function (req, res, next) {
        try {
            const data = await AcctBank.find().populate({path: 'bank', model: 'Bank', select: '-__v'})
            res.status(200).json({
                status: "Success",
                data: data
            })
        } catch (error) {
            console.error(error);
            console.log(error);
            return errorHandler(error);
        }
    },
}
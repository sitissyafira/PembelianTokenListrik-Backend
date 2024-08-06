const {listRevenueRental, lstRevenueRentalById, addRevenueRental, editRevenueRental, deleteRevenueRental } = require("./service");

module.exports = {
    RevenueRental: async function (req, res, next) {
        try {
            var str = JSON.parse(req.query.param);
            let query = {}
            const allData = await listRevenueRental({}, 1, 0);

            if(str.filter !== null) query={revenueName: str.filter.revenueName};
            const revenueRental = await listRevenueRental(query, str.pageNumber, str.limit);
            if (revenueRental) {
                return res.status(200).json({"status": "success", "data": revenueRental, "totalCount": allData.length});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    RevenueRentalById: async function(req, res, next){
        try {
            const list = await lstRevenueRentalById(req.params.id);
            if (list) {
                return res.status(200).json({"status": "success", "data": list});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        }catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    tambahRevenueRental: async function (req, res, next) {
        try {
            const addEng = await addRevenueRental(req.body);
            if (addEng) {
                return res.status(200).json({"status": "success", "data": addEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    updateRevenueRental: async function (req, res, next) {
        try {
            const updateEng = await editRevenueRental(req.params.id, req.body);
            if (updateEng) {
                return res.status(200).json({"status": "success", "data": updateEng});
            } else {
                return res.status(500).json({"status": "error", "data": "internal server error"});
            }
        } catch (e) {
            return res.status(500).json({"status": "error", "data": e});
        }
    },
    hapusRevenueRental: async function (req, res, next) {
        try {
            const hapusEng = await deleteRevenueRental(req.params.id);
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
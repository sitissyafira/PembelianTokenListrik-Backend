const { BillingBank } = require("./model");
const services = require("../../services/handlerFactory")
const errorHandler = require("../../controllers/errorController");

exports.createBillingBank = async (req, res, next) => {
    try {
        const createBillingBank = await BillingBank.create(req.body);
        res.status(200).json({
            status: "Success create billing bank",
            data: createBillingBank,
            totalCount: createBillingBank.length
        });
    } catch (error) {
        console.error(error);
        return errorHandler(error)
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const data = await BillingBank.find({isDelete: false});
        res.status(200).json({
            status: "Success",
            totalCount: data.length,
            data: data
        });
    } catch (error) {
        console.error(error);
        return errorHandler(error)
    }
};

exports.updateBillingBank = async (req, res, next) => {
    try {
        const data = await BillingBank.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            status: "Success update data",
            data: data
        });
    } catch (error) {
        console.error(error);
        return errorHandler(error)
    }
};

exports.deleteFlag = async (req, res, next) => {
    try {
        const update = {
            isDelete: true
        }
        const delFlag = await BillingBank.findByIdAndUpdate(req.params.id, update);
        res.status(200).json({
            status: "delete success"
        });
    } catch (error) {
        console.error(error);
        return errorHandler(error);
    }
};

exports.delete = services.deleteOne(BillingBank);
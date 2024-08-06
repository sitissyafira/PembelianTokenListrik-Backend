const { tok_mrate } = require("./model");
const errorHandler = require("../../controllers/errorController");

exports.createMasterList = async (req, res) => {
  try {
    const createRate = await tok_mrate.create({ ...req.body });

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: createRate,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.updateMasterList = async (req, res) => {
  try {
    await tok_mrate.findByIdAndUpdate(req.params.id, req.body);

    const getUpdateData = await tok_mrate.findOne({ _id: req.params.id });

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: getUpdateData,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.findRate = async (req, res, next) => {
  try {
    const RatePower = await tok_mrate.findById(req.params.id);
    if (RatePower) {
      res.status(200).json({ status: "success", data: RatePower });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  } catch (e) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.findRateToken = async (req, res, next) => {
  try {
    const RateToken = await tok_mrate.find({ _id: req.params.id });
    if (RateToken) {
      res.status(200).json({ status: "success", data: RateToken });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  } catch (e) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getAllDataMasterBE = async (req, res) => {
  try {
    const getAllData = await tok_mrate.find({ status: "active" }).sort({ rate: 1 }).lean();

    if (getAllData)
      return res.status(200).json({
        statusCode: 200,
        statusText: "OK",
        message: "Success",
        data: getAllData,
      });

    if (!getAllData)
      return res.status(400).json({
        statusCode: 400,
        statusText: "Bad Request",
        message: "Failed",
      });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getAllDataMasterMobile = async (req, res) => {
  try {
    const getAllData = await tok_mrate.find({ status: "active" }).sort({ rate: 1 }).lean();

    if (getAllData)
      return res.status(200).json({
        statusCode: 200,
        statusText: "OK",
        message: "Success",
        data: getAllData,
      });

    if (!getAllData)
      return res.status(400).json({
        statusCode: 400,
        statusText: "Bad Request",
        message: "Failed",
      });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// strt
exports.getAllMaster = async (req, res, next) => {
  try {
    const str = JSON.parse(req.query.param);
    const allData = await listRatePower({}, 1, 0);
    let query = {};

    console.log(allData.length);

    if (str.filter !== null) query = { name: str.filter.name };

    const RatePower = await listRatePower(query, str.page, str.limit);

    if (RatePower) {
      res.status(200).json({
        status: "success",
        data: RatePower,
        totalCount: allData.length,
      });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  } catch (e) {
    console.log(e);
  }
};

const listRatePower = async function (query, page = 1, limit = 10000) {
  try {
    const skip = (page - 1) * limit;
    let ratePower;
    if (Object.keys(query).length === 0) {
      ratePower = await tok_mrate.find({}).skip(skip).limit(limit).sort({ $natural: 1 });
    } else {
      ratePower = await tok_mrate
        .find()
        .or([{ name: { $regex: `${query.name}` } }])
        .skip(skip)
        .limit(limit)
        .sort({ $natural: 1 });
    }
    if (ratePower) {
      return ratePower;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};

// delete
exports.deleteRate = async (req, res, next) => {
  try {
    const RatePower = await tok_mrate.findByIdAndRemove(req.params.id);
    if (RatePower) {
      res.status(200).json({ status: "success", data: "success delete rate gas data" });
    } else {
      return res.status(500).json({ status: "error", data: "internal server error" });
    }
  } catch (e) {
    console.log(e);
  }
};

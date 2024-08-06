const mongoose = require("mongoose");
const Acctype = require("./model").Acctype;
const servicesFactory = require("../../../services/handlerFactory");
const catchAsync = require("../../../utils/catchAsync");
const Acct = require("../account/model").Acct;
const Sequence = require("../../../models/sequence");
const coalist = require("../../../coalist");

exports.create = catchAsync(async (req, res, next) => {
  try {
    const dates = new Date();
    const createAcctype = await Acctype.create(req.body);

    if (createAcctype) {
      return res.status(200).json({ status: "success", data: createAcctype });
    } else {
      res.status(500).json({
        status: "error",
        data: "Something Went Wrong",
      });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
});

exports.getAllNoParamAccBudget = catchAsync(async (req, res, next) => {
  let getAccTypeCoalist,
    getAllGLAcc = [];
  for (let i = 0; i < coalist.coalistAccountBudget.length; i++) {
    getAccTypeCoalist = await Acctype.findOne({
      acctype: coalist.coalistAccountBudget[i].acctype,
    }).lean();
    getAllGLAcc.push(getAccTypeCoalist);
  }

  data = getAllGLAcc;

  res.status(200).json({
    status: "success",
    totalCount: getAllGLAcc.length,
    data,
  });
});

exports.getAllNoParam = catchAsync(async (req, res, next) => {
  let data;
  data = await Acctype.find().sort({ $natural: 1 });

  const allData = await Acctype.find();

  res.status(200).json({
    status: "success",
    totalCount: allData.length,
    data,
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  const skip = (req.query.page - 1) * req.query.limit;
  let data;

  if (req.query.search === undefined || req.query.search === null || req.query.search === "") {
    data = await Acctype.find()
      .skip(skip)
      .limit(parseInt(req.query.limit))
      .sort({ $natural: 1 })
      .lean();

    allData = await Acctype.find();
  } else {
    data = await Acctype.find({
      acctype: { $regex: req.query.search },
      // { acctype: { $regex: req.query.acctype } },
    })
      .skip(skip)
      .limit(parseInt(req.query.limit))
      .sort({ $natural: 1 })
      .lean();
    allData = await Acctype.find({ acctype: { $regex: req.query.search } });
  }

  res.status(200).json({
    status: "success",
    data,
    totalCount: allData.length,
  });
});

exports.getById = servicesFactory.getOne(Acctype, {
  path: "createdBy",
  select: "first_name",
});
exports.update = servicesFactory.updateOne(Acctype);

exports.delete = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const deleteMainAcct = await Mainacct.deleteOne({
    acctType: req.params.id,
  }).session(session);

  if (!deleteMainAcct) {
    await session.abortTransaction();
  } else {
    const deleteAcctType = await Acctype.findByIdAndDelete(req.params.id).session(session);

    if (deleteAcctType) {
      await session.commitTransaction();
    } else {
      await session.abortTransaction();
    }
  }
  session.endSession();

  res.status(204).json({
    status: "success",
    message: null,
  });
});

exports.getlistfixed = catchAsync(async (req, res, next) => {
  var beta;
  beta = await Acctype.find(coalist.FixedAssetList).lean();
  let alfa;
  var sort = { AccType: 1 };
  alfa = await Acct.find({
    $and: [{ AccType: beta }, { isChild: true }],
  })
    .populate({
      path: "AccType",
      model: "Acctype",
      select: "-__v",
    })
    .sort(sort)
    .lean();
  res.status(200).json({
    status: "success",
    data: alfa,
  });
});

exports.getlistaccumulated = catchAsync(async (req, res, next) => {
  var beta;
  beta = await Acctype.find(coalist.AccumulationDepretiation).lean();
  let alfa;
  var sort = { AccType: 1 };
  alfa = await Acct.find({
    $and: [{ AccType: beta }, { isChild: true }],
  })
    .populate({
      path: "AccType",
      model: "Acctype",
      select: "-__v",
    })
    .sort(sort)
    .lean();
  res.status(200).json({
    status: "success",
    data: alfa,
  });
});

exports.getlistexpensecogs = catchAsync(async (req, res, next) => {
  let account;
  // var sort = {AccType: 1};
  account = await Acct.find({
    $and: [
      {
        $or: [{ AccType: "6006af322f26dd4040ed74d5" }, { AccType: "6006af422f26dd4040ed74d6" }],
      },
      { $or: [{ isChild: true }] },
    ],
  }).populate({
    path: "AccType",
    model: "Acctype",
    select: "-__v",
  });
  res.status(200).json({
    status: "success",
    data: account,
  });
});

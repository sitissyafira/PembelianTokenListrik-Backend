const { Acct } = require("./model");
const { Acctype } = require("../AccountType/model");
const servicesFactory = require("../../../services/handlerFactory");
const catchAsync = require("../../../utils/catchAsync");
const errorHandler = require("../../../controllers/errorController");
const e = require("express");
const coalist = require("../../../coalist");
const { GLList } = require("../../../coalist");
const AR = require("../../../finance/ar/model").AccountReceive;
const JA = require("../../../journal/amortisasi/model").JourAmort;
const JS = require("../../../journal/set off/model").JourSO;
const excel = require("exceljs");

const db = require("../../../database");
const AccountService = require("./service");

exports.updateCategory = async (req, res) => {
  const session = await db.connect().startSession();
  try {
    // Start Transaction
    session.startTransaction();

    const result = await AccountService.updateCategory(req.body, session);
    if (!result.success) {
      await session.abortTransaction();
      return res.status(400).json({ status: "error", data: result.message });
    }

    // Commit Transaction
    await session.commitTransaction();

    return res.status(200).json({ status: "success", data: result.data });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ status: "error", data: "internal server error" });
  } finally {
    session.endSession();
  }
};

exports.updateManyBalance = async (req, res) => {
  const session = await db.connect().startSession();
  try {
    // Start Transaction
    session.startTransaction();

    const result = await AccountService.updateManyBalance(session);
    if (!result.success) {
      await session.abortTransaction();
      return res.status(400).json({ status: "error", data: result.message });
    }

    // Commit Transaction
    await session.commitTransaction();

    return res.status(200).json({ status: "success", data: result.data });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ status: "error", data: "internal server error" });
  } finally {
    session.endSession();
  }
};

(exports.updateManyDetails = async (req, res) => {
  const session = await db.connect().startSession();
  try {
    // Start Transaction
    session.startTransaction();

    const result = await AccountService.updateManyDetails(session);
    if (!result.success) {
      await session.abortTransaction();
      return res.status(400).json({ status: "error", data: result.message });
    }

    // Commit Transaction
    await session.commitTransaction();

    return res.status(200).json({ status: "success", data: result.data });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ status: "error", data: "internal server error" });
  } finally {
    session.endSession();
  }
}),
  (exports.updateParentBalance = async (req, res) => {
    const session = await db.connect().startSession();
    try {
      // Start Transaction
      session.startTransaction();

      const result = await AccountService.updateParentBalance(session);
      if (!result.success) {
        await session.abortTransaction();
        return res.status(400).json({ status: "error", data: result.message });
      }

      // Commit Transaction
      await session.commitTransaction();

      return res.status(200).json({ status: "success", data: result.data });
    } catch (error) {
      await session.abortTransaction();
      return res.status(500).json({ status: "error", data: "internal server error" });
    } finally {
      session.endSession();
    }
  });

// exports.fixCOA = async (req, res) => {
//   const session = await db.connect().startSession();
//   try {
//     // Start Transaction
//     session.startTransaction();

//     const result = await AccountService.fixCOA(session);
//     if(!result.success) {
//       await session.abortTransaction();
//       return res.status(400).json({ status: "error", data: result.message });
//     }

//     // Commit Transaction
//     await session.commitTransaction();

//     return res.status(200).json({ status: "success", data: result.data });
//   } catch (error) {
//     await session.abortTransaction();
//     return res.status(500).json({ status: "error", data: "internal server error" });
//   } finally {
//     session.endSession();
//   }
// }

exports.importexcel = async (req, res, next) => {
  try {
    const file = req.file;
    const childs = [];
    const findParents = await Acct.find({ depth: 0, isChild: false }).sort({ actype: 1, acctNo: 1 }).lean();
    const parents = findParents.map((parent) => {
      return {
        account: parent._id,
        balance: 0,
      };
    });

    if (file) {
      const workbook = new excel.Workbook();

      await workbook.xlsx.readFile(`${file.path}`).then(async function () {
        try {
          const promises = [];
          const activa = workbook.getWorksheet("Aktiva");
          const pasiva = workbook.getWorksheet("Pasiva");

          activa.eachRow(async function (row, rowNumber) {
            if (rowNumber > 1) {
              if (row.values[1]) {
                const code = String(row.values[1]);
                const balance = row.values[4] !== null && row.values[4] !== undefined ? row.values[4] : 0;
                const promise = Acct.findOneAndUpdate({ acctNo: code }, { openingBalance: balance, balance: balance });
                promises.push(promise);
                childs.push({
                  code: code,
                  balance: balance,
                });
              }
            }
          });

          pasiva.eachRow(async function (row, rowNumber) {
            if (rowNumber > 1) {
              if (row.values[1]) {
                const code = String(row.values[1]);
                const balance = row.values[4] !== null && row.values[4] !== undefined ? row.values[4] : 0;
                const promise = Acct.findOneAndUpdate({ acctNo: code }, { openingBalance: balance, balance: balance });
                promises.push(promise);
                childs.push({
                  code: code,
                  balance: balance,
                });
              }
            }
          });

          for (let i = 0; i < childs.length; i++) {
            const codeArr = childs[i].code.split(".");
            const parent = await Acct.findOne({ acctNo: codeArr[0] }, { _id: 1 }).lean();
            if (parent) {
              const index = parents.findIndex((acc) => String(acc.account) === String(parent._id));
              parents[index].balance += childs[i].balance;
            }
          }

          for (let j = 0; j < parents.length; j++) {
            const promise = Acct.findOneAndUpdate(
              { _id: parents[j].account },
              {
                openingBalance: parents[j].balance,
                balance: parents[j].balance,
              }
            );
            promises.push(promise);
          }

          Promise.all(promises)
            .then((result) => {
              return res.status(200).json({ status: "success", data: result });
            })
            .catch((err) => {
              return res.status(500).json({
                status: "An error occurred while inserting data",
                data: err,
              });
            });
        } catch (err) {
          return res.status(500).json({
            status: "An error occurred while inserting data",
            data: err,
          });
        }
      });
    } else {
      return res.status(400).json({ status: "File not found", data: null });
    }
  } catch (error) {
    return res.status(500).json({ status: "An error occurred while inserting data", data: error });
  }
};

exports.createAccount = async (req, res, next) => {
  try {
    if (!req.body.ipadd) req.body.ipadd = req.ip;
    const date = new Date();
    date.setHours(date.getHours() + 7);
    req.body.createdDate = date;

    // validasi nomor COA
    let isValidate = await Acct.findOne({ acctNo: req.body.acctNo });
    if (isValidate) {
      return res.status(200).json({
        code: 200,
        status: "validate",
      });
    }

    // create ACCT
    if (req.body.isChild) {
      const doc = await Acct.create({
        ...req.body,
        depth: req.body.depth,
        acctNo: req.body.acctNo,
        acctName: req.body.acctName,
        AccId: req.body.AccId,
        AccType: req.body.AccType,
        openingBalance: req.body.openingBalance,
        balance: req.body.balance,
        createdDate: date,
        isChild: req.body.isChild,
      });
      const filter = { _id: req.body.AccId };
      const update = { isChild: false };
      const updateParent = await Acct.findOneAndUpdate(filter, update);
      res.status(201).json({
        status: "success",
        data: doc,
      });
    } else {
      const doc = await Acct.create({
        ...req.body,
        depth: req.body.depth,
        acctNo: req.body.acctNo,
        acctName: req.body.acctName,
        AccType: req.body.AccType,
        openingBalance: req.body.openingBalance,
        balance: req.body.balance,
        createdDate: date,
        isChild: req.body.isChild,
      });
      res.status(201).json({
        status: "success",
        data: doc,
      });
    }
  } catch (e) {
    errorHandler(e, req, res, next);
  }
};
exports.getById = servicesFactory.getOne(Acct, [
  {
    path: "acctType",
    select: "-__v",
  },
  {
    path: "parents",
    select: "-__v",
  },
]);

exports.getByAccountType = catchAsync(async (req, res, next) => {
  const data = await Acct.find({ AccType: req.params.id });
  // console.log(data);
  res.status(200).json({
    status: "success",
    data: data,
  });
});

exports.getByAccountForExpenditures = catchAsync(async (req, res, next) => {
  try {
    const acctype = await Acctype.find({
      $or: coalist.ExpendituresList,
    }).select("-__v");

    let dataAcctype = [];
    await Promise.all(
      acctype.map(async (element) => {
        const accData = await Acct.find({
          $and: [{ AccType: element._id }, { isChild: true }],
        }).lean();
        if (accData.length > 0) {
          dataAcctype.push(accData);
        }
      })
    );
    Promise.all(dataAcctype)
      .then((result) =>
        res.send({
          status: "success",
          data: dataAcctype,
        })
      )
      .catch((err) => res.send(err));
  } catch (e) {
    console.log("error" + e);
  }
});

exports.getByAccountTypeCashBank = catchAsync(async (req, res, next) => {
  var mysort = { actype: 1, acctNo: 1, depth: 1 };

  const acctype = await Acctype.findOne(coalist.CashBankList).select("-__v").populate({
    path: "AccType",
    model: "AcctType",
    select: "-__v",
  });

  let data = await Acct.find({
    $and: [
      { AccType: acctype._id },
      // { isChild: true }
    ],
  })
    .select("-__v")
    .populate({
      path: "AccId",
      model: "Acct",
      select: "-__v",
    })
    .sort(mysort);

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getByAccountTypeCashBankAR = catchAsync(async (req, res, next) => {
  // const acctype = await Acctype.findOne(coalist.CashBankList).select("-__v").populate({
  //   path: "AccType",
  //   model: "AcctType",
  //   select: "-__v",
  // });

  let data = await Acct.find({ acctNo: { $regex: "11" } }, { acctNo: 1, acctName: 1 }).lean();

  const allDataGrouping = [...data];

  res.status(200).json({
    status: "success",
    data: allDataGrouping,
    lengthBro: allDataGrouping.length,
  });
});

exports.getAccountforGLAccountAR = catchAsync(async (req, res, next) => {
  try {
    const str = JSON.parse(req.query.param);

    let query = str.filter;

    if (query == null || query == undefined) query = "";
    const mysort = { actype: 1, acctNo: 1, depth: 1 };

    let accData;

    accData = await Acct.find({ acctNo: { $regex: query, $options: "i" } }, { _id: 1, acctNo: 1, acctName: 1 })
      .limit(50)
      .sort(mysort)
      .lean();

    if (accData.length === 0) {
      accData = await Acct.find({ acctName: { $regex: query, $options: "i" } }, { _id: 1, acctNo: 1, acctName: 1 })
        .limit(50)
        .sort(mysort)
        .lean();
    }

    return res.status(200).send({
      status: "success",
      data: [accData],
    });
  } catch (e) {
    console.log("error" + e);
  }
});

exports.getAccountforGLAccountAP = catchAsync(async (req, res, next) => {
  try {
    const str = JSON.parse(req.query.param);

    let query = str.filter;

    if (query == null || query == undefined) query = "";
    const mysort = { actype: 1, acctNo: 1, depth: 1 };

    let accData;

    accData = await Acct.find({ acctNo: { $regex: query, $options: "i" }, isChild: true }, { _id: 1, acctNo: 1, acctName: 1 })
      .limit(50)
      .sort(mysort)
      .lean();

    if (accData.length === 0) {
      accData = await Acct.find({ acctName: { $regex: query, $options: "i" }, isChild: true }, { _id: 1, acctNo: 1, acctName: 1 })
        .limit(50)
        .sort(mysort)
        .lean();
    }

    return res.status(200).send({
      status: "success",
      data: [accData],
    });
  } catch (e) {
    console.log("error" + e);
  }
});

exports.getAccountforGLAccountSODebit = catchAsync(async (req, res, next) => {
  try {
    const str = JSON.parse(req.query.param);
    let query = str.filter;
    if (query == null || query == undefined) query = "";

    const regex = new RegExp(query, "gi");

    let accData, result;

    if (query === "") {
      accData = await Acct.find(
        // { acctNo: { $regex: "1131" }, isChild: true },
        { acctNo: { $regex: "" }, isChild: true },
        { _id: 1, acctNo: 1, acctName: 1 }
      )
        .limit(50)
        .sort({ _id: 1 })
        .lean();

      result = accData;
    } else if (query !== "") {
      accData = await Acct.find(
        // { acctNo: { $regex: "1131" }, isChild: true },
        { acctNo: { $regex: "" }, isChild: true },
        { _id: 1, acctNo: 1, acctName: 1 }
      )
        .sort({ _id: 1 })
        .lean();

      result = [];
      for (let el of accData) {
        const acctNo = el.acctNo;
        if (regex.test(acctNo)) result.push(el);
      }
    }

    if (result.length === 0) {
      accData = await Acct.find(
        // { acctNo: { $regex: "1131" }, isChild: true },
        { acctNo: { $regex: "" }, isChild: true },
        { _id: 1, acctNo: 1, acctName: 1 }
      )
        .sort({ _id: 1 })
        .lean();

      result = [];
      for (let el of accData) {
        const acctName = el.acctName;
        if (regex.test(acctName)) result.push(el);
      }
    }

    res.status(200).send({
      status: "success",
      data: [result],
    });
  } catch (e) {
    console.log("error" + e);
  }
});

exports.getAccountforGLAccountSOCredit = catchAsync(async (req, res, next) => {
  try {
    const str = JSON.parse(req.query.param);
    let query = str.filter;
    if (query == null || query == undefined) query = "";

    const regex = new RegExp(query, "gi");

    let accData, result;

    accData = await Acct.find().lean();

    res.status(200).send({
      status: "success",
      data: [accData],
    });
  } catch (e) {
    console.log("error" + e);
  }
});

// exports.update = servicesFactory.updateOne(Acct);
exports.update = async (req, res, next) => {
  try {
    const updateById = await Acct.updateOne({ _id: req.params.id }, req.body);

    if (updateById) {
      res.status(200).send({
        status: "success",
      });
    } else {
      res.status(500).json({
        status: "fail",
        data: "something went wrong",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      data: "something went wrong",
    });
  }
};
exports.delete = servicesFactory.deleteOne(Acct);

exports.getSelectedAccountType = catchAsync(async (req, res, next) => {
  try {
    const actype = req.body.selected_acctype;
    const allData = await Acct.find({ AccType: actype });
    res.status(200).json({
      status: "success",
      data: allData,
    });
  } catch {
    res.status(500).json({
      status: "fail",
      data: "something went wrong",
    });
  }
});

/**
 * @param { page: number, limit: number, search: string  }
 * @description Search param, will search list by acct no.
 */
exports.getAll = catchAsync(async (req, res, next) => {
  const skip = (req.query.page - 1) * req.query.limit;
  let account;
  if (req.query.search === undefined || req.query.search === null || req.query.search === "") {
    var mysort = { actype: 1, acctNo: 1, depth: 1 };
    account = await Acct.find()
      .populate({
        path: "AccType",
        model: "Acctype",
        select: "-__v",
      })
      .populate({
        path: "parent",
        model: "Acct",
        select: { _id: 1, acctNo: 1, acctName: 1 },
      })
      .skip(skip)
      .limit(parseInt(req.query.limit))
      .sort(mysort)
      .lean();

    allData = await Acct.find();
  } else {
    account = await Acct.find({
      $or: [{ acctNo: { $regex: req.query.search, $options: "i" } }, { acctName: { $regex: req.query.search, $options: "i" } }],
    })
      .populate({
        path: "AccType",
        model: "Acctype",
        select: "-__v",
      })
      .skip(skip)
      .limit(parseInt(req.query.limit))
      .sort(mysort)
      .lean();

    allData = await Acct.find({ acctNo: { $regex: req.query.search } });
  }
  res.status(200).json({
    status: "success",
    data: account,
    totalCount: allData.length,
  });
});

exports.getgeneralledger = async (req, res, next) => {
  try {
    var fromDate = new Date(req.query.fromDate);
    var toDate = new Date(req.query.toDate);
    toDate.setDate(toDate.getDate() + 1);
    const condition = { createdDate: { $gte: fromDate, $lte: toDate } };
    const fixDate = await Acct.find(condition);
    const skip = (req.query.pageNumber - 1) * req.query.limit;

    // let account;
    // if (
    //   req.query.search === undefined ||
    //   req.query.search === null ||
    //   req.query.search === ""
    // )

    res.status(200).json({
      status: "success",
      data: fixDate,
      totalCount: fixDate.length,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.generalledgerkuluk = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;

    var fromDate = new Date(req.query.fromDate);
    var toDate = new Date(req.query.toDate);
    var mysort = { acctNo: 1 };
    toDate.setDate(toDate.getDate() + 1);
    const condition = { createdDate: { $gte: fromDate, $lte: toDate } };
    const fixDate = await Acct.find(condition).skip(skip).limit(parseInt(req.query.limit)).sort(mysort).lean();

    res.status(200).json({
      status: "success",
      data: fixDate,
      totalCount: fixDate.length,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.fixingParentAtChilds = async (req, res, next) => {
  try {
    const result = await AccountService.fixingDataParent();

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return errorHandler(err);
  }
};

exports.addOpeningBalance = async (req, res, next) => {
  try {
    const result = await AccountService.addOpeningBalance();

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return errorHandler(err);
  }
};

exports.apiHeaderCOA = async (req, res, next) => {
  try {
    const result = await AccountService.headerCOA();

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    return errorHandler(err);
  }
};

exports.apiListParent = async (req, res, next) => {
  try {
    const input = String(req.query.input);

    const getParent = await Acct.find(
      { $or: [{ acctName: { $regex: input, $options: "i" } }, { acctNo: { $regex: input, $options: "i" } }], depth: 0, isChild: false },
      { _id: 1, acctNo: 1, acctName: 1 }
    )
      .limit(10)
      .lean();

    const data = { success: true, status: 200, message: "OK", data: getParent };
    return res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ success: false, status: 500, message: "Internal Server Error" });
    console.log(error);
  }
};

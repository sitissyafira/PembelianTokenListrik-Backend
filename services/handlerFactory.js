const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Inventory = require("../inventoryManagement/inventorytransaction/model").Inventory;

// const search = catchAsync(async (Model, filter) => {
//   const data = await Model.find().or(filter).skip().limit().sort();
// });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.body.ipadd) req.body.ipadd = req.ip;

    const date = new Date();
    date.setHours(date.getHours() + 7);
    req.body.createdDate = date;

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    var arr1 = [];
    var arr2 = [];
    //console.log(doc);
    //var dataSumber = [doc];
    //console.log(dataSumber);
    // const loopItem = async () => {
    //   return Promise.all(
    //     doc.product_name.map(async (obj2) => {
    //       //Start Inventory Transaction Rehan
    //       //get STOCKIN in Inventory
    //       //init
    //       let rcvQty = 0;
    //       let issQty = 0;
    //       let availQty = 0;

    //       const pipeStockIn = [
    //         { $match: {$and: [{transaction_type: "STOCKIN"},{product: mongoose.Types.ObjectId(obj2._id)}]}},
    //           { $group: {
    //             _id: "$product",
    //             rcv_qty: { $sum: '$qty' }
    //           }
    //         },
    //         {
    //           $project: {
    //             _id: 0
    //           }
    //         }
    //       ];
    //       const dataRcvQty = await Inventory.aggregate(pipeStockIn)
    //         if (dataRcvQty.length > 0) {
    //           //Exists
    //           rcvQty = dataRcvQty[0].rcv_qty;
    //         };

    //         //get STOCKOUT in Inventory
    //         const pipeStockOut = [
    //           { $match: {$and: [{transaction_type: "STOCKOUT"},{product: mongoose.Types.ObjectId(obj2._id)}]}},
    //             { $group: {
    //               _id: "$product",
    //                 iss_qty: { $sum: '$qty' }
    //             }
    //           },
    //           {
    //             $project: {
    //               _id: 0
    //             }
    //           }
    //         ];
    //         const dataIssQty = await Inventory.aggregate(pipeStockOut)
    //         if (dataIssQty.length > 0) {
    //           //Exists
    //           issQty = dataIssQty[0].iss_qty;
    //         };
    //         //Calculate
    //         availQty = rcvQty - issQty;
    //         //End Inventory Transaction Rehan

    //         const dataPush2 = {
    //           ...obj2,
    //           available_qty: availQty
    //         }
    //         arr2.push(dataPush2);

    //       })
    //     )
    //   }

    //   loopItem().then(()=>{
    //     const dataPush = {
    //       ...doc._doc,
    //       product_name: arr2
    //     }
    //     arr1.push(dataPush);

    //     res.status(200).json({
    //       status: "success",
    //       data: arr1[0]

    //     });
    //   })
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getOnePR = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    var arr1 = [];
    var arr2 = [];

    const loopItem = async () => {
      return Promise.all(
        doc.product_name.map(async (obj2) => {
          //Start Inventory Transaction Rehan

          //init
          let begQty = 0;
          let rcvQty = 0;
          let issQty = 0;
          let availQty = 0;

          //get BEGINNING in Inventory
          const pipeBeginning = [
            {
              $match: {
                $and: [{ transaction_type: "BEGINNING" }, { product: mongoose.Types.ObjectId(obj2._id) }],
              },
            },
            {
              $group: {
                _id: "$product",
                beg_qty: { $sum: "$qty" },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ];
          const dataBegQty = await Inventory.aggregate(pipeBeginning);
          if (dataBegQty.length > 0) {
            //Exists
            begQty = dataBegQty[0].beg_qty;
          }

          //get STOCKIN in Inventory
          const pipeStockIn = [
            {
              $match: {
                $and: [{ transaction_type: "STOCKIN" }, { product: mongoose.Types.ObjectId(obj2._id) }],
              },
            },
            {
              $group: {
                _id: "$product",
                rcv_qty: { $sum: "$qty" },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ];
          const dataRcvQty = await Inventory.aggregate(pipeStockIn);
          if (dataRcvQty.length > 0) {
            //Exists
            rcvQty = dataRcvQty[0].rcv_qty;
          }

          //get STOCKOUT in Inventory
          const pipeStockOut = [
            {
              $match: {
                $and: [{ transaction_type: "STOCKOUT" }, { product: mongoose.Types.ObjectId(obj2._id) }],
              },
            },
            {
              $group: {
                _id: "$product",
                iss_qty: { $sum: "$qty" },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ];
          const dataIssQty = await Inventory.aggregate(pipeStockOut);
          if (dataIssQty.length > 0) {
            //Exists
            issQty = dataIssQty[0].iss_qty;
          }
          //Calculate
          availQty = begQty + rcvQty - issQty;
          //End Inventory Transaction Rehan

          const dataPush2 = {
            ...obj2,
            available_qty: availQty,
          };
          arr2.push(dataPush2);
        })
      );
    };

    loopItem().then(() => {
      const dataPush = {
        ...doc._doc,
        product_name: arr2,
      };
      arr1.push(dataPush);

      res.status(200).json({
        status: "success",
        data: arr1[0],
      });
    });
    // res.status(200).json({
    //   status: "success",
    //   data: doc
    // });
  });

exports.getOneQuo = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    var arr1 = [];
    var arr2 = [];

    const loopItem = async () => {
      return Promise.all(
        doc.product_name.map(async (obj2) => {
          //Start Inventory Transaction Rehan

          //init
          let begQty = 0;
          let rcvQty = 0;
          let issQty = 0;
          let availQty = 0;

          //get BEGINNING in Inventory
          const pipeBeginning = [
            {
              $match: {
                $and: [{ transaction_type: "BEGINNING" }, { product: mongoose.Types.ObjectId(obj._id) }],
              },
            },
            {
              $group: {
                _id: "$product",
                beg_qty: { $sum: "$qty" },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ];
          const dataBegQty = await Inventory.aggregate(pipeBeginning);
          if (dataBegQty.length > 0) {
            //Exists
            begQty = dataBegQty[0].beg_qty;
          }

          //get STOCKIN in Inventory
          const pipeStockIn = [
            {
              $match: {
                $and: [{ transaction_type: "STOCKIN" }, { product: mongoose.Types.ObjectId(obj2._id) }],
              },
            },
            {
              $group: {
                _id: "$product",
                rcv_qty: { $sum: "$qty" },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ];
          const dataRcvQty = await Inventory.aggregate(pipeStockIn);
          if (dataRcvQty.length > 0) {
            //Exists
            rcvQty = dataRcvQty[0].rcv_qty;
          }

          //get STOCKOUT in Inventory
          const pipeStockOut = [
            {
              $match: {
                $and: [{ transaction_type: "STOCKOUT" }, { product: mongoose.Types.ObjectId(obj2._id) }],
              },
            },
            {
              $group: {
                _id: "$product",
                iss_qty: { $sum: "$qty" },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ];
          const dataIssQty = await Inventory.aggregate(pipeStockOut);
          if (dataIssQty.length > 0) {
            //Exists
            issQty = dataIssQty[0].iss_qty;
          }
          //Calculate
          availQty = begQty + rcvQty - issQty;
          //End Inventory Transaction Rehan

          const dataPush2 = {
            ...obj2,
            available_qty: availQty,
          };
          arr2.push(dataPush2);
        })
      );
    };

    loopItem().then(() => {
      const dataPush = {
        ...doc._doc,
        product_name: arr2,
      };
      arr1.push(dataPush);

      res.status(200).json({
        status: "success",
        data: arr1[0],
      });
    });
    // res.status(200).json({
    //   status: "success",
    //   data: doc
    // });
  });

exports.getOneStkIn = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    var arr1 = [];
    var arr2 = [];

    // const loopItem = async () => {
    // return Promise.all(
    // doc.product.map(async (obj2) => {
    //Start Inventory Transaction Rehan

    //init
    let begQty = 0;
    let rcvQty = 0;
    let issQty = 0;
    let availQty = 0;

    //get BEGINNING in Inventory
    const pipeBeginning = [
      {
        $match: {
          // $and: [{ transaction_type: "BEGINNING" }, { product: mongoose.Types.ObjectId(obj._id) }],
          $and: [{ transaction_type: "BEGINNING" }, { product: mongoose.Types.ObjectId(req.params.id) }],
        },
      },
      {
        $group: {
          _id: "$product",
          beg_qty: { $sum: "$qty" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    const dataBegQty = await Inventory.aggregate(pipeBeginning);
    if (dataBegQty.length > 0) {
      //Exists
      begQty = dataBegQty[0].beg_qty;
    }

    //get STOCKIN in Inventory
    const pipeStockIn = [
      {
        $match: {
          $and: [{ transaction_type: "STOCKIN" }, { product: mongoose.Types.ObjectId(doc._id) }],
        },
      },
      {
        $group: {
          _id: "$product",
          rcv_qty: { $sum: "$qty" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    const dataRcvQty = await Inventory.aggregate(pipeStockIn);
    if (dataRcvQty.length > 0) {
      //Exists
      rcvQty = dataRcvQty[0].rcv_qty;
    }

    //get STOCKOUT in Inventory
    const pipeStockOut = [
      {
        $match: {
          $and: [{ transaction_type: "STOCKOUT" }, { product: mongoose.Types.ObjectId(doc._id) }],
        },
      },
      {
        $group: {
          _id: "$product",
          iss_qty: { $sum: "$qty" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    const dataIssQty = await Inventory.aggregate(pipeStockOut);
    if (dataIssQty.length > 0) {
      //Exists
      issQty = dataIssQty[0].iss_qty;
    }
    //Calculate
    availQty = begQty + rcvQty - issQty;
    //End Inventory Transaction Rehan

    const dataPush2 = {
      ...doc._doc,
      available_qty: availQty,
    };
    arr2.push(dataPush2);

    // })
    // )
    // }

    // loopItem().then(()=>{
    // const dataPush = {
    //   ...doc._doc,
    //   product_name: arr2
    // }
    // arr1.push(dataPush);

    res.status(200).json({
      status: "success",
      data: arr2[0],
    });
    // })
    //console.log(arr2);
    // res.status(200).json({
    //   status: "success",
    //   data: doc
    // });
  });

exports.getOneRso = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    var arr2 = [];

    //Start Inventory Transaction Rehan

    //init
    let begQty = 0;
    let rcvQty = 0;
    let issQty = 0;
    let availQty = 0;

    //get BEGINNING in Inventory
    const pipeBeginning = [
      {
        $match: {
          $and: [{ transaction_type: "BEGINNING" }, { product: mongoose.Types.ObjectId(req.params.id) }],
        },
      },
      {
        $group: {
          _id: "$product",
          beg_qty: { $sum: "$qty" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    const dataBegQty = await Inventory.aggregate(pipeBeginning);
    if (dataBegQty.length > 0) {
      //Exists
      begQty = dataBegQty[0].beg_qty;
    }

    //get STOCKIN in Inventory
    const pipeStockIn = [
      {
        $match: {
          $and: [{ transaction_type: "STOCKIN" }, { product: mongoose.Types.ObjectId(doc.product._id) }],
        },
      },
      {
        $group: {
          _id: "$product",
          rcv_qty: { $sum: "$qty" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    const dataRcvQty = await Inventory.aggregate(pipeStockIn);
    if (dataRcvQty.length > 0) {
      //Exists
      rcvQty = dataRcvQty[0].rcv_qty;
    }

    //get STOCKOUT in Inventory
    const pipeStockOut = [
      {
        $match: {
          $and: [{ transaction_type: "STOCKOUT" }, { product: mongoose.Types.ObjectId(doc.product._id) }],
        },
      },
      {
        $group: {
          _id: "$product",
          iss_qty: { $sum: "$qty" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    const dataIssQty = await Inventory.aggregate(pipeStockOut);
    if (dataIssQty.length > 0) {
      //Exists
      issQty = dataIssQty[0].iss_qty;
    }
    //Calculate
    availQty = begQty + rcvQty - issQty;
    //End Inventory Transaction Rehan

    const dataPush2 = {
      ...doc._doc,
      available_qty: availQty,
    };
    arr2.push(dataPush2);

    res.status(200).json({
      status: "success",
      data: arr2[0],
    });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let page = 1;
    let limit = 10;
    if (req.query.param) {
      const str = JSON.parse(req.query.param);
      page = parseInt(str.pageNumber);
      limit = parseInt(str.limit);
    }
    const Crit = req.body ? req.body : {};
    const skip = (page - 1) * limit;
    let query = Model.find(Crit).skip(skip).limit(limit).sort({ $natural: 1 });
    if (popOptions) query = query.populate(popOptions);

    const data = await query;

    res.status(200).json({
      status: "success",
      totalCount: data.length,
      data,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const date = new Date();
    date.setHours(date.getHours() + 7);
    req.body.updateDate = date;
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    } else {
      res.status(200).json({
        status: "delete success",
      });
    }
  });

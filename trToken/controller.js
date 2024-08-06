const { tok_trtoken } = require("./model");
const { tok_mrate } = require("../masterData/tokenRate/model");
const { payment_mtd } = require("../paymentMethod/model");
const { Ownership } = require("../contract/owner/model");
const { Unit } = require("../unit/model");
const { Engineer } = require("../masterData/engineer/model");
const { Acctbank } = require("../masterData/bank/account/model");
const { Bank } = require("../masterData/bank/model");
const { log_trtoken } = require("../logHistory/tokenLog/model");
const { Block } = require("../block/model");
const { Customer } = require("../customer/model");
const { Power } = require("../power/master/model");
const { tok_prtopup } = require("../progressTopupToken/model");
const { Tax } = require("../masterData/tax/model");
const { VirtualAcct } = require("../virtualAccount/model");
const Sequence = require("../models/sequence");
const Acct = require("../masterData/COA/account/model").Acct;
const DebNote = require("../journal/debitnote/model").DebNote;
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const moment = require("moment");
moment.locale("id");
const errorHandler = require("../controllers/errorController");
const sharp = require("sharp");
const CryptoJS = require("crypto-js"); // npm install crypto-js
const fetch = require("node-fetch"); // npm install node-fetch --save
const apikey = "SANDBOX557DEE7E-0B43-4CAC-810F-E519918B89B2-20211110144843";
const va = "0000001288042024";
const { AccountReceive } = require("../finance/ar/model");
const excel = require("exceljs");
const { AccountHistory } = require("../logHistory/accountHistory/model");
const serviceGL = require("../middleware/helperCOA"); /** To control or declare any GL Account */
const serviceHelperCoa = require("../middleware/serviceCOA"); /** To control or declare any GL Account */
const { getNewToken } = require("../dashboard/service");

const {
  startMonth1,
  startMonth2,
  startMonth3,
  startMonth4,
  startMonth5,
  startMonth6,
  startMonth7,
  startMonth8,
  startMonth9,
  startMonth10,
  startMonth11,
  startMonth12,
  rupiahFormat,
  capsFront,
  getBlock,
  terbilang,
  generator,
} = require("./functionHelperToken");
const {
  updateToAcctHistoryIndex,
  findManyBodyIndex,
  findAllToken,
  findALLAcctReceive,
  findAllDebitNote,
  getOneDebitNote,
  getOneTokenRate,
  getOneAcctReceive,
  updateOneDebitNote,
} = require("./service");

const dates = new Date();
const month = dates.getMonth() + 1;
const year = dates.getFullYear();

let monthList = {
  month1: startMonth1(year),
  month2: startMonth2(year),
  month3: startMonth3(year),
  month4: startMonth4(year),
  month5: startMonth5(year),
  month6: startMonth6(year),
  month7: startMonth7(year),
  month8: startMonth8(year),
  month9: startMonth9(year),
  month10: startMonth10(year),
  month11: startMonth11(year),
  month12: startMonth12(year),
};

const getMonth = Number(new Date().getMonth() + 1);

// FUNCTION HELPER =============================================================================

const updateToAccount = async (getUnit, rate, admRate) => {
  let getMRateTotalPrice = rate + admRate;
  // COA JOURNAL AR
  const glAcount1 = await Acct.findOne(
    { acctNo: `1112.004` },
    { _id: 1, acctName: 1, balance: 1 }
  ); /** debit */
  const glAcount2 = await Acct.findOne(
    { acctNo: { $regex: `1131.${getUnit.cdunt}`, $options: "i" } },
    { _id: 1, acctName: 1, balance: 1 }
  ); /** credit  */

  // AR ======================================================================
  // Update to bank
  if (glAcount1) {
    const currentBalance = glAcount1.balance;
    await Acct.findOneAndUpdate(
      { _id: glAcount1._id },
      { balance: Number(currentBalance) + Number(-getMRateTotalPrice) }
    ); /** debit */
  }

  if (glAcount2) {
    const currentBalance = glAcount2.balance;
    await Acct.findOneAndUpdate(
      { _id: glAcount2._id },
      { balance: -Number(currentBalance) + Number(getMRateTotalPrice) },
      { new: true }
    ); /** credit */
  }
  // =========================================================================

  // COA DEBIT NOTE
  const glAcount3 = await Acct.findOne(
    { acctNo: { $regex: `1131.${getUnit.cdunt}`, $options: "i" } },
    { _id: 1, acctName: 1, balance: 1 }
  ); /** debit */
  const glAcount4 = await Acct.findOne(
    { acctNo: "4120.001" },
    { _id: 1, acctName: 1, balance: 1 }
  ); /** credit  */
  const glAcount5 = await Acct.findOne(
    { acctNo: "6100.003" },
    { _id: 1, acctName: 1, balance: 1 }
  ); /** credit  */

  // DEBIT NOTE ====================================================
  if (glAcount3) {
    const currentBalance = glAcount3.balance;
    await Acct.findOneAndUpdate(
      { _id: glAcount3._id },
      { balance: -Number(currentBalance) + Number(-getMRateTotalPrice) }
    ); /** debit */
  }
  if (glAcount4) {
    const currentBalance = glAcount4.balance;
    await Acct.findOneAndUpdate(
      { _id: glAcount4._id },
      { balance: Number(currentBalance) + Number(-rate) }
    ); /** credit */
  }
  if (glAcount5) {
    const currentBalance = glAcount5.balance;
    await Acct.findOneAndUpdate(
      { _id: glAcount5._id },
      { balance: Number(currentBalance) + Number(-admRate) }
    ); /** credit */
  }
};
/**
 * this function for create AR & DebNote when add new
 */
const createARTrxTopUp = async (
  req,
  data,
  totalNominalTrxTopUp_Debit,
  totalNominalTrxTopUp_Credit
) => {
  try {
    const getMasterRate = await tok_mrate.findOne({ _id: req.idRate }).lean();
    let getMRateTotalPrice = getMasterRate.rate + getMasterRate.adminRate;

    // const getCstmrData = await Ownership.findOne({
    //   unit: req.idUnit,
    // }).lean();

    let getUnit = await Unit.findOne({ _id: req.idUnit }, { cdunt: 1 });

    // C O A ================================================================================================
    // COA JOURNAL AR
    const glAcount1 = await Acct.findOne(
      { acctNo: `1112.004` },
      { _id: 1, acctName: 1, balance: 1 }
    ); /** debit */
    const glAcount2 = await Acct.findOne(
      { acctNo: { $regex: `1131.${getUnit.cdunt}`, $options: "i" } },
      { _id: 1, acctName: 1, balance: 1 }
    ); /** credit  */

    // COA DEBIT NOTE
    const glAcount3 = await Acct.findOne(
      { acctNo: { $regex: `1131.${getUnit.cdunt}`, $options: "i" } },
      { _id: 1, acctName: 1, balance: 1 }
    ); /** debit */
    const glAcount4 = await Acct.findOne(
      { acctNo: "4120.001" },
      { _id: 1, acctName: 1, balance: 1 }
    ); /** credit  */
    const glAcount5 = await Acct.findOne(
      { acctNo: "6100.003" },
      { _id: 1, acctName: 1, balance: 1 }
    ); /** credit  */

    // START | CREATE JOURNAL AR & DEBIT NOTE ===================================================================
    if (!glAcount1 || !glAcount2 || !glAcount3 || !glAcount4 || !glAcount5)
      return false;

    let multiGLAccount = {
      /** Total IPL */
      /** Gl account 2 */
      glAcc2: !glAcount2 ? null : glAcount2._id,
      amount2: getMRateTotalPrice,
      memo2: !glAcount2 ? `1131.${getUnit.cdunt}` : getUnit.cdunt,
      isDebit2: false,
      /** End */
    };

    let dataAR = {
      generateFrom: data._id,
      depositTo: glAcount1._id,
      isDebit: true,
      glaccount: !glAcount1 ? null : glAcount1._id,
      voucherno: req.cdTransaksi,
      status:
        req.statusPayment == "done" && req.prgrTransaksi == "done"
          ? true
          : false,
      rate: "IDR",
      memo: !glAcount1 ? null : glAcount1.acctName,
      date: req.tglTransaksi,
      amount: getMRateTotalPrice,
      crtdate: req.tglTransaksi,
      multiGLAccount: multiGLAccount,
      totalField: 2,
      unit: getUnit._id,
      unit2: getUnit.cdunt,
      payCond:
        req.statusPayment == "done" && req.prgrTransaksi == "done"
          ? "full-payment"
          : "outstanding",
      category: "top-up",
    };

    let totalDeb = 0;
    let totalCred = 0;

    if (dataAR.isDebit === true) totalDeb += dataAR.amount;
    else if (dataAR.isDebit === false) totalCred += dataAR.amount;

    if (dataAR.multiGLAccount !== undefined) {
      const lenMultiGL = Object.keys(dataAR.multiGLAccount).length / 2 + 1;
      for (let i = 2; i <= lenMultiGL; i++) {
        if (dataAR.multiGLAccount[`isDebit${i}`] === true)
          totalDeb += dataAR.multiGLAccount[`amount${i}`];
        else if (dataAR.multiGLAccount[`isDebit${i}`] === false)
          totalCred += dataAR.multiGLAccount[`amount${i}`];
      }
    }

    let totalAll = {
      debit: Math.round(totalDeb),
      credit: Math.round(totalCred),
    };

    dataAR = { ...dataAR, totalAll };

    let ARCreate = await AccountReceive.create(dataAR);

    if (!glAcount2) {
      await AccountReceive.findOneAndUpdate(
        { _id: ARCreate._id },
        { payCond: "outstanding", status: false }
      );
    }

    await updateToAccount(getUnit, getMasterRate.rate, getMasterRate.adminRate);

    // COA JOURNAL DEBIT NOTE
    let multiGLAccountDeb = {
      /** Total IPL */
      /** Gl account 2 */
      glAcc2: !glAcount4 ? null : glAcount4._id,
      amount2: getMasterRate.rate,
      memo2: getUnit.cdunt,
      isDebit2: false,
      /** End */
      /** Gl account 3 */
      glAcc3: !glAcount5 ? null : glAcount5._id,
      amount3: getMasterRate.adminRate,
      memo3: getUnit.cdunt,
      isDebit3: false,
      /** End */
    };

    let dataDN = {
      generateFrom: data._id,
      depositTo: glAcount3._id,
      isDebit: true,
      glaccount: !glAcount3 ? null : glAcount3._id,
      voucherno: req.cdTransaksi,
      status: false,
      rate: "IDR",
      memo: glAcount3.acctName,
      date: req.tglTransaksi,
      amount: getMRateTotalPrice,
      crtdate: req.tglTransaksi,
      multiGLAccount: multiGLAccountDeb,
      ARID: ARCreate._id,
      totalField: 3,
      totalAll,
      upatedToAcct: true,
      category: "top-up",
      // createdBy: req.created_by,
    };

    await DebNote.create(dataDN);

    // CREATE ACCOUNT HISTORY & INDEX ========================================
    await updateToAcctHistoryIndex(ARCreate);

    return true;
  } catch (err) {
    console.log("ERROR NIH BOS", err);
    return false;
  }

  // END =========================================================================================
};
/**
 * END
 */

// END FUNCTION HELPER ==========================================================================

// GENERATE JOURNAL AR & DEBIT NOTE
exports.autoCreateARDN = async (req, res) => {
  try {
    let dataError = [];
    let dataSuccess = [];

    let startDate = new Date(req.query.fromDate);
    startDate.setHours(0, 0, 0);
    let endDate = new Date(req.query.toDate);
    endDate.setHours(23, 59, 59);

    let query = {
      tglTransaksi: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    let dataTrxTopUp = await tok_trtoken
      .find(query)
      .select(
        "idUnit idRate cdTransaksi tglTransaksi statusPayment prgrTransaksi idCustomer"
      )
      .populate("idUnit idRate idCustomer");

    for (let item of dataTrxTopUp) {
      let checkDataAR = await AccountReceive.findOne({
        voucherno: { $regex: `${item.cdTransaksi}`, $options: "i" },
      });
      if (
        !checkDataAR &&
        item.cdTransaksi !== undefined &&
        item.cdTransaksi !== null
      ) {
        const updateData = await createARTrxTopUp(item);

        if (updateData !== false && updateData !== undefined) {
          dataSuccess.push(item);
        } else {
          dataError.push(item);
        }
      } else {
        dataSuccess.push(item);
      }
    }

    // Export to excel as output generate
    let workbook = new excel.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    let worksheetDataSuccess = workbook.addWorksheet("Data Success");
    worksheetDataSuccess.columns = [
      { header: "uniqueid", key: "id", hidden: true }, // 1
      { header: "Code Transaction", key: "cd_trx" },
      { header: "Code Unit", key: "unit_name" },
      { header: "Rate", key: "rate" },
      { header: "Status Payment", key: "st_pay" },
      { header: "Progress Transaction", key: "pgr_trx" },
      { header: "Transaction Date", key: "trx_date" },
    ];

    dataSuccess.map((dataListrik) => {
      let row = {
        id: dataListrik._id,
        cd_trx: !dataListrik.cdTransaksi ? "-" : dataListrik.cdTransaksi,
        unit_name: !dataListrik.idUnit.cdunt ? "-" : dataListrik.idUnit.cdunt,
        rate: !dataListrik.idRate.rate ? "-" : dataListrik.idRate.rate,
        st_pay: dataListrik.statusPayment,
        pgr_trx: dataListrik.prgrTransaksi,
        trx_date: moment(dataListrik.tglTransaksi).format("L"),
      };
      worksheetDataSuccess.addRow(row);
    });

    let worksheetDataError = workbook.addWorksheet("Data Failed");
    worksheetDataError.columns = [
      { header: "uniqueid", key: "id", hidden: true }, // 1
      { header: "Code Transaction", key: "cd_trx" },
      { header: "Code Unit", key: "unit_name" },
      { header: "Rate", key: "rate" },
      { header: "Status Payment", key: "st_pay" },
      { header: "Progress Transaction", key: "pgr_trx" },
      { header: "Transaction Date", key: "trx_date" },
    ];

    dataError.map((dataListrik) => {
      let row = {
        id: dataListrik._id,
        cd_trx: !dataListrik.cdTransaksi ? "-" : dataListrik.cdTransaksi,
        unit_name: !dataListrik.idUnit.cdunt ? "-" : dataListrik.idUnit.cdunt,
        rate: !dataListrik.idRate.rate ? "-" : dataListrik.idRate.rate,
        st_pay: dataListrik.statusPayment,
        pgr_trx: dataListrik.prgrTransaksi,
        trx_date: moment(dataListrik.tglTransaksi).format("L"),
      };
      worksheetDataError.addRow(row);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        `Data_Transaksi_TopUp_${moment(month, "MM").format()}.xlsx`
    );
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  } catch (err) {
    return errorHandler(err);
  }
};

exports.crtTopup = async (req, res) => {
  try {
    let deadlineTime = new Date();
    deadlineTime.setHours(deadlineTime.getHours() + 24); // For Production Stage
    // deadlineTime.setMinutes(deadlineTime.getMinutes() + 5); // For Development Stage

    const getPayMtd = (
      await payment_mtd.findOne({
        _id: req.body.idMtdPembayaran,
      })
    ).name;

    if (getPayMtd === "ipaymu") {
      const getMasterRate = await tok_mrate
        .findOne({ _id: req.body.idRate })
        .lean();
      let getMRateTotalPrice = getMasterRate.rate + getMasterRate.adminRate;

      const getCstmrData = await Ownership.findOne({
        unit: req.body.idUnit,
      }).lean();

      if (req.body.buyerEmail == "" || req.body.buyerPhone == "") {
        return res
          .status(400)
          .json("Field for Email and Phone Customer cannot be empty");
      }

      let url = "https://sandbox.ipaymu.com/api/v2/payment";
      // request body, parameter sesuikan dengan dokumentasi api
      let body = {
        product: [`Token Listrik ${getMasterRate.name}`],
        qty: [1],
        price: [getMRateTotalPrice],
        description: [
          `Pembelian Saldo Token ${
            getMasterRate.name
          } + Admin Fee Rp ${rupiahFormat(getMasterRate.adminRate)}`,
        ],
        returnUrl: "https://ipaymu.com/return",
        notifyUrl: "https://ipaymu.com/notify",
        cancelUrl: "https://ipaymu.com/cancel",
        buyerName: getCstmrData.contact_name,
        buyerEmail: req.body.buyerEmail,
        buyerPhone: req.body.buyerPhone,
        // "paymentMethod":"va",
      };

      // generate signature
      let bodyEncrypt = CryptoJS.SHA256(JSON.stringify(body));
      let stringtosign = "POST:" + va + ":" + bodyEncrypt + ":" + apikey;
      let signature = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA256(stringtosign, apikey)
      );

      const dataRes = await tok_trtoken.create({
        idCustomer: getCstmrData.cstmr,
        qty: 1,
        product: body.product,
        mtdPembayaran: (
          await payment_mtd.findOne({ _id: req.body.idMtdPembayaran }).lean()
        ).name,
        // price: body.price,
        description: body.description,
        buyerName: body.buyerName,
        totalBiaya: getMRateTotalPrice,
        deadlinePayment: deadlineTime,
        ...req.body,
      });
      await getNewToken();

      // await createARTrxTopUp(req.body, dataRes); /** Comment 26-10-2022 */
      /** ========== CREATE DEBIT NOTE ========== */
      // await createDebNoteFromTopUp(req.body);

      const getCreatedData = await tok_trtoken
        .findOne({ _id: dataRes._id })
        .select(["-product", "-qty", "-description"])
        .lean();

      const isProgress = await tok_prtopup.create({
        idTransaksi: getCreatedData._id,
        idEng: null,
        // statusProgress: null,
        ...req.body,
      });

      schedule.scheduleJob(
        `trigger-create-tr:${getCreatedData._id}`,
        getCreatedData.deadlinePayment,
        async () => {
          await tok_trtoken.findOneAndUpdate(
            {
              _id: getCreatedData._id,
            },
            {
              statusPayment: "failed",
              prgrTransaksi: "failed",
            }
          );

          await tok_prtopup.findOneAndUpdate(
            {
              idTransaksi: getCreatedData._id,
            },
            {
              statusProgress: "failed",
            }
          );
          console.log(
            `This token transaction with ID ${getCreatedData._id} is exceeding the deadline.\nStatus payment and progress is altered automatically to "failed" at ${getCreatedData.deadlinePayment}`
          );
        }
      );

      // request
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          va: va,
          signature: signature,
          timestamp: String(Date.now()),
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // response

          return res.status(200).json({
            statusCode: 200,
            statusText: "OK",
            message: "Success",
            res_iPaymu: responseJson,
            data: dataRes,
            progrData: isProgress,
          });
        });
    } else {
      const crtTopup = await tok_trtoken.create({
        deadlinePayment: deadlineTime,
        mtdPembayaran: (
          await payment_mtd.findOne({ _id: req.body.idMtdPembayaran }).lean()
        ).name,
        idCustomer: (await Ownership.findOne({ unit: req.body.idUnit })).cstmr,
        ...req.body,
      });

      // await createARTrxTopUp(req.body, crtTopup); /** Comment 26-10-2022 */
      /** ========== CREATE DEBIT NOTE ========== */
      // await createDebNoteFromTopUp(req.body);

      const getCreatedData = await tok_trtoken
        .findOne({ _id: crtTopup._id })
        .select(["-product", "-qty", "-description"])
        .lean();

      const isProgress = await tok_prtopup.create({
        idTransaksi: getCreatedData._id,
        idEng: null,
        // statusProgress: null,
        ...req.body,
      });

      await schedule.scheduleJob(
        `trigger-create-tr:${getCreatedData._id}`,
        getCreatedData.deadlinePayment,
        async () => {
          await tok_trtoken.findOneAndUpdate(
            {
              _id: getCreatedData._id,
            },
            {
              statusPayment: "failed",
              prgrTransaksi: "failed",
            }
          );

          await tok_prtopup.findOneAndUpdate(
            {
              idTransaksi: getCreatedData._id,
            },
            {
              statusProgress: "failed",
            }
          );

          console.log(
            `This token transaction with ID ${getCreatedData._id} is exceeding the deadline.\nStatus payment and progress is altered automatically to "failed" at ${getCreatedData.deadlinePayment}`
          );
        }
      );

      return res.status(200).json({
        statusCode: 200,
        statusText: "OK",
        message: "Success",
        data: getCreatedData,
        progrData: isProgress,
      });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.crtTopupMobile = async (req, res) => {
  try {
    // let deadlineTime = new Date();
    // // deadlineTime.setHours(deadlineTime.getHours() + 24); // For Production Stage
    // deadlineTime.setMinutes(deadlineTime.getMinutes() + 5); // For Development Stage

    const bearerToken = req.headers.authorization;

    const getUnit = (
      await User.findOne({
        _id: jwt.verify(bearerToken.split(" ")[1], process.env.SECRET).id,
      }).lean()
    ).unit;

    const crtTopup = await tok_trtoken.create({
      idUnit: getUnit,
      idCustomer: (await Ownership.findOne({ unit: getUnit })).cstmr,
      ...req.body,
    });

    const getCreatedData = await tok_trtoken
      .findOne({ _id: crtTopup._id })
      .populate(["idRate", "idUnit", "idCustomer"])
      .select(["-product", "-qty", "-description"])
      .lean();

    const isProgress = await tok_prtopup.create({
      idTransaksi: getCreatedData._id,
      idEng: null,
      // statusProgress: null,
      ...req.body,
    });
    await getNewToken();

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: getCreatedData,
      progrData: isProgress,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getBalance = async (req, res) => {
  try {
    const url = "https://sandbox.ipaymu.com/api/v2/balance";

    let body = { account: va };
    let bodyEncrypt = CryptoJS.SHA256(JSON.stringify(body));
    let stringtosign = "POST:" + va + ":" + bodyEncrypt + ":" + apikey;
    let signature = CryptoJS.enc.Hex.stringify(
      CryptoJS.HmacSHA256(stringtosign, apikey)
    );

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        va: va,
        signature: signature,
        timestamp: String(Date.now()),
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((resJson) => {
        return res.status(200).json({
          statusCode: 200,
          statusText: "OK",
          message: "Success",
          res_iPaymu: resJson,
        });
      });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getBalanceMobile = async (req, res) => {
  try {
    const url = "https://sandbox.ipaymu.com/api/v2/balance";

    let body = { account: va };
    let bodyEncrypt = CryptoJS.SHA256(JSON.stringify(body));
    let stringtosign = "POST:" + va + ":" + bodyEncrypt + ":" + apikey;
    let signature = CryptoJS.enc.Hex.stringify(
      CryptoJS.HmacSHA256(stringtosign, apikey)
    );

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        va: va,
        signature: signature,
        timestamp: String(Date.now()),
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((resJson) => {
        return res.status(200).json({
          statusCode: 200,
          statusText: "OK",
          message: "Success",
          res_iPaymu: resJson,
        });
      });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getStatusTransaction = async (req, res) => {
  try {
    const url = "https://sandbox.ipaymu.com/api/v2/transaction";

    let body = { transactionId: req.body.transactionId };
    let bodyEncrypt = CryptoJS.SHA256(JSON.stringify(body));
    let stringtosign = "POST:" + va + ":" + bodyEncrypt + ":" + apikey;
    let signature = CryptoJS.enc.Hex.stringify(
      CryptoJS.HmacSHA256(stringtosign, apikey)
    );

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        va: va,
        signature: signature,
        timestamp: String(Date.now()),
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((resJson) => {
        return res.status(200).json({
          statusCode: 200,
          statusText: "OK",
          message: "Success",
          res_iPaymu: resJson,
        });
      });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getCodeTransaksiMobile = async (req, res) => {
  try {
    const idnYear = moment().format("YYYY");
    // const idnYear = 2022;

    const dataFilt = (
      await tok_trtoken
        .find({
          tglTransaksi: {
            $gte: new Date(`${parseInt(idnYear)}`),
            $lt: new Date(`${parseInt(idnYear) + 1}`),
          },
        })
        .lean()
    ).length;

    if ((await Sequence.findOne({ menu: "tokencode" })) == null)
      await Sequence.create({ menu: "tokencode", sequence: 0 });
    else if (dataFilt == 0)
      await Sequence.findOneAndUpdate({ menu: "tokencode" }, { sequence: 0 });

    let seq = await Sequence.findOne({ menu: "tokencode" });

    await Sequence.findOneAndUpdate(
      { _id: seq._id },
      {
        sequence: generator(seq.sequence + 1, 4),
        year: seq.year,
        month: seq.month,
      }
    );

    return res.status(200).json({
      data: `TOK${seq.month}${seq.year}${generator(seq.sequence + 1, 4)}`,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getCodeTransaksi = async (req, res) => {
  try {
    const idnYear = moment().format("YYYY");
    // const idnYear = 2022;

    const dataFilt = (
      await tok_trtoken
        .find({
          tglTransaksi: {
            $gte: new Date(`${parseInt(idnYear)}`),
            $lt: new Date(`${parseInt(idnYear) + 1}`),
          },
        })
        .lean()
    ).length;

    if ((await Sequence.findOne({ menu: "tokencode" })) == null)
      await Sequence.create({ menu: "tokencode", sequence: 0 });
    else if (dataFilt == 0)
      await Sequence.findOneAndUpdate({ menu: "tokencode" }, { sequence: 0 });

    let seq = await Sequence.findOne({ menu: "tokencode" });

    await Sequence.findOneAndUpdate(
      { _id: seq._id },
      {
        sequence: generator(seq.sequence + 1, 4),
        year: seq.year,
        month: seq.month,
      }
    );

    return res.status(200).json({
      data: `TOK${seq.month}${seq.year}${generator(seq.sequence + 1, 4)}`,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getAllUnit = async (req, res) => {
  try {
    const getCtrct = await Ownership.find({ isToken: true });

    let idArr = [];
    getCtrct.map((x) => {
      idArr.push(x.unit);
    });

    const data = await Unit.find(
      {
        _id: {
          $in: idArr,
        },
      },
      { cdunt: 1 }
    )
      .populate("idUnit")
      .lean();

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const allData = await tok_trtoken.find();
    const data = await tok_trtoken
      .find({
        $and: [
          {
            tglTransaksi: {
              $gte: monthList[`month${getMonth}`],
              $lt:
                getMonth + 1 > 12
                  ? startMonth1(year + 1)
                  : monthList[`month${getMonth + 1}`],
            },
          },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .sort({ tglTransaksi: -1 })
      .lean();

    let dataResult = [];

    data.map((x) => {
      let dataObj = {
        _id: x._id,
        cdTransaksi: x.cdTransaksi,
        tglTransaksi: x.tglTransaksi,
        noUnit: x.idUnit.cdunt,
        order: x.order,
        totalBiaya: x.totalBiaya,
        mtdPembayaran: x.mtdPembayaran,
        statusPayment: x.statusPayment,
        prgrTransaksi: x.prgrTransaksi,
        engineer: x.engineer,
      };
      dataResult.push(dataObj);
    });

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: dataResult,
      totalCount: allData.length,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getAllDataQueryUnitDate = async (req, res) => {
  try {
    const { page, limit, unit } = req.query;

    // const getUnit = await Unit.findOne({ cdunt: unit }).lean();
    const getUnit = await Unit.find({
      cdunt: { $regex: unit, $options: "i" },
    }).lean();
    let dataResult = [],
      theDate = new Date(req.query.date),
      toDate = new Date(req.query.date),
      getUnitID,
      data,
      dataCount;

    getUnitID = getUnit.map((i) => i._id);

    theDate.setHours(theDate.getHours() - 7);
    toDate.setHours(toDate.getHours() + 17);

    if (unit == "" && theDate == "Invalid Date" && toDate == "Invalid Date") {
      data = await tok_trtoken
        .find({
          $and: [
            {
              tglTransaksi: {
                $gte: monthList[`month${getMonth}`],
                $lt:
                  getMonth + 1 > 12
                    ? startMonth1(year + 1)
                    : monthList[`month${getMonth + 1}`],
              },
            },
          ],
        })
        .populate("idUnit")
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .sort({ tglTransaksi: -1 })
        .lean();

      dataCount = (
        await tok_trtoken
          .find({
            $and: [
              {
                tglTransaksi: {
                  $gte: monthList[`month${getMonth}`],
                  $lt:
                    getMonth + 1 > 12
                      ? startMonth1(year + 1)
                      : monthList[`month${getMonth + 1}`],
                },
              },
            ],
          })
          .lean()
      ).length;
    } else if (theDate == "Invalid Date" && toDate == "Invalid Date") {
      data = await tok_trtoken
        .find({
          $and: [
            {
              tglTransaksi: {
                $gte: monthList[`month${getMonth}`],
                $lt:
                  getMonth + 1 > 12
                    ? startMonth1(year + 1)
                    : monthList[`month${getMonth + 1}`],
              },
            },
            {
              idUnit: {
                $in: getUnitID,
              },
            },
          ],
        })
        .populate("idUnit")
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .sort({ tglTransaksi: -1 })
        .lean();

      dataCount = (
        await tok_trtoken
          .find({
            $and: [
              {
                tglTransaksi: {
                  $gte: monthList[`month${getMonth}`],
                  $lt:
                    getMonth + 1 > 12
                      ? startMonth1(year + 1)
                      : monthList[`month${getMonth + 1}`],
                },
              },
              {
                idUnit: {
                  $in: getUnitID,
                },
              },
            ],
          })
          .lean()
      ).length;
    } else if (unit == "") {
      data = await tok_trtoken
        .find({
          $and: [
            {
              tglTransaksi: {
                $gte: monthList[`month${getMonth}`],
                $lt:
                  getMonth + 1 > 12
                    ? startMonth1(year + 1)
                    : monthList[`month${getMonth + 1}`],
              },
            },
            {
              tglTransaksi: {
                $gte: theDate,
                $lt: toDate,
              },
            },
          ],
        })
        .populate("idUnit")
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .sort({ tglTransaksi: -1 })
        .lean();

      dataCount = (
        await tok_trtoken
          .find({
            $and: [
              {
                tglTransaksi: {
                  $gte: monthList[`month${getMonth}`],
                  $lt:
                    getMonth + 1 > 12
                      ? startMonth1(year + 1)
                      : monthList[`month${getMonth + 1}`],
                },
              },
              {
                tglTransaksi: {
                  $gte: theDate,
                  $lt: toDate,
                },
              },
            ],
          })
          .lean()
      ).length;
    } else {
      data = await tok_trtoken
        .find({
          $and: [
            {
              tglTransaksi: {
                $gte: monthList[`month${getMonth}`],
                $lt:
                  getMonth + 1 > 12
                    ? startMonth1(year + 1)
                    : monthList[`month${getMonth + 1}`],
              },
            },
            {
              tglTransaksi: {
                $gte: theDate,
                $lt: toDate,
              },
            },
            {
              idUnit: {
                $in: getUnitID,
              },
            },
          ],
        })
        .populate("idUnit")
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .sort({ tglTransaksi: -1 })
        .lean();

      dataCount = (
        await tok_trtoken
          .find({
            $and: [
              {
                tglTransaksi: {
                  $gte: monthList[`month${getMonth}`],
                  $lt:
                    getMonth + 1 > 12
                      ? startMonth1(year + 1)
                      : monthList[`month${getMonth + 1}`],
                },
              },
              {
                tglTransaksi: {
                  $gte: theDate,
                  $lt: toDate,
                },
              },
              {
                idUnit: {
                  $in: getUnitID,
                },
              },
            ],
          })
          .lean()
      ).length;
    }

    data.map((x) => {
      let dataObj = {
        _id: x._id,
        cdTransaksi: x.cdTransaksi,
        tglTransaksi: x.tglTransaksi,
        noUnit: x.idUnit.cdunt,
        order: x.order,
        totalBiaya: x.totalBiaya,
        mtdPembayaran: x.mtdPembayaran,
        statusPayment: x.statusPayment,
        prgrTransaksi: x.prgrTransaksi,
        engineer: x.engineer,
      };
      dataResult.push(dataObj);
    });

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      totalCount: dataCount,
      dataPageCount: dataResult.length,
      data: dataResult,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getTransferDetail = async (req, res) => {
  try {
    const getData = await tok_trtoken
        .findById(req.params.id)
        .populate(["idRate", "idUnit"])
        .lean(),
      cstmrId = getData.idCustomer,
      unitId = getData.idUnit._id;

    const getContractId = (
      await Ownership.findOne({ cstmr: cstmrId, unit: unitId }).lean()
    )._id;

    const getAcctBank = await VirtualAcct.findOne({ contractId: getContractId })
      .select(["-createdDate"])
      .lean();

    const findEngineer = await Engineer.findOne({
      name: getData.engineer,
    }).lean();

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: getData,
      compBank:
        getAcctBank == null
          ? "Something wrong with this data in VA database collection"
          : getAcctBank.va_power,
      dataEngineer: findEngineer,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getEngineer = async (req, res) => {
  try {
    let getEngin = await Engineer.find({}, { name: 1 }).lean();
    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: getEngin,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getPaymentMtd = async (req, res) => {
  try {
    let getData = await payment_mtd.find({}, { name: 1 }).lean();
    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: getData,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getCompBankAcc = async (req, res) => {
  try {
    const getAcctBank = await Acctbank.find()
      .populate("bank")
      .select(["-createdDate", "-remarks"])
      .lean();
    if (getAcctBank)
      return res.status(200).json({
        statusCode: 200,
        statusText: "OK",
        message: "Success",
        data: getAcctBank,
      });
    if (!getAcctBank)
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

exports.getBankList = async (req, res) => {
  try {
    const getBankListData = await Bank.find()
      .sort({ createdDate: 1 })
      .select(["-createdDate", "-createdBy", "-__v", "-remarks"])
      .lean();
    if (getBankListData)
      return res.status(200).json({
        statusCode: 200,
        statusText: "OK",
        message: "Success",
        data: getBankListData,
      });
    if (!getBankListData)
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

exports.printData = async (req, res) => {
  try {
    const getData = await tok_trtoken
      .findOne({ _id: req.params.id })
      .populate(["idUnit", "idRate", "idCustomer"])
      .lean();

    const getTower = await Block.findOne({
      cdblk: {
        $regex: `${getBlock(getData.idUnit.cdunt)}`,
        $options: "i",
      },
    });

    const getCstmr = await Customer.findOne({
      _id: getData.idCustomer,
    });

    // let isTax = await Tax.findOne(
    //   { _id: req.body.taxId },
    //   { _id: 1, tax_code: 1, tax_name: 1, nominal: 1 }
    // )
    //   .populate("taxId")
    //   .lean();

    let dataRes = {};
    dataRes["namaCust"] = capsFront(getData.idCustomer.cstrmrnm);
    dataRes["tower"] = getTower.nmblk.toUpperCase();
    dataRes["unit"] = getData.idUnit.cdunt.toUpperCase();
    dataRes["adr"] = getCstmr.addrcstmr.toUpperCase();
    dataRes["cdTran"] = getData.cdTransaksi;
    dataRes["tglTrans"] = moment(getData.tglTransaksi).format("LL");
    dataRes["order"] = capsFront(getData.order);
    dataRes["mtdPay"] = capsFront(getData.mtdPembayaran);
    dataRes["price"] = getData.idRate.name;
    dataRes["admin"] = `Rp ${rupiahFormat(getData.idRate.adminRate)}`;
    dataRes["total"] = `Rp ${rupiahFormat(getData.totalBiaya)}`;
    dataRes["terbilang"] = terbilang(getData.totalBiaya).replace(
      /[\s]+/gi,
      " "
    );
    dataRes["logo"] = "/medina.png";
    // dataRes["taxId"] = isTax == null ? null : isTax;

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: dataRes,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.deleteTokenTrans = async (req, res) => {
  try {
    const id = req.params.id;

    const AR = await AccountReceive.findOne({ generateFrom: id });
    const acctHisIndex = await AccountHistory.find({
      source: AR._id,
      isDelete: false,
    }).sort({ createdDate: 1 });
    await findManyBodyIndex(acctHisIndex);

    const getTrans = await tok_trtoken.findOneAndRemove({ _id: id });
    await DebNote.findOneAndRemove({ generateFrom: id });
    await AccountReceive.findOneAndRemove({ generateFrom: id })
      .select("_id")
      .lean();
    await AccountHistory.deleteMany({ source: AR._id });

    if (!getTrans) {
      return res.status(400).json({
        statusCode: 400,
        statusText: "Bad Request",
        message: "Wrong ID or ID is not exist",
      });
    }

    if (getTrans) {
      await log_trtoken.create({ ...getTrans });
      await tok_trtoken.deleteOne({ _id: id }).lean();

      return res.status(200).json({
        statusCode: 200,
        statusText: "OK",
        message: "Success",
        deletedData: getTrans,
      });
    }
    return;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getMasterPowMobile = async (req, res) => {
  try {
    const bearerToken = req.headers.authorization,
      getMP = await Power.findOne({
        unt: (
          await User.findOne({
            _id: jwt.verify(bearerToken.split(" ")[1], process.env.SECRET).id,
          }).lean()
        ).unit,
      }).populate(["rte", "unt"]);

    const result = {};
    result["unit"] = getMP.unit.toUpperCase();
    result["nometer"] = getMP.nmmtr;
    result["daya"] = getMP.rte.nmrtepow.replace(/[\s]+/gi, "").toUpperCase();

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getPayMetdMobile = async (req, res) => {
  try {
    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: await payment_mtd.find({}, { name: 1 }).lean(),
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getTransDetailUser = async (req, res) => {
  try {
    const getInfoToken = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET
      ),
      getTenant = (await User.findOne({ _id: getInfoToken.id }).lean()).tenant,
      getTransToken = await tok_trtoken
        .find({ idCustomer: getTenant })
        .populate(["idRate", "idUnit"])
        .sort({ tglTransaksi: -1 })
        .lean();

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      data: getTransToken,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.getBankListMobile = async (req, res) => {
  try {
    const getBankListData = await Bank.find()
      .sort({ createdDate: 1 })
      .select(["-createdDate", "-createdBy", "-__v", "-remarks"])
      .lean();
    if (getBankListData)
      return res.status(200).json({
        statusCode: 200,
        statusText: "OK",
        message: "Success",
        data: getBankListData,
      });
    if (!getBankListData)
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

exports.getTransDetailEngineer = async (req, res) => {
  try {
    const { filter } = req.query;

    const authInfo = req.headers.authorization;

    const getID = jwt.verify(authInfo.split(" ")[1], process.env.SECRET).id;

    const getEngineerID = (await User.findOne({ _id: getID })).engineer;

    const getEngineerName = (await Engineer.findOne({ _id: getEngineerID }))
      .name;

    let getTRDetail;

    if (filter == "" || filter == undefined) {
      getTRDetail = await tok_trtoken
        .find({
          engineer: getEngineerName,
        })
        .populate(["idRate", "idUnit", "idCustomer"])
        .sort({ tglTransaksi: -1 })
        .lean();
    } else if (filter !== "" && filter !== undefined) {
      getTRDetail = await tok_trtoken
        .find({
          engineer: getEngineerName,
          prgrTransaksi: filter,
        })
        .populate(["idRate", "idUnit", "idCustomer"])
        .sort({ tglTransaksi: -1 })
        .lean();
    }

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      message: "Success",
      totalData: getTRDetail.length,
      data: getTRDetail,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.deleteTokenTransMobile = async (req, res) => {
  try {
    const id = req.params.id;
    const getTrans = await tok_trtoken.findOne({ _id: id }).lean();
    const getPrgrTrans = await tok_prtopup.findOne({ idTransaksi: id }).lean();

    if (!getTrans) {
      return res.status(400).json({
        statusCode: 400,
        statusText: "Bad Request",
        message: "Wrong ID or ID is not exist",
      });
    }

    if (getTrans) {
      await log_trtoken.create({ ...getTrans });
      await tok_trtoken.deleteOne({ _id: id }).lean();
      await tok_prtopup.deleteOne({ idTransaksi: id }).lean();
      await getNewToken();
      return res.status(200).json({
        statusCode: 200,
        statusText: "OK",
        message: "Success",
        deletedData: { getTrans, getPrgrTrans },
      });
    }
    return;
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.fixingTopUp = async (req, res) => {
  try {
    let conditionToken = {};
    let selectToken = "idRate cdTransaksi";
    const dataToken = await findAllToken(conditionToken, selectToken);
    let counter = 0;

    // let conditionDN = {$and: [
    //   {
    //     generateFrom: { $in: dataToken },
    //     $or: [
    //       { upatedToAcct: { $exists: false } },
    //       { upatedToAcct: false },
    //     ]
    //   }
    // ]}
    // let selectDN = "voucherno"
    // const dataDN = await findAllDebitNote(conditionDN, selectDN)

    for (let tokenItem of dataToken) {
      let conditionDN = {
        $and: [
          { generateFrom: tokenItem._id },
          {
            $or: [
              { updatedToAcct: { $exists: false } },
              { updatedToAcct: false },
            ],
          },
        ],
      };
      const dataDN = await getOneDebitNote(conditionDN);
      if (dataDN) {
        let dataTokenRate = await getOneTokenRate(
          { _id: tokenItem.idRate },
          "rate adminRate"
        );
        // ===============================================================================================================================
        // START ## UPDATED COA DEBIT NOTE ===============================================================================================
        const glAcount4 = await Acct.findOne(
          { acctNo: "4120.001" },
          { _id: 1, acctName: 1, balance: 1 }
        ); /** credit  */
        const glAcount5 = await Acct.findOne(
          { acctNo: "6100.003" },
          { _id: 1, acctName: 1, balance: 1 }
        ); /** credit  */

        if (glAcount4) {
          const currentBalance = glAcount4.balance;
          await Acct.findOneAndUpdate(
            { _id: glAcount4._id },
            {
              balance: Number(currentBalance) + Number(dataTokenRate.adminRate),
            }
          );
        } /** credit */

        if (glAcount5) {
          const currentBalance = glAcount5.balance;
          await Acct.findOneAndUpdate(
            { _id: glAcount5._id },
            {
              balance:
                Number(currentBalance) + Number(-dataTokenRate.adminRate),
            }
          );
        } /** credit */
        // END ## UPDATED COA DEBIT NOTE =================================================================================================
        // ===============================================================================================================================

        let dataAR = await getOneAcctReceive({
          voucherno: tokenItem.cdTransaksi,
        });
        let multiGLAccountDeb = {
          /** Total IPL */
          /** Gl account 2 */
          glAcc2: !glAcount4 ? null : glAcount4._id,
          amount2: dataTokenRate.rate,
          memo2: dataAR.unit2,
          isDebit2: false,
          /** End */

          /** Gl account 3 */
          glAcc3: !glAcount5 ? null : glAcount5._id,
          amount3: dataTokenRate.adminRate,
          memo3: dataAR.unit2,
          isDebit3: false,
          /** End */
        };

        await DebNote.findOneAndUpdate(
          { _id: dataDN._id },
          { multiGLAccountDeb, updatedToAcct: true }
        );
        await updateToAcctHistoryIndex(dataAR);
        counter += dataTokenRate.adminRate;
      }
    }

    res.status(200).json({ message: "success", counter });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
};

/** NEW FUNCTION CREATE DEBIT NOTE 26-10-2022 */
const createDebNoteFromTopUp = async (dataBody) => {
  const dataGlDebNote = await serviceGL.multiGLAccountDebNoteFromTopUp(
    dataBody
  );
  let dataDN = {
    generateFrom: dataBody._id,
    depositTo: dataGlDebNote.depositTo /** Declare from Service COA */,
    isDebit: dataGlDebNote.isDebit /** Declare from Service COA */,
    glaccount: dataGlDebNote.glaccount /** Declare from Service COA */,
    voucherno: dataBody.cdTransaksi,
    status: false,
    rate: "IDR",
    memo: dataGlDebNote.memo /** Declare from Service COA */,
    date: dataBody.tglTransaksi,
    amount: dataGlDebNote.amount /** Declare from Service COA */,
    crtdate: dataBody.tglTransaksi,
    multiGLAccount:
      dataGlDebNote.multiGLAccount /** Declare from Service COA */,
    // ARID: ARCreate._id,
    totalField: dataGlDebNote.totalField /** Declare from Service COA */,
    upatedToAcct: true,
    category: "top-up",
    // createdBy: dataBody.created_by,
  };

  let totalDeb = 0;
  let totalCred = 0;

  if (dataDN.isDebit === true) totalDeb += dataDN.amount;
  else if (dataDN.isDebit === false) totalCred += dataDN.amount;

  if (dataDN.multiGLAccount !== undefined) {
    const lenMultiGL = Object.keys(dataDN.multiGLAccount).length / 2 + 1;
    for (let i = 2; i <= lenMultiGL; i++) {
      if (dataDN.multiGLAccount[`isDebit${i}`] === true)
        totalDeb += dataDN.multiGLAccount[`amount${i}`];
      else if (dataDN.multiGLAccount[`isDebit${i}`] === false)
        totalCred += dataDN.multiGLAccount[`amount${i}`];
    }
  }

  let totalAll = {
    debit: Math.round(totalDeb),
    credit: Math.round(totalCred),
  };

  dataDN = { ...dataDN, totalAll };

  const created = await DebNote.create(dataDN);

  /** GENERATE ACCT HISTORY & ACCT HISTORY INDEX UPDATE COA */
  if (created) {
    /** CREATE ACCOUNT HISTORY INDEX */
    await serviceHelperCoa.updateCoa(
      created,
      { data: null, stats: "updateCoa" },
      "Debit Note"
    );
    await serviceHelperCoa.updateCoa(
      created,
      { data: created, stats: "createAcctHisstory" },
      "Debit Note"
    );
  }
};

// exports.autoCreateTopUp = async (req, res, next) => {
//   try{
//   let datanumber = 0;

//   function formatDate(dates) {
//     var d = new Date(dates),
//       month = "" + (d.getMonth() + 1),
//       day = "" + d.getDate(),
//       year = d.getFullYear();

//     if (month.length < 2) month = "0" + month;
//     if (day.length < 2) day = "0" + day;

//     return [year, month, day].join("/");
//   }

//   const formattDated = formatDate(req.body.date);

//   const filterUnits = {
//     $and: [{ $or: [{ wtrmtr: { $ne: null } }] }, { $or: [{ pwrmtr: { $ne: null } }] }],
//   };

//   const listUnits = await AccountReceive.find(filterUnits)
//   .populate({
//     path: "",
//     model: "",
//     select: "",
//   })
//   .populate({
//     path: "",
//     model "",
//     select: "",
//   });

//   listUnits.forEach(async (eachUnit, i)=>{
//     let
//   }
// }
// }

// }

// exports.getAllListRegex = async (req, res) => {
//   try {
//     const { query } = req.query;

//     // let regex = `/.*${query}.*/`.replace(/["'`]+/gi, " ");

//     const allData = await tok_trtoken.find({
//       mtdPembayaran: { $regex: query, $options: "i" },
//     });

//     return res.status(200).json({
//       statusCode: 200,
//       statusText: "OK",
//       message: "Success",
//       dataCount: allData.length,
//       data: allData,
//     });
//   } catch (error) {
//     console.error(error);
//     return errorHandler(error);
//   }
// };

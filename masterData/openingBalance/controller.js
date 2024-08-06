const Balance = require("./model").Balance;
const BalanceLog = require("../../logHistory/mOpeningBalance/model").BalanceLog;
const services = require("../../services/handlerFactory");
const errorHandler = require("../../controllers/errorController");
const e = require("express");

const Acct = require("../../masterData/COA/account/model").Acct;
const Acctype = require("../../masterData/COA/AccountType/model").Acctype;

const { BlockGroup } = require("../../blockgroup/model");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");

exports.create = async (req, res, next) => {
  const date = new Date();
  const create = await Balance.create(req.body);

  if (create) {
    const getAccountById = await Acct.findOne({ _id: req.body.coa });
    // let depth = getAccountById.depth;
    // let AccId = getAccountById.AccId;

    // for (i = 0; i < depth; i++) {
    //     console.log(AccIdm, "jancuk")
    //     const getBapak = await Acct.findOne({ _id: AccId });
    //     const upd = { balance: getBapak.balance + amount  };
    //     const updt = await Acct.findOneAndUpdate({_id: AccId}, upd);
    //     AccId = getBapak.AccId;
    // }

    const filter = { _id: req.body.coa };
    const update = { balance: getAccountById.balance + req.body.opening_balance };
    const updatebalance = await Acct.findOneAndUpdate(filter, update);
    if (updatebalance) {
      res.status(200).json({
        status: "success",
        totalCount: create.length,
        data: create,
      });
    } else {
      return console.error("error mang");
    }
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;

    if (req.query.search === undefined) {
      data = await Balance.find({ isDelete: false })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 })
        .populate({
          path: "typeAccount",
          model: "Acctype",
          select: "-__v",
        })
        .populate({
          path: "coa",
          model: "Acct",
          select: "-__v",
        })
        .lean();
    } else {
      data = await Balance.find({ opening_balance: { $regex: req.query.search } })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    }

    // console.log(data);
    res.status(200).json({
      status: "success",
      totalCount: data.length,
      data,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.updateBalance = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(date.getHours() + 7);
    req.body.updateDate = date;
    const data = await Balance.findByIdAndUpdate(req.params.id, req.body);
    if (data) {
      const logBalance = await new BalanceLog(req.body).save();
      console.log(logBalance);
      return res.status(200).json({
        status: "success, data has been update",
        data: data,
      });
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.deleteFlag = async (req, res, next) => {
  try {
    const update = { isDelete: true };
    const delFlag = await Balance.findByIdAndUpdate(req.params.id, update);
    res.status(200).json({
      status: "delete success!",
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.reportpdf = async (req, res, next) => {
  let alist = [];
  let coaList = ["001", "002", "003", "004", "005", "006", "007", "008", "009", "010"];

  for (let i = 0; i < coaList.length; i++) {
    let acctype = await Acctype.findOne({ acctypeno: coaList[i] });
    let acct = await Acct.find({ AccType: acctype._id });

    let total = 0;

    // for (let j = 0; j < acct.length; j++) {
    //   total += acct.balance[j]
    //   console.log(total);
    // }
    acct.forEach((i) => {
      // total =+ i.balance
      // console.log(total);
      console.log(i.balance);
      total += i.balance;
    });

    let dataTotal = {
      acctName: "Total " + acctype.acctype,
      isChild: false,
      depth: 0,
      total: total,
    };

    acct.push(dataTotal);

    let acctemp = {
      acctype,
      acct,
    };

    alist.push(acctemp);
  }

  var fromDate = new Date();
  var toDate = new Date();

  const projectName = await BlockGroup.find();
  const data = {
    list: alist,
    company: projectName[0].grpnm,
    date: {
      from: fromDate.toDateString().substring(4),
      to: toDate.toDateString().substring(4),
    },
  };

  ejs.renderFile(
    path.join(__dirname, "./template", "ob.template.ejs"),
    { ...data },
    async (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ status: "error", msg: err });
      }
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(data, {
        waitUntil: "domcontentloaded",
      });

      const headers = {
        company: projectName[0].grpnm,
        date: {
          from: fromDate.toDateString().substring(4),
          to: toDate.toDateString().substring(4),
        },
      };

      const result = await page.pdf({
        format: "Legal",
        landscape: false,
        displayHeaderFooter: true,
        path: `temp/${Date.now()}.pdf`,
        margin: {
          top: "5.5cm",
          right: "1.5cm",
          bottom: "1.75cm",
          left: "1.5cm",
        },
        printBackground: true,
        headerTemplate: `
        <div style="width: 100%;display: block;margin-left: 1.5cm;margin-right: 1.5cm">
        <div style="font-size: 12px;"><p>${headers.date.to}</p></div>
          <div style="text-align: center;margin-bottom: 1em;">
          <h1 style="font-size: 20px;
          margin: 0 0 5px;font-weight: 400;">${headers.company}</h1>
          <h1 style="font-size: 20px;color: #DC143C;
          margin: 0 0 5px;font-family: 'Times New Roman', serif;">
            Balance Sheet (Standard)
          </h1>
          <h1 style="font-size: 18px;
          margin: 0;font-family: 'Times New Roman', serif;">
            As Of ${headers.date.to}
          </h1>
          </div>
          `,
        footerTemplate: `
            <div style="text-align:center;width:100%;padding:10px 0;margin:0 1.5cm">
              <span style="font-size: 9px !important;display:inline-block">Apartatech Software System Report</span>

              <div style="font-size:9px !important;display:inline-block;float:right;text-align:right">
                Page <span class="pageNumber"></span> of <span class="totalPages"></span>
              </div>
            </div>
          `,
      });

      res.contentType("application/pdf");
      res.send(result);
    }
  );
};

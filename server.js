/**
 *
 * @type {Start Application Server}
 */

//
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const globalErrorHandler = require("./controllers/errorController");
const config = require("./config");

//import socket io
const socketio = require("socket.io");
const SocketioHelpers = require("./socketio/socket.io.helper");

//import http
const http = require("http");

const billingNotif = require("./billingNotif/router");
const userrouter = require("./routes/user");
const userRole = require("./routes/role");
const blockgroup = require("./blockgroup/router");
const block = require("./block/router");
const building = require("./building/router");
const floor = require("./floor/router");
const unit = require("./unit/router");
const gas = require("./gas/index");
const power = require("./power/index");
const water = require("./water/index");
const parking = require("./parkinglot/route");
const customer = require("./customer/router");
const internalUser = require("./masterData/internalUser/router");
const externalUser = require("./masterData/externalUser/router");
const locationBuilding = require("./masterData/LocationBuilding/router");
const shiftSchedule = require("./masterData/shiftWorkSchedule/router");
const renter = require("./renter/router");
const vt = require("./vehicletype/route");
const state = require("./state/route");
const datashare = require("./excel/route");
const unittype = require("./unittype/router");
const contractLease = require("./contract/tenant/router");
const contractOwner = require("./contract/owner/router");
const contractRenter = require("./contract/renter/router");
const contractPP = require("./contract/lease/router");
const contract = require("./contract/router");
const billing = require("./billing/router");
const paidpayment = require("./billing/paidPayment/router");
const unitrate = require("./unitrate/router");
const deposit = require("./deposit/router");
const acctype = require("./masterData/COA/AccountType/router");
const acccat = require("./masterData/COA/accountCategory/router");
const acct = require("./masterData/COA/account/router");
const fiscal = require("./masterData/Asset/FiscalFixedAsset/router");
const fixedAsset = require("./masterData/Asset/FixedAsset/router");
const uom = require("./masterData/uom/router");
const pnltyrate = require("./masterData/penaltyRate/router");
const bank = require("./masterData/bank/router");
const bankacct = require("./masterData/bank/account/router");
const rentalbilling = require("./rentalBilling/router");
const leasebilling = require("./leaseBilling/router");
const parkingbilling = require("./parkBilling/router");
const tax = require("./masterData/tax/router");
const currency = require("./masterData/currency/router");
const category = require("./masterData/helpdesk/category/router");
const defect = require("./masterData/helpdesk/defect/router");
const subdefect = require("./masterData/helpdesk/subdefect/router");
const engineer = require("./masterData/engineer/router");
const role = require("./masterData/role/router");
const application = require("./routes/application");
const additionParking = require("./parkinglot/additional/router");
const ticket = require("./helpdesk/ticket/router");
const ticketlist = require("./helpdesk/ticket/routerlist");
const deliveryOrder = require("./helpdesk/deliveryOrder/router");
const doList = require("./helpdesk/deliveryOrder/routerlist");

const rating = require("./rating/router");
const mstRevenue = require("./masterData/revenueRental/router");
const revenue = require("./bm/revenue/router");

const assetManagement = require("./asset/assetManagement/router");
const assetDepreciation = require("./asset/assetDepreciation/router");
const newBilling = require("./billingNew/router");
const cashBank = require("./cashbank/router");
const invoice = require("./invoice/router");
const powerbilling = require("./pwbilling/router");
const dashboardRouter = require("./dashboard/router");
const glRouter = require("./generalLedger/router");
const pinalty = require("./pinalty/router");
const visitor = require("./visitorManagement/router");
const balance = require("./masterData/openingBalance/router");
const billingLog = require("./logHistory/billingLog/router");

const accountReceive = require("./finance/ar/router");
const accountPurchase = require("./finance/ap/router");

const packageManagement = require("./packageManagement/router");
const packageCategory = require("./packageManagement/packageCategory/router");

const facilityReservation = require("./facilityReservation/router");

const billingBank = require("./masterData/billingBank/router");

const faq = require("./faq/router");
const tnc = require("./tnc/router");
const news = require("./news/router");

const logPackageManagement = require("./logHistory/packageManagement/router");
const BalanceLog = require("./logHistory/mOpeningBalance/router");

const pushNotification = require("./pushNotification/router");

const budgeting = require("./budgeting/router");
const budgetingLog = require("./logHistory/budgeting/router");

const webNotification = require("./webNotification/router");

const customerService = require("./customerServices/router");

const vendorCategory = require("./masterData/vendorCategory/router");
const vendorCategoryLog = require("./logHistory/mVendorCategory/router");

const vendor = require("./masterData/vendor/router");
const vendorLog = require("./logHistory/mVendor/router");

const department = require("./masterData/department/router");
const departmentLog = require("./logHistory/mDepartment/router");

const division = require("./masterData/division/router");
const divisionLog = require("./logHistory/mDivision/router");

const mUser = require("./masterData/User/router");
const masterProductCategory = require("./masterData/productCategory/router");
const masterProductBrand = require("./masterData/productBrand/router");
const masterUom = require("./masterData/uom/router");

const purchaseRequest = require("./purchaseManagement/purchaseRequest/router");
const commersil = require("./commersil/index");
const inventoryManagement = require("./inventoryManagement/index");
const quotation = require("./purchaseManagement/quotation/router");
const purchaseOrder = require("./purchaseManagement/purchaseOrder/router");
const poReceipt = require("./purchaseManagement/purchaseOrderReceipt/router");
const poPayment = require("./purchaseManagement/poPayment/router");
const pettyCash = require("./finance/pettyCash/router");

const trialBalance = require("./trialBalance/router");
const transferBudget = require("./finance/transferBudget/router");
const profitLoss = require("./profitLoss/router");
const cashFLow = require("./cashflow/router");
const helper = require("./helper/router");

const logFinance = require("./logHistory/logFinance/router");
const accountHistory = require("./logHistory/accountHistory/router");
const accountHistoryIndex = require("./logHistory/accountHistory/index/router");
const rejectedTransaction = require("./logHistory/rejectedTransaction/router");
const reportFinance = require("./finance/report/router");

// New Module Finance Update Date 03-05-2023
const newFinanceAccountHistory = require("./newModuleFinance/accountHistory/router");
const newFinanceTransactions = require("./newModuleFinance/transactions/router");
const newFinanceReport = require("./newModuleFinance/report/router");

const mobileNotification = require("./mobileNotification/router");
const mobileDeposit = require("./mobile/deposit/request/router");
const mobileInvoice = require("./mobile/deposit/invoice/router");

const requestInvoice = require("./request/router");

const consumptionMobile = require("./consumptionMobile/router");

// TOKEN ROUTER IMPORT
const paymentMethod = require("./paymentMethod/router");
const tokenMasterRate = require("./masterData/tokenRate/router");
const tokenTransaksiTopup = require("./trToken/router");
const tokenProgressTopup = require("./progressTopupToken/router");

// LOG & HISTORY TRANSACTION TOKEN
const logTokenTrans = require("./logHistory/tokenLog/router");
const historyTokenTrans = require("./logHistory/tokenHistory/router");

// VIRTUAL ACCOUNT TOKEN
const virtualAccount = require("./virtualAccount/router");

const failedTrLog = require("./failedTransLog/router");

const journalPenyesuaian = require("./journal/penyesuaian/router");
const journalAmortisasi = require("./journal/amortisasi/router");
const journalWriteOff = require("./journal/write off/router");
const journalSetOff = require("./journal/set off/router");
const journalDebitNote = require("./journal/debitnote/router");
const journalReceipt = require("./journal/receipt/router");

const logAction = require("./logAction/router");

const masterRateGalon = require("./galon/masterRate/router");
const trGalon = require("./galon/transaction/router");

const cashierRecord = require("./cashierPOS/cashierRecord/router");
const cashierPayment = require("./cashierPOS/cashierPayment/router");
const eMoney = require("./emoneyMaster/router");

const paymentGateway = require("./PaymentGateway/router");

//arcard
const arCard = require("./arCard/router");

// Void Billing & Journal
const voidBill = require("./void/billing/router");
const jourVoid = require("./void/journal/router");

//ticket Public
const ticketPublic = require("./ticketPublic/Ticket/router");
const ticketPubliclist = require("./ticketPublic/Ticket/routerlist");

//do public
const doPublic = require("./ticketPublic/deliveryOrder/router");
const doListPublic = require("./ticketPublic/deliveryOrder/routerlist");

//rating Public
const ratingPublic = require("./ratingPublic/router");

//va bjbs
const vabjbsTransaksi = require("./virtualAccountBank/transaksi/router")

const absensi = require("./absensi/router");

const checkpoint = require("./checkpoint/router");
const surveyTemplate = require("./surveyTemplate/router");

//patrol
const patrol = require("./patrol/router")

//emergency
const emergency = require("./emergency/router");

//task
const taskManagement = require("./taskManagement/router");
const taskManagementMaster = require("./taskManagement/master/router");

//inspeksi
const inspeksi = require("./Inspeksi/router");


const listCollections = [];

const today = new Date();

const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

// database connection
mongoose.connect(config.dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", async () => {
  console.log("DB Connected");
});

global.__basedir = __dirname;

app.use(cors());

//session configuration

//passport authentication
app.use(passport.initialize());
require("./passportconfig")(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use("/ticketImages", express.static(__dirname + "/upload/ticket/"));
app.use("/transPowerImage", express.static(__dirname + "/upload/transPower/"));
app.use("/transWaterImage", express.static(__dirname + "/upload/transWater/"));
app.use("/doImages", express.static(__dirname + "/upload/do/"));
app.use("/billImages", express.static(__dirname + "/upload/billing/"));
app.use("/newsImages", express.static(__dirname + "/upload/news/"));
app.use("/package", express.static(__dirname + "/upload/packageManagement/"));
app.use("/upload/consumption/electricity", express.static(__dirname + "/upload/consumption/electricity/"));
app.use("/upload/consumption/water", express.static(__dirname + "/upload/consumption/water/"));
app.use("/upload/consumption/galon", express.static(__dirname + "/upload/consumption/galon/"));
app.use("/tumanImage", express.static("./upload/topUp"));
app.use("/poDocument", express.static("./upload/purchaseOrder"));
app.use("/upload/internalUser", express.static("./upload/internalUser"));
app.use("/upload/externalUser", express.static("./upload/externalUser"));
app.use("/upload/absensi", express.static("./upload/absensi"));
app.use("/upload/inspeksi", express.static("./upload/inspeksi"));
app.use("/upload/taskManagement", express.static("./upload/taskManagement"));
app.use("/upload/patrol", express.static("./upload/patrol"));
app.use("/proofengineer", express.static("./upload/proofengineer"));
app.use("/visitor/id", express.static("./upload/visitorID"));
app.use("/logo", express.static("./trToken"));
app.use(express.static("temp"));
app.use(express.static("src"));

app.use("/invoiceMeteran", express.static(__dirname + "/upload/invoiceMeteran"));
app.use("/voidBill", express.static(__dirname + "/upload/void/billing")); // Void Billing
app.use("/jourVoid", express.static(__dirname + "/upload/void/journal")); // Void Journal

//route
app.use("/bm", (req, res, next) => {
  res.send(`<h1>Connected to server ${date} ${time}</h1>`);
});

app.use("/api/cashierRecord", cashierRecord);
app.use("/api/cashierPayment", cashierPayment);
app.use("/api/emoney", eMoney);

app.use("/api/galon/rate", masterRateGalon);
app.use("/api/galon/transaction", trGalon);
app.use("/api/consumobile", consumptionMobile);

app.use("/api/joupen", journalPenyesuaian);
app.use("/api/jouamor", journalAmortisasi);
app.use("/api/jouwriteoff", journalWriteOff);
app.use("/api/jousetoff", journalSetOff);
app.use("/api/debitnote", journalDebitNote);
app.use("/api/jourreceipt", journalReceipt);

// TOKEN ROUTER
app.use("/api/paymentmethod", paymentMethod);
app.use("/api/tokenmaster", tokenMasterRate);
app.use("/api/trantopup", tokenTransaksiTopup);
app.use("/api/progress", tokenProgressTopup);
// TOKEN ROUTER

// VIRTUAL ACCOUNT TOKEN
app.use("/api/vatoken", virtualAccount);
// VIRTUAL ACCOUNT TOKEN

// LOG TOKEN ROUTER
app.use("/api/logtoken", logTokenTrans);
app.use("/api/historytoken", historyTokenTrans);
// LOG TOKEN ROUTER
app.use("/api/gl", glRouter);
app.use("/api/failtrlog", failedTrLog);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/user", userrouter);
app.use("/api/userrole", userRole);
app.use("/api/blockgroup", blockgroup);
app.use("/api/block", block);
app.use("/api/building", building);
app.use("/api/floor", floor);
app.use("/api/unit", unit);
app.use("/api/gas", gas);
app.use("/api/power", power);
app.use("/api/water", water);
app.use("/api/parking", parking);
app.use("/api/customer", customer);
app.use("/api/internalUser", internalUser);
app.use("/api/externalUser", externalUser);
app.use("/api/locationBuilding", locationBuilding);
app.use("/api/shiftSchedule", shiftSchedule);
app.use("/api/renter", renter);
app.use("/api/vehicletype", vt);
app.use("/api/powbill", powerbilling);
app.use("/api/state", state);
app.use("/api/excel", datashare);
app.use("/api/unittype", unittype);
app.use("/api/contract/lease", contractLease);
app.use("/api/contract/ownership", contractOwner);
app.use("/api/contract/renter", contractRenter);
app.use("/api/contract/pp", contractPP);
app.use("/api/contract", contract);
app.use("/api/billing", billing);
app.use("/api/billing/paidpayment", paidpayment);
app.use("/api/billinglog", billingLog);

app.use("/api/pinalty", pinalty);

app.use("/api/rentalbilling", rentalbilling);
app.use("/api/parkingbilling", parkingbilling);

app.use("/api/cashbank", cashBank);
app.use("/api/leasebilling", leasebilling);
app.use("/api/newBilling", newBilling);
app.use("/api/unitrate", unitrate);
app.use("/api/deposit", deposit);
app.use("/api/acctype", acctype);
app.use("/api/acccat", acccat);
app.use("/api/acct", acct);
app.use("/api/fiscalfa", fiscal);
app.use("/api/fixedasset", fixedAsset);
app.use("/api/uom", uom);
app.use("/api/invoice", invoice);

app.use("/api/pnltyrate", pnltyrate);
app.use("/api/bank", bank);
app.use("/api/bankacct", bankacct);
app.use("/api/tax", tax);
app.use("/api/currency", currency);
app.use("/api/category", category);
app.use("/api/defect", defect);
app.use("/api/subdefect", subdefect);
app.use("/api/role", role);
app.use("/api/application", application);
app.use("/api/additionalParking", additionParking);
app.use("/api/engineer", engineer);
app.use("/api/ticket", ticket);
app.use("/api/ticketlist", ticketlist);
app.use("/api/do", deliveryOrder);
app.use("/api/listDO", doList);

app.use("/api/rating", rating);
app.use("/api/mstrevenue", mstRevenue);
app.use("/api/revenue", revenue);
app.use("/api/asset/management", assetManagement);
app.use("/api/asset/deprecitiaion", assetDepreciation);

app.use("/api/accreceive", accountReceive);
app.use("/api/accpurchase", accountPurchase);
app.use("/api/visitor", visitor);

app.use("/api/balance", balance);
app.use("/api/log/balance", BalanceLog);

app.use("/api/packagemanagement", packageManagement);
app.use("/api/packagemanagement/category", packageCategory);

app.use("/api/facility", facilityReservation);
app.use("/api/billingbank", billingBank);

app.use("/api/log/packagemanagement", logPackageManagement);

app.use("/api/faq", faq);
app.use("/api/tnc", tnc);
app.use("/api/news", news);

app.use("/api/pushnotif", pushNotification);

app.use("/api/budgeting", budgeting);
app.use("/api/log/budgeting", budgeting);

app.use("/api/webnotif", webNotification), app.use("/api/cs", customerService);

app.use("/api/vendorcategory", vendorCategory);
app.use("/api/log/vendorcategory", vendorCategoryLog);
app.use("/api/vendor", vendor);
app.use("/api/log/vendor", vendorLog);

app.use("/api/department", department);
app.use("/api/log/department", departmentLog);

app.use("/api/division", division);
app.use("/api/log/division", divisionLog);

app.use("/api/masteruser", mUser);
app.use("/api/commersil", commersil);
//tes
app.use("/api/purchase/request", purchaseRequest);
app.use("/api/purchase/quotation", quotation);
app.use("/api/purchase/order", purchaseOrder);
app.use("/api/purchase/receipt", poReceipt);
app.use("/api/purchase/poPayment", poPayment);
app.use("/api/purchase/pettycash", pettyCash);
app.use("/api/masterproductcategory", masterProductCategory);
app.use("/api/masterproductbrand", masterProductBrand);
app.use("/api/masteruom", masterUom);

app.use("/api/inventorymanagement", inventoryManagement);
app.use("/api/requestInvoice", requestInvoice);
app.use("/api/trialbalance", trialBalance);
app.use("/api/transferbudget", transferBudget);
app.use("/api/profitloss", profitLoss);
app.use("/api/cashflow", cashFLow);

app.use("/api/helper", helper);

app.use("/api/logfinance", logFinance);
app.use("/api/acchistory", accountHistory);
app.use("/api/accindex", accountHistoryIndex);
app.use("/api/rejectedtrans", rejectedTransaction);
app.use("/api/report/finance", reportFinance);

// New Module Finance Update Date 03-05-2023
app.use("/api/newFinance/accountHistory", newFinanceAccountHistory);
app.use("/api/newFinance/transactions", newFinanceTransactions);
app.use("/api/newFinance/report", newFinanceReport);

app.use("/api/mobilenotification", mobileNotification);
app.use("/api/mobiledeposit", mobileDeposit);
app.use("/api/mobileinvoice", mobileInvoice);

app.use("/api/paymentGateway", paymentGateway);
app.use("/api/logaction", logAction);

//arcard
app.use("/api/arCard", arCard);

// Void Billing & Journal
app.use("/api/voidBill", voidBill);
app.use("/api/jourVoid", jourVoid);

//billing notif
app.use("/api/billingnotif", billingNotif);
//ticket public
app.use("/api/ticketPublic", ticketPublic);
app.use("/api/ticketPubliclist", ticketPubliclist);

//do public
app.use("/api/doPublic", doPublic);
app.use("/api/listDOPublic", doListPublic);

//rating Public
app.use("/api/ratingPublic", ratingPublic);

//va bjbs transaksi
app.use("/api/vabjbs/transaksi", vabjbsTransaksi);

app.use("/api/absensi", absensi);

app.use("/api/checkpoint", checkpoint)
app.use("/api/surveyTemplate", surveyTemplate)
app.use("/api/patrol", patrol);

app.use("/api/emergency", emergency);

app.use("/api/taskManagement", taskManagement);
app.use("/api/taskManagementMaster", taskManagementMaster);

app.use("/api/inspeksi", inspeksi);



app.use(globalErrorHandler);

// To show whether host is HTTP or HTTPS
app.enable("trust proxy");

app.use(express.static("public"));

//initialization Socket
const httpServer = http.createServer(app);

//listen to server socket
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

httpServer.listen(process.env.PORT_SOCKET, () => {
  console.log(`Server Socket start at port ${process.env.PORT_SOCKET}`);
});

//set to global
global.io = socketio(httpServer, { cors: { origin: "*" } });
global.io.on("connection", (client) => {
  SocketioHelpers.connection(client);
});

//server start
app.listen(config.port, () => console.log(`server started`));

// Calling trigger Schedule

const { transactionChecker } = require("./progressTopupToken/scheduler/schedule");
const { packageManagementChecker } = require("./packageManagement/scheduler");

transactionChecker();
packageManagementChecker();

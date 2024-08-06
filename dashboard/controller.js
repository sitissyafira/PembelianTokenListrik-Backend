const Ticket = require("../helpdesk/ticket/model");
const { Unit } = require("../unit/model");
// const { FacilityReservation } = require("../facilityReservation/model");
const errorHandler = require("../controllers/errorController");
const PackageManagement = require("../packageManagement/model");
const { Billing } = require("../billing/model");
const { PowBilling } = require("../pwbilling/model");
const { Deposit } = require("../deposit/model");
const { CashBank } = require("../cashbank/model");
const { AccountReceive } = require("../finance/ar/model");
const { AccountPayment } = require("../finance/ap/model");

const { getBillingData,showDashboard,getRecordingMeterData } = require("./service")
const moment = require("moment");

module.exports = {
  DashboardForTRO: async function (req, res, next) {
    try {
      const listUnit = await Unit.find();
      const unitLength = listUnit.length;
      let totalAvailableUnit = 0;
      let totalBastUnit = 0;
      listUnit.map((i) => {
        if (i.type === "") totalAvailableUnit++;
        else totalBastUnit++;
      });

      const listTicket = await Ticket.find();
      const ticketLength = listTicket.length;
      const listTicketStatusOpen = await Ticket.find({
        status: "open",
      });
      const openTicketLength = listTicketStatusOpen.length;
      const listTicketStatusProgress = await Ticket.find({
        $or: [
          {
            status: "waiting for schedule",
          },
          {
            status: "waiting for confirmation",
          },
          {
            status: "scheduled",
          },
          {
            status: "rescheduled",
          },
          {
            status: "visit",
          },
          {
            status: "fixed",
          },
        ],
      });
      const progressTicketLength = listTicketStatusProgress.length;
      const listTicketStatusDone = await Ticket.find({
        status: "done",
      });
      const doneTicketLength = listTicketStatusDone.length;

      const totalAllTicket = listTicket.length;
      const totalOpenTicket = listTicketStatusOpen.length;
      const totalProgressTicket = listTicketStatusProgress.length;
      const totalDoneTicket = listTicketStatusDone.length;

      const percentageOpenTicket = ((totalOpenTicket / totalAllTicket) * 100).toFixed(2);
      const percentageProgressTicket = ((totalProgressTicket / totalAllTicket) * 100).toFixed(2);
      const percentageDoneTicket = ((totalDoneTicket / totalAllTicket) * 100).toFixed(2);

      // const listFacility = await FacilityReservation.find({
      //   isDelete: false,
      // });
      // const totalAllFacility = listFacility.length;

      // let now = +new Date();
      // let done = [];
      // let ongoing = [];
      // listFacility.map((e) => {
      //   if (now > e.reservation_date) {
      //     done.push(e._id);
      //   } else if (now < e.reservation_date) {
      //     ongoing.push(e._id);
      //   } else {
      //     console.log("No Data");
      //   }
      // });
      // const totalFacilityDone = done.length;
      // const totalFacilityOngoing = ongoing.length;

      // let data = await FacilityReservation.aggregate([
      //   {
      //     $addFields: {
      //       month: {
      //         $month: "$reservation_date",
      //       },
      //     },
      //   },
      //   {
      //     $match: {
      //       month: new Date().getMonth() + 1,
      //     },
      //   },
      // ]);
      // const totalFacilityMonthly = data.length;

      const dashboard = {
        unit: {
          allUnit: unitLength,
          bastUnit: totalBastUnit,
          nonBastUnit: totalAvailableUnit,
        },
        ticket: {
          allTicket: ticketLength,
          openTicket: {
            totalTicket: openTicketLength,
            percentage: percentageOpenTicket,
          },
          progressTicket: {
            totalProgress: progressTicketLength,
            percentage: percentageProgressTicket,
          },
          doneTicket: {
            totalDone: doneTicketLength,
            percentage: percentageDoneTicket,
          },
        },
        // facilityReservation: {
        //   allFacility: totalAllFacility,
        //   openFacility: totalFacilityOngoing,
        //   doneFacility: totalFacilityDone,
        //   monthlyFacility: totalFacilityMonthly,
        // },
      };

      res.status(200).send({
        status: "success",
        data: dashboard,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        msg: "error",
      });
    }
  },

  DashboardForEngineer: async function (req, res, next) {
    try {
      const listTicket = await Ticket.find();
      const ticketLength = listTicket.length;
      const listTicketStatusOpen = await Ticket.find({
        status: "open",
      });
      const openTicketLength = listTicketStatusOpen.length;
      const listTicketStatusProgress = await Ticket.find({
        $or: [
          {
            status: "waiting for schedule",
          },
          {
            status: "waiting for confirmation",
          },
          {
            status: "scheduled",
          },
          {
            status: "rescheduled",
          },
          {
            status: "visit",
          },
          {
            status: "fixed",
          },
        ],
      });
      const progressTicketLength = listTicketStatusProgress.length;
      const listTicketStatusDone = await Ticket.find({
        status: "done",
      });
      const doneTicketLength = listTicketStatusDone.length;

      const totalAllTicket = listTicket.length;
      const totalOpenTicket = listTicketStatusOpen.length;
      const totalProgressTicket = listTicketStatusProgress.length;
      const totalDoneTicket = listTicketStatusDone.length;

      const percentageOpenTicket = ((totalOpenTicket / totalAllTicket) * 100).toFixed(2);
      const percentageProgressTicket = ((totalProgressTicket / totalAllTicket) * 100).toFixed(2);
      const percentageDoneTicket = ((totalDoneTicket / totalAllTicket) * 100).toFixed(2);

      const dashboard = {
        ticket: {
          allTicket: ticketLength,
          openTicket: {
            totalTicket: openTicketLength,
            percentage: percentageOpenTicket,
          },
          progressTicket: {
            totalProgress: progressTicketLength,
            percentage: percentageProgressTicket,
          },
          doneTicket: {
            totalDone: doneTicketLength,
            percentage: percentageDoneTicket,
          },
        },
      };
      res.status(200).send({
        status: "success",
        data: dashboard,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        msg: "error",
      });
    }
  },

  DashboardForCS: async function (req, res, next) {
    try {
      const filterStatusIn = { package_status: "in" };
      const filterStatusOut = { package_status: "out" };
      const filterStatusConfirmed = { $or: [{ package_status: "confirmed", package_status: "confirmed by system" }] };
      const packageManagement = await PackageManagement.find();
      const packageManagementLen = packageManagement.length;
      const packageManagementIn = await PackageManagement.find(filterStatusIn);
      const packageManagementInLen = packageManagementIn.length;
      const packageManagementOut = await PackageManagement.find(filterStatusOut);
      const packageManagementOutLen = packageManagementOut.length;
      const packageManagementConfirmed = await PackageManagement.find(filterStatusConfirmed);
      const packageManagementConfirmedLen = packageManagementConfirmed.length;

      const dashboard = {
        packageManagement: {
          all: packageManagementLen,
          in: packageManagementInLen,
          out: packageManagementOutLen,
          confirmed: packageManagementConfirmedLen,
        },
      };
      res.status(200).send({
        status: "success",
        data: dashboard,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        msg: "error",
      });
    }
  },

  DashboardForFinance: async function (req, res, next) {
    try {
      //BILLING IPL
      let allBillingNominal = 0;
      let paidNominal = 0;
      let unpaidNominal = 0;

      const filterPaid = { isPaid: true };
      const filterunpaid = { isPaid: false };
      const allBilling = await Billing.find();
      const allBillingLen = allBilling.length;
      allBilling.forEach((element) => {
        allBillingNominal += element.totalBilling;
      });
      const paidBilling = await Billing.find(filterPaid);
      const paidBillingLen = paidBilling.length;
      paidBilling.forEach((element) => {
        paidNominal += element.totalBilling;
      });
      const unpaidBilling = await Billing.find(filterunpaid);
      const unpaidBillingLen = unpaidBilling.length;
      unpaidBilling.forEach((element) => {
        unpaidNominal += element.totalBilling;
      });

      //BILLING POWER
      let powBillNominal = 0;
      let powBillPaidNominal = 0;
      let powBillUnpaidNominal = 0;
      const powBill = await PowBilling.find();
      powBill.forEach((element) => {
        if (element.isPaid === true) {
          powBillNominal += element.fee;
          powBillPaidNominal += element.fee;
        } else {
          powBillNominal += element.fee;
          powBillUnpaidNominal += element.fee;
        }
      });

      //DEPOSIT
      let nominalDepositInLease = 0;
      let nominalDepositInSecurity = 0;
      let nominalDepositInFittingOut = 0;
      let nominalDepositOutLease = 0;
      let nominalDepositOutSecurity = 0;
      let nominalDepositOutFittingOut = 0;
      const depositData = await Deposit.find();
      depositData.forEach((element) => {
        if (element.type === "Pinjam Pakai Deposit") {
          nominalDepositInLease += element.dpstin;
          nominalDepositOutLease += element.dpstout;
        } else if (element.type === "Security Deposit") {
          nominalDepositInSecurity += element.dpstin;
          nominalDepositOutSecurity += element.dpstout;
        } else if (element.type === "Fitting Out Deposit") {
          nominalDepositInFittingOut += element.dpstin;
          nominalDepositOutFittingOut += element.dpstout;
        }
      });

      //CASHBANK
      let nominalCashBank = 0;
      const cashBankData = await CashBank.find();
      cashBankData.forEach((element) => {
        nominalCashBank += element.balance;
      });

      //AR
      let nominalAR = 0;
      const dataAccReceive = await AccountReceive.find();
      dataAccReceive.forEach((element) => {
        nominalAR += element.amount;
      });

      //AP
      let nominalAP = 0;
      const dataAccPayment = await AccountPayment.find();
      dataAccPayment.forEach((element) => {
        nominalAP += element.amount;
      });

      const dashboard = {
        billingIPL: {
          all: {
            total: allBillingLen,
            nominal: allBillingNominal,
          },
          paid: {
            total: paidBillingLen,
            nominal: paidNominal,
          },
          unpaid: {
            total: unpaidBillingLen,
            nominal: unpaidNominal,
          },
        },
        billingPower: {
          total: powBillNominal,
          paid: powBillPaidNominal,
          unpaid: powBillUnpaidNominal,
        },
        deposit: {
          in: {
            lease: nominalDepositInLease,
            security: nominalDepositInSecurity,
            fittingOut: nominalDepositInFittingOut,
          },
          out: {
            lease: nominalDepositOutLease,
            security: nominalDepositOutSecurity,
            fittingOut: nominalDepositOutFittingOut,
          },
        },
        cashBank: {
          cashBank: nominalCashBank,
          AR: nominalAR,
          AP: nominalAP,
        },
      };

      res.status(200).send({
        status: "success",
        data: dashboard,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        msg: "error",
      });
    }
  },

  DashboardForManager: async function (req, res, next) {
    try {
      //BILLING IPL
      let allBillingNominal = 0;
      let paidNominal = 0;
      let unpaidNominal = 0;

      const filterPaid = { isPaid: true };
      const filterunpaid = { isPaid: false };
      const allBilling = await Billing.find();
      const allBillingLen = allBilling.length;
      allBilling.forEach((element) => {
        allBillingNominal += element.totalBilling;
      });
      const paidBilling = await Billing.find(filterPaid);
      const paidBillingLen = paidBilling.length;
      paidBilling.forEach((element) => {
        paidNominal += element.totalBilling;
      });
      const unpaidBilling = await Billing.find(filterunpaid);
      const unpaidBillingLen = unpaidBilling.length;
      unpaidBilling.forEach((element) => {
        unpaidNominal += element.totalBilling;
      });

      //BILLING POWER
      let powBillNominal = 0;
      let powBillPaidNominal = 0;
      let powBillUnpaidNominal = 0;
      const powBill = await PowBilling.find();
      powBill.forEach((element) => {
        if (element.isPaid === true) {
          powBillNominal += element.fee;
          powBillPaidNominal += element.fee;
        } else {
          powBillNominal += element.fee;
          powBillUnpaidNominal += element.fee;
        }
      });

      //UNIT
      const listUnit = await Unit.find();
      const unitLength = listUnit.length;
      let totalAvailableUnit = 0;
      let totalBastUnit = 0;
      listUnit.map((i) => {
        if (i.type === "") totalAvailableUnit++;
        else totalBastUnit++;
      });

      //TICKET
      let rating = 0;
      let TotalTicketRated = [];
      const listTicket = await Ticket.find();
      const ticketLength = listTicket.length;

      count = 0;
      let totalRating = 0;
      let collectRating = [];
      listTicket.forEach((element, index) => {
        if (element.rating != null || element.rating > 0) {
          totalRating += element.rating;
          collectRating.push(element.rating);
        }
      });
      const ratingAverage = (totalRating / collectRating.length).toFixed(2);
      const listTicketStatusOpen = await Ticket.find({
        status: "open",
      });
      const openTicketLength = listTicketStatusOpen.length;
      const listTicketStatusProgress = await Ticket.find({
        $or: [
          {
            status: "waiting for schedule",
          },
          {
            status: "waiting for confirmation",
          },
          {
            status: "scheduled",
          },
          {
            status: "rescheduled",
          },
          {
            status: "visit",
          },
          {
            status: "fixed",
          },
        ],
      });
      const progressTicketLength = listTicketStatusProgress.length;
      const listTicketStatusDone = await Ticket.find({
        status: "done",
      });
      const doneTicketLength = listTicketStatusDone.length;
      const totalAllTicket = listTicket.length;
      const totalOpenTicket = listTicketStatusOpen.length;
      const totalProgressTicket = listTicketStatusProgress.length;
      const totalDoneTicket = listTicketStatusDone.length;
      const percentageOpenTicket = ((totalOpenTicket / totalAllTicket) * 100).toFixed(2);
      const percentageProgressTicket = ((totalProgressTicket / totalAllTicket) * 100).toFixed(2);
      const percentageDoneTicket = ((totalDoneTicket / totalAllTicket) * 100).toFixed(2);

      // const listFacility = await FacilityReservation.find({
      //   isDelete: false,
      // });
      // const totalAllFacility = listFacility.length;

      // let now = +new Date();
      // let done = [];
      // let ongoing = [];
      // listFacility.map((e) => {
      //   if (now > e.reservation_date) {
      //     done.push(e._id);
      //   } else if (now < e.reservation_date) {
      //     ongoing.push(e._id);
      //   } else {
      //     console.log("No Data");
      //   }
      // });
      // const totalFacilityDone = done.length;
      // const totalFacilityOngoing = ongoing.length;

      // let data = await FacilityReservation.aggregate([
      //   {
      //     $addFields: {
      //       month: {
      //         $month: "$reservation_date",
      //       },
      //     },
      //   },
      //   {
      //     $match: {
      //       month: new Date().getMonth() + 1,
      //     },
      //   },
      // ]);
      // const totalFacilityMonthly = data.length;

      const dashboard = {
        billingIPL: {
          all: {
            total: allBillingLen,
            nominal: allBillingNominal,
          },
          paid: {
            total: paidBillingLen,
            nominal: paidNominal,
          },
          unpaid: {
            total: unpaidBillingLen,
            nominal: unpaidNominal,
          },
        },
        billingPower: {
          total: powBillNominal,
          paid: powBillPaidNominal,
          unpaid: powBillUnpaidNominal,
        },
        unit: {
          allUnit: unitLength,
          BAST: totalBastUnit,
          available: totalAvailableUnit,
        },
        ticket: {
          allTicket: ticketLength,
          openTicket: openTicketLength,
          progressTicket: progressTicketLength,
          doneTicket: doneTicketLength,
          totalRated: collectRating.length,
          ratingAverage: ratingAverage,
        },
        // facilityReservation: {
        //   all: totalAllFacility,
        //   ongoing: totalFacilityOngoing,
        //   done: totalFacilityDone,
        // },
      };

      res.status(200).send({
        status: "success",
        data: dashboard,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        msg: "error",
      });
    }
  },

  showDashboard: async function (req, res, next) {
    try {
      const listUnit = await Unit.find();
      const totalAllUnit = listUnit.length;
      let totalAvailableUnit = 0;
      let totalBastUnit = 0;
      listUnit.map((i) => {
        if (i.type === "") totalAvailableUnit++;
        else totalBastUnit++;
      });

      const listTicket = await Ticket.find();
      const listTicketStatusOpen = await Ticket.find({
        status: "open",
      });
      const listTicketStatusProgress = await Ticket.find({
        // status: "open",
        $or: [
          {
            status: "waiting for schedule",
          },
          {
            status: "waiting for confirmation",
          },
          {
            status: "scheduled",
          },
          {
            status: "rescheduled",
          },
          {
            status: "visit",
          },
          {
            status: "fixed",
          },
        ],
      });

      const listTicketStatusDone = await Ticket.find({
        status: "done",
      });

      const totalAllTicket = listTicket.length;
      const totalOpenTicket = listTicketStatusOpen.length;
      const totalProgressTicket = listTicketStatusProgress.length;
      const totalDoneTicket = listTicketStatusDone.length;

      const percentageOpenTicket = (totalOpenTicket / totalAllTicket) * 100;
      const percentageProgressTicket = (totalProgressTicket / totalAllTicket) * 100;
      const percentageDoneTicket = (totalDoneTicket / totalAllTicket) * 100;

      const roundingPercentageOpenTicket = parseFloat(percentageOpenTicket.toFixed(2));
      const roundingPercentageProgressTicket = parseFloat(percentageProgressTicket.toFixed(2));
      const roundingPercentageDoneTicket = parseFloat(percentageDoneTicket.toFixed(2));

      // const listFacility = await FacilityReservation.find({
      //   isDelete: false,
      // });
      // const totalAllFacility = listFacility.length;

      // let now = +new Date();
      // let done = [];
      // let ongoing = [];
      // listFacility.map((e) => {
      //   if (now > e.reservation_date) {
      //     done.push(e._id);
      //   } else if (now < e.reservation_date) {
      //     ongoing.push(e._id);
      //   } else {
      //     console.log("No Data");
      //   }
      // });

      // const totalFacilityDone = done.length;
      // const totalFacilityOngoing = ongoing.length;

      // let data = await FacilityReservation.aggregate([
      //   {
      //     $addFields: {
      //       month: {
      //         $month: "$reservation_date",
      //       },
      //     },
      //   },
      //   {
      //     $match: {
      //       month: new Date().getMonth() + 1,
      //     },
      //   },
      // ]);
      // const totalFacilityMonthly = data.length;

      const dashboardVariable = {
        unit: {
          total: totalAllUnit,
          bast: totalBastUnit,
          available: totalAvailableUnit,
        },
        ticket: {
          total: totalAllTicket,
          open: {
            total: totalOpenTicket,
            percentage: roundingPercentageOpenTicket,
          },
          progress: {
            total: totalProgressTicket,
            percentage: roundingPercentageProgressTicket,
          },
          done: {
            total: totalDoneTicket,
            percentage: roundingPercentageDoneTicket,
          },
        },
        // facility: {
        //   total: totalAllFacility,
        //   monthly: totalFacilityMonthly,
        //   done: totalFacilityDone,
        //   ongoing: totalFacilityOngoing,
        // },
      };

      res.status(200).send({
        status: "success",
        data: dashboardVariable,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        msg: "error",
      });
    }
  },
  NewDashboard: async function (req, res, next){
    try {
      console.log("start new dashboard")
      const refresh = req.query.refresh ? true : false
      // const bill = await getBillingData(moment("2022-07-01"))
      // const getRecordingConsumption = await getRecordingMeterData(moment("2022-07-05"))
      const data = await showDashboard(refresh)
      console.log("end new dashboard")
      // return res.send({getBilling})
      res.send({status:"success",data :data})
    } catch (error) {
      console.log(error)
    }
  }
};

const { Billing } = require("../billing/model")
const moment = require("moment");
const { Ownership } = require("../contract/owner/model")
const { Water } = require("../water/master/model")
const { TransaksiWater } = require("../water/transaksi/model")
const { TransaksiPower } = require("../power/transaksi/model")
const { Unit } = require("../unit/model")
const { TicketPublic } = require("../ticketPublic/Ticket/model")
const Ticket = require("../helpdesk/ticket/model")
const { AccountReceive } = require("../finance/ar/model")
const { AccountPayment } = require("../finance/ap/model")
const { tok_trtoken } = require("../trToken/model")
const { FacilityReservation } = require("../facilityReservation/reservation/model")
let used = false
let data = {
    ticket: {
        public: {
            new: 0,
            progress: 0,
            done: 0,
            total: 0,
            graph: []
        },
        private: {
            new: 0,
            progress: 0,
            done: 0,
            total: 0,
            graph: []
        },
    },
    unit: {
        total: 0,
        bast: 0,
        available: 0
    },
    recordingMeter: {
        period: "",
        items: {
            electricity_meter: {
                used: true,
                total: 0,
                value: 0,
            },
            water_meter: {
                used: true,
                total: 0,
                value: 0,
            },
            gas_meter: {
                used: false,
                total: 0,
                value: 0,
            }
        }
    },
    billing: {
        payment: {
            period: "",
            totalCount: 0,
            totalAmount: 0,
            paidAmount: 0,
            outstandingAmount: 0
        },
        collections: {
            period: "",
            label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            achievement: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            target: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    },
    revenue: {
        period: "",
        totalAmount: 0,
        label: [],
        graph: []

    },
    profitLoss: {
        profitPercentage: 0,
        profitAmount: 0,
        lossPercentage: 0,
        lossAmount: 0,
        graph: [], // profit and then loss
    },
    notifications: {
        period: "",
        private_ticket: 0,
        public_ticket: 0,
        billing: 0,
        token: 0,
        electricity: 0,
        water: 0,
        facility_reservation: 0
    }
}
module.exports = {
    percentage(partialValue, totalValue) {
        const percentage = (100 * partialValue) / totalValue
        if (!Number.isInteger(percentage)) {
            return parseFloat(percentage.toFixed(2))
        }
        return percentage
    },
    formatFloat(amount) {
        if (!Number.isInteger(amount)) {
            return parseFloat(amount.toFixed(2))
        }
        return amount
    },
    getBillingData: async function (date) {
        try {
            console.log(date)
            const totalUnit = await Ownership.countDocuments()
            const queryTarget = [
                { $match: { billing_date: { $gte: new Date(moment(date).startOf("year").toISOString()), $lt: new Date(moment(date).endOf("year").toISOString()) } } },
                // {
                //     $addFields:{
                //         billdate:{ // this field is used for correcting timezone. from UTC to UTC + 7   
                //             $dateAdd: {
                //                 startDate: "$billing_date",
                //                 unit: "hour",
                //                 amount: 7
                //             }
                //         }
                //       }
                // },
                {
                    $addFields: {
                        billdate: { $add: ["$billing_date", 1 * 7 * 60 * 60000] } // this field is used for correcting timezone. from UTC to UTC + 7 
                    }
                },
                {
                    $group: {
                        _id: { $month: "$billdate" },
                        total: { $sum: 1 },
                    }
                },
            ]
            const queryAchiement = [
                { $match: { billing_date: { $gte: new Date(moment(date).startOf("year").toISOString()), $lt: new Date(moment(date).endOf("year").toISOString()) }, paymentStatus: true, isPaid: true }, },
                // { 
                //     $addFields:{
                //         billdate:{ // this field is used for correcting timezone. from UTC to UTC + 7   
                //             $dateAdd: {
                //                 startDate: "$billing_date",
                //                 unit: "hour",
                //                 amount: 7
                //             }
                //         }
                //       }
                // },
                {
                    $addFields: {
                        billdate: { $add: ["$billing_date", 1 * 7 * 60 * 60000] } // this field is used for correcting timezone. from UTC to UTC + 7 .
                    }
                },
                {
                    $group: {
                        _id: { $month: "$billdate" }, // group billing by month of date
                        total: { $sum: 1 },
                    }
                },
            ]
            const queryMonth = [
                { $match: { billing_date: { $gte: new Date(moment(date).startOf("month").toISOString()), $lt: new Date(moment(date).endOf("month").toISOString()) } } },
                {
                    $group: {
                        _id: null,
                        totalCount: { $sum: 1 },
                        totalAmount: { $sum: "$totalBilling" },
                        paidAmount: { $sum: "$totalNominal" },
                        outstandingAmount: {
                            $sum: {
                                /** sum condition on mongodb */
                                $cond: [
                                    { $ifNull: ['$totalBillLeft', false] }, //if
                                    '$totalBilling', // true
                                    {
                                        $cond:
                                            [
                                                { $gt: ['$totalBillLeft', 0] }, // if
                                                '$totalBillLeft', // true
                                                0  // else
                                            ]
                                    }
                                ]
                            }

                        }
                    }
                }
            ]
            const billing = await Billing.aggregate(queryMonth)

            const targetList = await Billing.aggregate(queryTarget)
            const achievementList = await Billing.aggregate(queryAchiement)

            for (let i = 0; i < targetList.length; i++) {
                data.billing.collections.target[targetList[i]._id - 1] = targetList[i].total
            }
            for (let i = 0; i < achievementList.length; i++) {
                data.billing.collections.achievement[achievementList[i]._id - 1] = achievementList[i].total
            }
            if (billing.length > 0) {
                data.billing.payment = billing[0]
                data.billing.payment.period = moment(date).format("MMMM YYYY")
            }
            data.billing.collections.period = moment(date).format("MMMM YYYY")

            return {
                status: "success"
            }
        } catch (error) {
            console.log(error)
        }

    },
    getRecordingMeterData: async function (date) {
        try {
            const startDate = new Date(moment(date).startOf("month").toISOString())
            const endDate = new Date(moment(date).endOf("month").toISOString())
            const query = {
                billmnt: { $gte: startDate, $lte: endDate }
            }
            const targetElectricity = await Ownership.countDocuments({ isToken: false })
            const targetWater = await Ownership.countDocuments()
            const achievementWater = await TransaksiWater.find({ billmnt: query.billmnt }).countDocuments()
            const achievementElectricity = await TransaksiPower.find({ billmnt: query.billmnt }).countDocuments()
            data.recordingMeter.items.electricity_meter.total = targetElectricity
            data.recordingMeter.items.electricity_meter.value = achievementElectricity
            data.recordingMeter.items.water_meter.total = targetWater
            data.recordingMeter.items.water_meter.value = achievementWater
            data.recordingMeter.period = moment(date).format("MMMM YYYY")
            return {
                data: data.recordingMeter.items
            }

        } catch (error) {
            console.log(error)
        }
    },
    getUnit: async function () {
        const listUnit = await Unit.find();
        const totalAllUnit = listUnit.length;
        let totalAvailableUnit = 0;
        let totalBastUnit = 0;
        listUnit.map((i) => {
            if (i.type === "") totalAvailableUnit++;
            else totalBastUnit++;
        });
        data.unit.total = totalAllUnit
        data.unit.available = totalAvailableUnit
        data.unit.bast = totalBastUnit
    },
    getTicketPublic: async function () {
        try {
            console.log("ticket public")
            const ticketOpen = await TicketPublic.find({ status: "open" }).countDocuments()
            const ticketDone = await TicketPublic.find({ status: "tick-work-done" }).countDocuments()
            const ticket = await TicketPublic.find().countDocuments()
            const ticketProgress = ticket - ticketOpen - ticketDone
            data.ticket.public.new = ticketOpen
            data.ticket.public.progress = ticketProgress
            data.ticket.public.done = ticketDone
            data.ticket.public.total = ticket
            let graph = []
            graph.push(ticketOpen)
            graph.push(ticketProgress)
            graph.push(ticketDone)
            graph.push(ticket)
            data.ticket.public.graph = graph
        } catch (error) {
            console.log(error)
        }
    },
    getTicketPrivate: async function () {
        try {
            console.log("ticket private")
            // const ticketOpen = await Ticket.find({status:"open"}).countDocuments()
            const ticketOpen = await Ticket.find({ status: "open" }).countDocuments()

            const ticketDone = await Ticket.find({ status: "tick-work-done" }).countDocuments()
            const ticket = await Ticket.find().countDocuments()
            const ticketProgress = ticket - ticketOpen - ticketDone
            data.ticket.private.new = ticketOpen
            data.ticket.private.progress = ticketProgress
            data.ticket.private.done = ticketDone
            data.ticket.private.total = ticket
            let graph = []
            graph.push(ticketOpen)
            graph.push(ticketProgress)
            graph.push(ticketDone)
            graph.push(ticket)
            data.ticket.private.graph = graph
        } catch (error) {
            console.log(error)
        }
    },

    getRevenueMonth: async function (date) {
        const query = [
            {
                $match:
                    { paidDate: { $ne: null }, paidDate: { $gte: new Date(moment(date).startOf("month").toISOString()), $lt: new Date(moment(date).endOf("month").toISOString()) } },

            },
            {
                $group: {
                    _id: {
                        month: {
                            $month:
                                { "$add": ["$paidDate", 7 * 60 * 60 * 1000] }

                        },
                        day: {
                            $dayOfMonth:
                                { "$add": ["$paidDate", 7 * 60 * 60 * 1000] }

                        },
                        year: {
                            $year: { "$add": ["$paidDate", 7 * 60 * 60 * 1000] }
                        },
                        formattedDateString: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: '$paidDate'
                            }
                        }
                    },
                    // label:{ $dateToString: { format: "%d/%m/%Y", date: "$paidDate" } },
                    total: { $sum: 1 },
                    nominal: { $sum: "$totalNominal" }
                }
            },
            {
                $sort: {
                    "_id.day": 1
                }
            },
        ]


        const billing = await Billing.aggregate(query)
        let totalNominal = 0
        let graph = []
        let label = []
        /** start point of revenue is always from 0 */
        graph.push(0)
        label.push("")
        for (let i = 0; i < billing.length; i++) {
            totalNominal = totalNominal + billing[i].nominal
            graph.push(billing[i].nominal)
            label.push(billing[i]._id.formattedDateString)
        }
        graph.push(0)
        label.push("")
        data.revenue.period = moment(date).format("MMMM YYYY")
        data.revenue.totalAmount = totalNominal
        data.revenue.graph = graph
        data.revenue.label = label

    },

    showDashboard: async function (refresh) {
        console.log(used, refresh)
        if (!used || refresh) {
            await module.exports.getBillingData(moment())
            await module.exports.getRecordingMeterData(moment())
            await module.exports.getUnit();
            await module.exports.getTicketPublic()
            await module.exports.getTicketPrivate()
            await module.exports.getRevenueMonth(moment())
            await module.exports.getProfitLoss()
            await module.exports.getNewPrivateTicket()
            await module.exports.getNewPublicTicket()
            await module.exports.getNewBillingPayment()
            await module.exports.getNewToken()
            await module.exports.getNewElectricity()
            await module.exports.getNewWater()
            await module.exports.getNewFacilityReservation()
            used = true
        }
        return data
    },
    getProfitLoss: async function () {
        try {
            const date = moment()
            const query = [
                {
                    $match:
                        { date: { $ne: null }, date: { $gte: new Date(moment(date).startOf("month").toISOString()), $lt: new Date(moment(date).endOf("month").toISOString()) } },

                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$totalAll.debit" },
                    }
                }
            ]
            const ar = await AccountReceive.aggregate(query)
            const ap = await AccountPayment.aggregate(query)
            const profitAmount = ar.length == 0 ? 0 : ar[0].totalAmount
            const lossAmount = ap.length == 0 ? 0 : ap[0].totalAmount

            const total = profitAmount + lossAmount
            const profitPercentage = ar.length == 0 ? 0 : profitAmount == 0 ? 0 : this.percentage(profitAmount, total)
            // const lossPercentage = ap.length == 0 ? 0 : lossAmount == 0 ? 0 : this.percentage(lossAmount,total)
            const lossPercentage = ap.length == 0 ? 0 : lossAmount == 0 ? 0 : this.formatFloat(100 - profitPercentage)


            data.profitLoss.profitAmount = profitAmount
            data.profitLoss.profitPercentage = profitPercentage
            data.profitLoss.lossAmount = lossAmount
            data.profitLoss.lossPercentage = lossPercentage
            data.profitLoss.graph = [profitPercentage, lossPercentage]
        } catch (error) {

        }
    },
    getNewPrivateTicket: async function () {
        try {
            const today = moment()
            data.notifications.period = today.format("DD MMMM YYYY")
            const ticketOpen = await Ticket.find({
                status: "open",
                createdDate: {
                    $gte: new Date(today.startOf("day").toISOString()),
                    $lt: new Date(today.endOf("day").toISOString())
                }
            }).countDocuments()
            data.notifications.private_ticket = ticketOpen
        } catch (error) {
            console.log(error)
        }
    },
    getNewPublicTicket: async function () {
        try {
            const today = moment()
            data.notifications.period = today.format("DD MMMM YYYY")
            const ticketOpen = await TicketPublic.find({
                status: "open",
                createdDate: {
                    $gte: new Date(today.startOf("day").toISOString()),
                    $lt: new Date(today.endOf("day").toISOString())
                }
            }).countDocuments()
            data.notifications.public_ticket = ticketOpen

        } catch (error) {
            console.log(error)
        }
    },
    getNewBillingPayment: async function () {
        try {
            const today = moment()
            data.notifications.period = today.format("DD MMMM YYYY")
            const billing = await Billing.find({
                paymentStatus: true,
                isPaid: false,
                updated_date: {
                    $gte: new Date(today.startOf("day").toISOString()),
                    $lt: new Date(today.endOf("day").toISOString())
                }
            }).countDocuments()
            data.notifications.billing = billing
        } catch (error) {
            console.log(error)
        }
    },
    getNewToken: async function () {
        try {
            const today = moment()
            data.notifications.period = today.format("DD MMMM YYYY")
            const token = await tok_trtoken.find({
                statusPayment: "in process",
                tglTransaksi: {
                    $gte: new Date(today.startOf("day").toISOString()),
                    $lt: new Date(today.endOf("day").toISOString())
                }
            }).countDocuments()
            data.notifications.token = token
        } catch (error) {
            console.log(error)
        }
    },
    getNewElectricity: async function () {
        try {
            const today = moment()
            data.notifications.period = today.format("DD MMMM YYYY")
            const electricity = await TransaksiPower.find({
                checker: false,
                cratedDate: {
                    $gte: new Date(today.startOf("day").toISOString()),
                    $lt: new Date(today.endOf("day").toISOString())
                }
            }).countDocuments()
            data.notifications.electricity = electricity
        } catch (error) {
            console.log(error)
        }
    },
    getNewWater: async function () {
        try {
            const today = moment()
            data.notifications.period = today.format("DD MMMM YYYY")
            const water = await TransaksiWater.find({
                checker: false,
                cratedDate: {
                    $gte: new Date(today.startOf("day").toISOString()),
                    $lt: new Date(today.endOf("day").toISOString())
                }
            }).countDocuments()
            data.notifications.water = water
        } catch (error) {
            console.log(error)
        }
    },
    getNewFacilityReservation: async function () {
        try {
            const today = moment()
            data.notifications.period = today.format("DD MMMM YYYY")
            const facility_reservation = await FacilityReservation.find({
                status: "open",
                cratedDate: {
                    $gte: new Date(today.startOf("day").toISOString()),
                    $lt: new Date(today.endOf("day").toISOString())
                }
            }).countDocuments()
            data.notifications.facility_reservation = facility_reservation
        } catch (error) {
            console.log(error)
        }
    },



}
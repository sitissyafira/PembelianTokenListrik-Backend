const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trToken = new Schema(
  {
    // ====transfer token main====
    idRate: {
      type: Schema.Types.ObjectId,
      ref: "Tok_Mas_Rate",
    },
    idCustomer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    idUnit: {
      type: Schema.Types.ObjectId,
      ref: "Unit",
    },
    cdTransaksi: {
      type: String,
    },
    order: {
      type: String,
      default: "top up listrik",
    },
    totalBiaya: {
      type: Number,
    },
    tglTransaksi: {
      type: Date,
      default: Date.now(),
    },
    tglTransfer: {
      type: Date,
      // default: Date.now(),
    },
    deadlinePayment: {
      type: Date,
    },
    idMtdPembayaran: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
    },
    mtdPembayaran: {
      type: String,
    },
    statusPayment: {
      type: String,
      default: "in process",
    },
    prgrTransaksi: {
      type: String,
      default: "in progress",
    },
    noToken: {
      type: String,
    },
    engineer: {
      type: String,
      default: null,
    },
    // ====transfer token main====
    // ====manual====
    bank_tf: {
      type: String,
    },
    account_no: {
      type: Number,
    },
    account_name: {
      type: String,
    },
    proof_of_payment: {
      type: String,
    },
    // ====manual====
    // ====edc====
    card_no: {
      type: Number,
    },
    name_card: {
      type: String,
    },
    // ====edc====
    // ====cash====
    // ====cash====
    // ====ipaymu====
    product: {
      type: [String],
    },
    qty: {
      type: [String],
    },
    // price: {
    //   type: [String],
    // },
    description: {
      type: [String],
    },
    buyerName: {
      type: String,
    },
    buyerEmail: {
      type: String,
    },
    buyerPhone: {
      type: String,
    },
    // taxId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Tax",
    //   default: "61b87c086c423e43205343e3",
    // },
    // ====ipaymu====
  },
  { collection: "tok_trtoken" }
);

const tok_trtoken = mongoose.model("tok_trtoken", trToken);
module.exports = { tok_trtoken, trToken };

const {newRequestChecker} = require("../finance/functionHelper")
const {
  getDefaultValue,
  generateManyBodyIndex,
} = require("../logHistory/accountHistory/index/service");
const AccountHistoryService = require("../logHistory/accountHistory/service");
const { AccountHistory } = require("../logHistory/accountHistory/model");
const { AccountHistoryIndex } = require("../logHistory/accountHistory/index/model");
const { AccountReceive } = require("../finance/ar/model");
const Acct = require("../masterData/COA/account/model").Acct;
const { tok_trtoken } = require("./model");
const { tok_mrate } = require("../masterData/tokenRate/model");
const DebNote = require("../journal/debitnote/model").DebNote;

exports.updateToAcctHistoryIndex = async (data) => {
    const request = newRequestChecker(data, "voucherno", "depositTo", "debit");
    await AccountHistoryService.generateNewAccHistory(data, request, "Account Receivable");
};

// delete account history & account history index
exports.findManyBodyIndex = async (data) => {
  for (let i = 0; i < data.length; i++) {
    const defaultParent = await getDefaultValue();

    const findAcc = await Acct.findById(data[i].account);
    const parentId = findAcc.parent ? findAcc.parent : findAcc._id;
    const parentIndex = defaultParent.findIndex((parent) => String(parent.account) === String(parentId));

    const period = data[i].createdDate.getFullYear() * 100 + data[i].createdDate.getMonth() +  1;
    const dataAHI = await AccountHistoryIndex.findOne({period}).lean()

    // Decrement total at parent
    dataAHI.parents[parentIndex].totalDebit -= data[i].total
    dataAHI.parents[parentIndex].totalCredit -= Math.abs(data[i].total)
    dataAHI.parents[parentIndex].periodBalance -= data[i].total

    // Delete child filter by data._id
    let result = dataAHI.childs.filter((childItem)=> String(childItem.transaction[0]) != data[i]._id )
    dataAHI.childs = result

    // update account history index
    await AccountHistoryIndex.findOneAndUpdate({ period }, {...dataAHI})
  }
};

exports.findAllToken = async (condition, select, populate) => {
  const data = await tok_trtoken.find(condition).select(select).populate(populate).lean()

  return data
}

exports.getOneTokenRate = async (condition, select, populate) => {
  const data = await tok_mrate.findOne(condition).select(select).populate(populate).lean()

  return data
}

exports.findALLAcctReceive = async (condition, select, populate) => {
  const data = await AccountReceive.find(condition).select(select).populate(populate).lean()

  return data
}

exports.getOneAcctReceive = async (condition, select, populate) => {
  const data = await AccountReceive.findOne(condition).select(select).populate(populate).lean()

  return data
}

exports.findAllDebitNote = async (condition, select, populate) => {
  const data = await DebNote.find(condition).select(select).populate(populate).lean()

  return data
}

exports.getOneDebitNote = async (condition, select, populate) => {
  const data = await DebNote.findOne(condition).select(select).populate(populate).lean()

  return data
}
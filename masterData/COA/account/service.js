const { Acct } = require("./model");

const AccountHistoryService = require("../../../logHistory/accountHistory/service");

module.exports = {
  async getAll() {
    return await Acct.find().sort({ actype: 1, acctNo: 1, depth: 1 }).lean();
  },

  async getById(id) {
    return await Acct.findById(id);
  },

  async getChildsByParent(parentId, parentNumber) {
    // return await Acct.find({
    //     _id: { $nin: [ parentId ] },
    //     acctNo: { $regex: String(parentNumber), $options: "i" },
    // }).sort({ actype: 1, acctNo: 1 }).lean();
    return await Acct.find({ parent: parentId }).sort({ actype: 1, acctNo: 1 }).lean();
  },

  async getParentByCategory(category) {
    return await Acct.find({ AccCat: category, depth: 0, isChild: false }).sort({ actype: 1, acctNo: 1 }).lean();
  },

  async includeCategoryParent(category) {
    let query = Acct.find({ AccCat: { $in: category }, depth: 0 })
      .sort({ actype: 1, acctNo: 1, depth: 1 })
      .lean();
    query = query.populate({
      path: "AccType",
      model: "Acctype",
      select: "-__v",
    });

    let data = await query;

    return data;
  },

  async excludeCategoryParent(category) {
    let query = Acct.find({ AccCat: { $nin: category }, depth: 0 })
      .sort({ actype: 1, acctNo: 1, depth: 1 })
      .lean();
    query = query.populate({
      path: "AccType",
      model: "Acctype",
      select: "-__v",
    });

    let data = await query;

    return data;
  },

  async getAllParent() {
    return await Acct.find({ depth: 0 }).sort({ actype: 1, acctNo: 1 }).lean();
  },

  async getAllChild() {
    return await Acct.find({ depth: { $gt: 0 } })
      .sort({ actype: 1, acctNo: 1 })
      .lean();
  },

  async getByAccNo(acctNo) {
    return await Acct.findOne({ acctNo: acctNo }, { _id: 1 }).lean();
  },

  async bulkWrite(body, session) {
    return await Acct.bulkWrite(body, { session });
  },

  getBulkBalance(request) {
    try {
      let bulkAccount = [];

      const newData = request.account.accNew;
      const deletedData = request.account.accDeleted;
      const oldData = request.account.accOld;

      for (let n = 0; n < newData.length; n++) {
        const updateBalance = newData[n].isDebit ? newData[n].amount : -Math.abs(newData[n].amount);
        bulkAccount.push({
          updateOne: {
            filter: { _id: newData[n].acc },
            update: { $inc: { balance: updateBalance } },
          },
        });
      }

      for (let d = 0; d < deletedData.length; d++) {
        const updateBalance = deletedData[d].isDebit ? -deletedData[d].amount : deletedData[d].amount;
        bulkAccount.push({
          updateOne: {
            filter: { _id: deletedData[d].acc },
            update: { $inc: { balance: updateBalance } },
          },
        });
      }

      for (let o = 0; o < oldData.length; o++) {
        const updateBalance = oldData[o].old.isDebit
          ? oldData[o].new.isDebit
            ? oldData[o].new.amount - oldData[o].old.amount
            : -(oldData[o].old.amount + oldData[o].new.amount)
          : oldData[o].new.isDebit
          ? oldData[o].new.amount + oldData[o].old.amount
          : -(oldData[o].new.amount - oldData[o].old.amount);

        bulkAccount.push({
          updateOne: {
            filter: { _id: oldData[o].old.acc },
            update: { $inc: { balance: updateBalance } },
          },
        });
      }

      //bulkAccount.map(el => { console.log(el.updateOne) });

      return { success: true, message: "Success", data: bulkAccount };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Failed collecting data for update COA", data: null };
    }
  },

  async updateBalance(request, session) {
    try {
      const bulkAccount = this.getBulkBalance(request);
      if (!bulkAccount.success) return { success: bulkAccount.success, message: bulkAccount.message, data: null };

      const result = await this.bulkWrite(bulkAccount.data);
      if (!result) return { success: false, message: "Failed to update balance COA", data: null };

      return { success: true, message: "Success", data: result };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to update balance COA", data: null };
    }
  },

  async updateCategoryChecker(category, request) {
    let newAcc = [];
    let deletedAcc = [];

    const oldAcc = await this.getParentByCategory(category);
    const old = oldAcc.map((o) => {
      return o._id;
    });

    request.forEach((req) => {
      let match = false;
      old.forEach((old) => {
        if (String(req) === String(old)) match = true;
      });
      if (!match) newAcc.push(req);
    });

    old.forEach((old) => {
      let match = false;
      request.forEach((req) => {
        if (String(old) === String(req)) match = true;
      });
      if (!match) deletedAcc.push(old);
    });

    return { newAcc, deletedAcc };
  },

  checkFieldAdd(acc, category) {
    let update;
    if (!acc.AccCat) {
      update = {
        AccCat: category,
      };
    } else {
      update = {
        $push: {
          AccCat: category,
        },
      };
    }

    return update;
  },

  childValidation(parent, child) {
    const parentNumber = parent.acctNo;

    const childNumber = child.acctNo;
    const childNumberArr = childNumber.split(".");

    if (String(parentNumber) === String(childNumberArr[0])) {
      return true;
    } else {
      return false;
    }
  },

  async bodyUpdateCategory(category, newAcc, deletedAcc) {
    try {
      let bulkCategory = [];

      let newId = [];
      for (let i = 0; i < newAcc.length; i++) {
        const parent = await this.getById(newAcc[i]);
        if (parent) {
          if (parent.depth == 0) {
            const filter = { _id: newAcc[i] };
            const update = this.checkFieldAdd(parent, category);
            if (!newId.includes(String(newAcc[i]))) {
              bulkCategory.push({ updateOne: { filter: filter, update: update } });
              newId.push(String(newAcc[i]));
            }

            const childs = await this.getChildsByParent(parent._id, parent.acctNo);
            for (let j = 0; j < childs.length; j++) {
              if (this.childValidation(parent, childs[j])) {
                const filter = { _id: childs[j]._id };
                const update = this.checkFieldAdd(childs[j], category);
                if (!newId.includes(String(childs[j]._id))) {
                  bulkCategory.push({ updateOne: { filter: filter, update: update } });
                  newId.push(String(childs[j]._id));
                }
              }
            }
          }
        }
      }

      let deletedId = [];
      for (let k = 0; k < deletedAcc.length; k++) {
        const parent = await this.getById(deletedAcc[k]);
        if (parent) {
          if (parent.depth == 0) {
            const filter = { _id: deletedAcc[k] };
            const update = { $pull: { AccCat: category } };
            if (!deletedId.includes(String(deletedAcc[k]))) {
              bulkCategory.push({ updateOne: { filter: filter, update: update } });
              deletedId.push(String(deletedAcc[k]));
            }

            const childs = await this.getChildsByParent(parent._id, parent.acctNo);
            for (let l = 0; l < childs.length; l++) {
              if (this.childValidation(parent, childs[l])) {
                const filter = { _id: childs[l]._id };
                const update = { $pull: { AccCat: category } };
                if (!deletedId.includes(String(childs[l]._id))) {
                  bulkCategory.push({ updateOne: { filter: filter, update: update } });
                  deletedId.push(String(childs[l]._id));
                }
              }
            }
          }
        }
      }

      //bulkCategory.forEach(el => { console.log(el.updateOne) });

      return { success: true, message: "Success", data: bulkCategory };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to create body update category", data: null };
    }
  },

  async updateCategory(body, session) {
    try {
      const resultCheck = await this.updateCategoryChecker(body.category, body.account);
      const newAcc = resultCheck.newAcc;
      const deletedAcc = resultCheck.deletedAcc;

      const bodyUpdate = await this.bodyUpdateCategory(body.category, newAcc, deletedAcc);
      if (!bodyUpdate.success) return { success: false, message: bodyUpdate.message, data: null };

      const update = await this.bulkWrite(bodyUpdate.data, session);
      if (!update) return { success: false, message: "Failed to update category", data: null };

      return { success: true, message: "Success", data: update };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to update category", data: null };
    }
  },

  async bodyUpdateManyDetails() {
    try {
      let bulkDetails = [];

      const parentOnly = await this.getAllParent();

      for (let i = 0; i < parentOnly.length; i++) {
        const code = parentOnly[i].acctNo;
        const codeArr = code.split(".");
        if (codeArr.length > 1) {
          const bigParent = await this.getByAccNo(codeArr[0]);
          if (bigParent) {
            const filter = { _id: parentOnly[i]._id };
            const update = { depth: 1, parent: bigParent._id, isChild: true, openingBalance: 0 };
            bulkDetails.push({ updateOne: { filter: filter, update: update } });
          }
        } else {
          const filter = { _id: parentOnly[i]._id };
          const update = { depth: 0, isChild: false, openingBalance: 0 };
          bulkDetails.push({ updateOne: { filter: filter, update: update } });
        }
      }

      const childOnly = await this.getAllChild();

      for (let i = 0; i < childOnly.length; i++) {
        const code = childOnly[i].acctNo;
        const codeArr = code.split(".");
        if (codeArr.length < 2) {
          const filter = { _id: childOnly[i]._id };
          const update = { depth: 0, isChild: false, openingBalance: 0 };
          bulkDetails.push({ updateOne: { filter: filter, update: update } });
        } else {
          const bigParent = await this.getByAccNo(codeArr[0]);
          if (bigParent) {
            const filter = { _id: childOnly[i]._id };
            const update = { parent: bigParent._id, isChild: true, openingBalance: 0 };
            bulkDetails.push({ updateOne: { filter: filter, update: update } });
          }
        }
      }

      return { success: true, message: "Success", data: bulkDetails };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to generate body for update many details COA", data: null };
    }
  },

  async updateManyDetails(session) {
    try {
      const body = await this.bodyUpdateManyDetails();
      if (!body.success) return { success: body.success, message: body.message, data: null };

      const update = await this.bulkWrite(body.data, session);
      if (!update) return { success: false, message: "Failed to update many details COA", data: null };

      return { success: true, message: "Success", data: update };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to update many details COA", data: null };
    }
  },

  async parentValidation(parent) {
    const parentNumber = parent.acctNo;
    const parentNumberArr = parentNumber.split(".");

    if (parentNumberArr.length > 1) {
      return false;
    } else {
      return true;
    }
  },

  async bodyUpdateManyBalance() {
    try {
      let bulkBalance = [];

      const account = await this.getAll();
      const history = await AccountHistoryService.getAll();

      for (let i = 0; i < account.length; i++) {
        const filter = { _id: account[i]._id };
        let balance = account[i].openingBalance;
        //if(balance === undefined) console.log(account[i]);

        for (let j = 0; j < history.length; j++) {
          if (String(account[i]._id) === String(history[j].account._id)) {
            balance += history[j].total;
          }
        }

        const update = { balance: balance };

        //console.log(balance);

        bulkBalance.push({ updateOne: { filter: filter, update: update } });
      }

      return { success: true, message: "Success", data: bulkBalance };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to generate body for update many balance COA", data: null };
    }
  },

  async updateManyBalance(session) {
    try {
      const body = await this.bodyUpdateManyBalance();
      if (!body.success) return { success: body.success, message: body.message, data: null };

      const update = await this.bulkWrite(body.data, session);
      if (!update) return { success: false, message: "Failed to update many balance COA", data: null };

      return { success: true, message: "Success", data: update };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to update many balance COA", data: null };
    }
  },

  async bodyUpdateParentBalance() {
    try {
      let bulkBalance = [];

      const parents = await this.getAllParent();

      for (let i = 0; i < parents.length; i++) {
        let balance = 0;
        if (this.parentValidation(parents[i])) {
          const filter = { _id: parents[i]._id };

          const childs = await this.getChildsByParent(parents[i]._id, parents[i].acctNo);
          let trueChilds = 0;

          for (let j = 0; j < childs.length; j++) {
            if (this.childValidation(parents[i], childs[j])) {
              trueChilds += 1;
              balance += childs[j].balance;
            } else {
              continue;
            }
          }

          if (trueChilds == 0) {
            balance = parents[i].balance;
          }

          const update = { balance: balance };

          bulkBalance.push({ updateOne: { filter: filter, update: update } });
        } else {
          continue;
        }
      }

      return { success: true, message: "Success", data: bulkBalance };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to generate body for update parent balance", data: null };
    }
  },

  async updateParentBalance(session) {
    try {
      const body = await this.bodyUpdateParentBalance();
      if (!body.success) return { success: body.success, message: body.message, data: null };

      const update = await this.bulkWrite(body.data, session);
      if (!update) return { success: false, message: "Failed to update parent balance", data: null };

      return { success: true, message: "Success", data: update };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to update parent balance", data: null };
    }
  },

  async fixingDataParent() {
    try {
      const dataAccts = await Acct.find({ parent: { $exists: false }, isChild: true }).sort({ _id: -1 });
      // await Acct.findOneAndUpdate({_id: "61d58bd55e13d53a0cdadde3"}, {isChild: false}) /** #COMMENT from QT, DIfferent case in QS */
      // await Acct.findOneAndUpdate({_id: "61d58bd55e13d53a0cdadbbf"}, {isChild: true}) /** #COMMENT from QT, DIfferent case in QS */
      for (let dataAcc of dataAccts) {
        let acct = await Acct.findOne({ acctNo: { $regex: `${dataAcc.acctNo.split(".")[0]}`, $options: "i" }, isChild: false });
        if (acct) {
          await Acct.findOneAndUpdate({ _id: dataAcc._id }, { parent: acct._id });
        } else {
          await Acct.findOneAndUpdate({ _id: dataAcc._id }, { parent: "6288f69431d177255658b167" });
        }
      }

      return { success: true, message: "Success", data: dataAccts };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to update parent balance", data: null };
    }
  },

  async addOpeningBalance() {
    try {
      const dataAccts = await Acct.updateMany({ openingBalance: 0 });

      return { success: true, message: "Success", data: dataAccts };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to update parent balance", data: null };
    }
  },

  // async fixCOA(session) {
  //     try {
  //         const updateDetails = await this.updateManyDetails(session);
  //         if(!updateDetails.success) return { success: false, message: updateDetails.message, data: null };

  //         const updateBalance = await this.updateManyBalance(session);
  //         if(!updateBalance.success) return { success: false, message: updateBalance.message, data: null };

  //         const allCOA = await this.getAll();

  //         return { success: true, message: "Success", data: allCOA };
  //     } catch (error) {
  //         console.log(error);
  //         return { success: false, message: "Internal server error: Failed to fix COA", data: null };
  //     }
  // }
  async headerCOA() {
    try {
      const dataAccts = await Acct.find({ isChild: false }, { acctNo: 1, acctName: 1 }).lean();

      return { success: true, message: "Success", data: dataAccts };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal server error: Failed to update parent balance", data: null };
    }
  },
};

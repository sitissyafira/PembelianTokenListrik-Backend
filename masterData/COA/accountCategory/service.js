const { AccountCategory } = require("./model");

module.exports = {
  async getAll() {
    return await AccountCategory.find();
  },

  async createOne(body) {
    return await AccountCategory.create(body);
  },

  async checkACName(name) {
    return await AccountCategory.findOne({
      name: { $regex: `${name}`, $options: "i" },
    });
  },

  async deleteAcctCat(id) {
    return await AccountCategory.findOneAndDelete({ _id: id });
  },
};

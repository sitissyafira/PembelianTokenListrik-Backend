/**
 *
 * Category database services
 */

const Category = require("./model").Category;

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

module.exports = {
  listCategoryMobile: async function (query, page = 1, limit = 1000) {
    try {
      const skip = (page - 1) * limit;
      const category = await Category.find(query).skip(skip).limit(limit).sort({ $natural: 1 });
      if (category) {
        return category;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  listCategory: async function (query, page = 1, limit = 1000) {
    try {
      const skip = (page - 1) * limit;
      let category;
      if (Object.keys(query).length === 0) {
        category = await Category.find(query).skip(skip).limit(limit).sort({ $natural: 1 });
      } else {
        category = await Category.find()
          .or([
            {
              name: { $regex: `${query.name}` },
            },
          ])
          .skip(skip)
          .limit(limit)
          .sort({ $natural: 1 });
      }
      if (category) {
        return category;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  lstCategoryById: async function (id) {
    try {
      const category = await Category.findById(id);
      if (category) {
        return category;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  addCategory: async function (cat) {
    try {
      const category = await new Category(cat).save();
      if (category) {
        return category;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  editCategory: async function (id, cat) {
    try {
      const category = await Category.findByIdAndUpdate(id, cat);
      if (category) {
        return category;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },

  deleteCategory: async function (id) {
    try {
      const category = await Category.findByIdAndRemove(id);
      if (category) {
        return category;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  },
  GenerateCategoryCode: async function (val) {
    try {
      const categoryCount = await Category.countDocuments();
      const newNumber = pad(categoryCount + 1, 5);
      var code = "CT-ID" + "-" + newNumber;

      return code;
    } catch (e) {
      console.log(e);
    }
  },
};

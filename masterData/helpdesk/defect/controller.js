const {
  listDefect,
  lstDefectById,
  addDefect,
  editDefect,
  deleteDefect,
  GenerateDefectCode,
  findDefectByParent,
  listCategory,
  lstCategoryById,
} = require("./service");

module.exports = {
  Defect: async function (req, res, next) {
    try {
      const str = JSON.parse(req.query.param);
      const allData = await listDefect({}, 1, 0);

      let query = {};
      if (str.filter !== null) query = { defect_name: str.filter.defect_name };
      const defect = await listDefect(query, str.pageNumber, str.limit);
      if (defect) {
        return res
          .status(200)
          .json({
            status: "success",
            data: defect,
            totalCount: allData.length,
          });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  listCategory: async function (req, res, next) {
    try {
      const list = await listCategory(
        req.params.filter,
        req.params.page,
        req.params.limit
      );
      if (list) {
        return res.status(200).json({ status: "success", data: list });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  DefectById: async function (req, res, next) {
    try {
      const list = await lstDefectById(req.params.id);
      if (list) {
        return res.status(200).json({ status: "success", data: list });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  CategoryById: async function (req, res, next) {
    try {
      const list = await lstCategoryById(req.params.id);
      if (list) {
        return res.status(200).json({ status: "success", data: list });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  DefectByParent: async function (req, res, next) {
    try {
      const list = await findDefectByParent(req.params.id);
      if (list) {
        return res.status(200).json({ status: "success", data: list });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  tambahDefect: async function (req, res, next) {
    try {
      const addDef = await addDefect(req.body);
      if (addDef) {
        return res.status(200).json({ status: "success", data: addDef });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  updateDefect: async function (req, res, next) {
    try {
      const updateDef = await editDefect(req.params.id, req.body);
      if (updateDef) {
        return res
          .status(200)
          .json({ status: "success", data: "update success!" });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  hapusDefect: async function (req, res, next) {
    try {
      const hapusDef = await deleteDefect(req.params.id);
      if (hapusDef) {
        return res
          .status(200)
          .json({ status: "success", data: "Delete Success!" });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", data: e });
    }
  },
  DefectGenerator: async function (req, res, next) {
    try {
      const number = await GenerateDefectCode(req.params.id);
      if (number) {
        res.status(200).json({ status: "success", data: number });
      } else {
        res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      res.status(500).json({ status: "error", data: e });
    }
  },
};

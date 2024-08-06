const mUser = require("./model").mUser;
const Sequence = require("../../models/sequence");
const services = require("../../services/handlerFactory");
const errorHandler = require("../../controllers/errorController");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const excel = require("exceljs");
const readXlsxFile = require("read-excel-file/node");
const dateFormat = require("dateformat");
const LogFinance = require("../../logHistory/logFinance/model");

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

exports.generateUserId = async (req, res, next) => {
  try {
    const dates = new Date();
    const month = ("0" + (dates.getMonth() + 1)).slice(-1);
    const date = ("0" + dates.getDate()).slice(-2);
    const year = dates.getFullYear().toString().substr(-2);

    const sequences = await Sequence.find({
      menu: "userMaster",
      year: dates.getFullYear(),
    });

    console.log(sequences);

    const newNumber = pad(sequences[0].sequence, 3);
    const code = date + month + year + "-" + newNumber;
    const updateSequence = await Sequence.findByIdAndUpdate(
      { _id: sequences[0]._id },
      { sequence: sequences[0].sequence + 1 }
    );

    //   return code;

    res.status(200).json({
      status: "success",
      data: code,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

// exports.create = servicesFactory.createOne(mUser);
exports.getById = servicesFactory.getOne(mUser);
// exports.update = servicesFactory.updateOne(mUser);
exports.delete = servicesFactory.deleteOne(mUser);

exports.create = async (req, res, next) => {
  try {
    const dates = new Date();
    const create = await mUser.create(req.body);

    if (create) {
      const updateLog = await LogFinance({
        menu: "userMaster",
        data: create,
        year: date.getFullYear(),
      }).save();
      res.status(200).json({
        status: "success",
        data: create,
        totalCount: create.length,
      });
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const skip = (req.query.pageNumber - 1) * req.query.limit;
    let data;

    if (req.query.search === undefined || req.query.search === null || req.query.search === "") {
      data = await mUser
        .find({ isDelete: false })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    } else {
      data = await mUser
        .find({ username: { $regex: req.query.search } })
        .skip(skip)
        .limit(parseInt(req.query.limit))
        .sort({ $natural: 1 });
    }
    res.status(200).json({
      status: "success",
      totalCount: data.length,
      data,
    });
  } catch (error) {
    console.log(error);
    return errorHandler(error);
  }
};

exports.deleteFlag = async (req, res, next) => {
  try {
    const update = { isDelete: true };
    const delFlag = await mUser.findByIdAndUpdate(req.params.id, update);
    res.status(200).json({
      status: "Delete Success!",
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(date.getHours() + 7);
    req.body.updateDate = date;

    const update = await mUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (update) {
      const updateLog = await LogFinance({
        menu: "userMaster",
        data: update,
        year: date.getFullYear(),
      }).save();
    }

    res.status(200).json({
      status: "success, data has been update",
      data: update,
    });
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

exports.DownloadFormatXlxs = async (req, res, next) => {
  let workbook = new excel.Workbook();
  workbook.created = new Date();
  workbook.modified = new Date();
  let worksheet = workbook.addWorksheet("user master");
  worksheet.columns = [
    { header: "User ID", key: "user_id" },
    { header: "NIP", key: "nip" },
    { header: "Full Name", key: "full_name" },
    { header: "Username", key: "username" },
    { header: "Gender", key: "gender" },
    { header: "Email", key: "email" },
    { header: "Phone", key: "phone" },
    { header: "Role", key: "role" },
    { header: "Department", key: "department" },
    { header: "Division", key: "division" },
  ];
  const data = await mUser
    .find({ isDelete: false })
    .populate("role", "-__v")
    .populate("department", "-__v")
    .populate("division", "-__v");
  data.forEach((e) => {
    console.log(e);
    const row = {
      id: e._id,
      user_id: e.user_id,
      nip: e.nip,
      full_name: e.full_name,
      username: e.username,
      gender: e.gender,
      email: e.email,
      phone: e.phone,
      role: e.role.role,
      department: e.department.department_name,
      division: e.division.division_name,
    };
    worksheet.addRow(row);
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.setHeader("Content-Disposition", "attachment; filename=" + "user_master.xlsx");
  return workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  });
};

exports.UploadFormatXlxs = async (req, res, next) => {
  try {
    let addData;
    const file = req.file;
    console.log(file);
    if (file === undefined) {
      res.status(400).json({
        status: "Failed",
        message: "Please upload an xlsx file",
      });
    } else {
      const filePath = file.path;
      let createdBy = req.query.created_by;
      readXlsxFile(filePath).then((rows) => {
        if (rows.length <= 1) {
          res.status(400).json({
            status: "Failed",
            message: "Data is empty",
          });
        } else {
          rows.forEach(async (element, index) => {
            if (index > 0) {
              var project = await mUser
                .find()
                .populate("role", "-__v")
                .populate("department", "-__v")
                .populate("division", "-__v");
              console.log(project);
              const dataTax = {
                user_id: element[0],
                nip: element[1],
                full_name: element[2],
                username: element[3],
                gender: element[4],
                email: element[5],
                phone: element[6],
                role: project[0].role,
                department: project[0].department,
                division: project[0].division,
                created_by: createdBy,
              };
              addData = await mUser.create(dataTax);
            } else {
              return;
            }
          });

          res.status(200).json({
            status: "import success!",
          });
        }
      });
    }
  } catch (error) {
    console.error(error);
    return errorHandler(error);
  }
};

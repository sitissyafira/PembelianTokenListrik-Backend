const errorHandler = require("../../controllers/errorController");
const catchAsync = require("../../utils/catchAsync");
const excel = require("exceljs");
const readXlsxFile = require("read-excel-file/node");
const { ExternalUser } = require("./model")
const jwt = require("jsonwebtoken");
const { secret } = require("../../config");
const {
    listExternalUser
} = require("./service")

const sharp = require("sharp");
const multer = require('multer');

const storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image/PDF! Please upload only images/PDF.", 400), false);
  }
};

exports.uploadAttachment = multer({
  storage: storage,
  fileFilter: filter,
}).fields([
  { name: "attachment", maxCount: 1 },
]);

exports.saveAttachment = async (req, res, next) => {
  try{
    if(!req.files) return next();

    req.files?.attachment?.map(async (file, index) => {

      const filename = `${Date.now()}_${file.originalname}`
      req.body.attachment = `${req.protocol}://${req.headers.host}/upload/externalUser/${filename}`
      await sharp(file.buffer)
        .toFormat("jpeg")
        .jpeg({
          quality: 50
        })
        .resize(480, 480)
        .toFile(`upload/externalUser/${filename}`)
    })

    next()
  }
  catch(e){
    console.log(e)
    return errorHandler(e)
  }
}

exports.create = async (req, res, next) => {
    try{
        
        //decode jwt
        const decode = jwt.verify(req.headers.authorization.split(" ")[1], secret);

        //set decode.id to req.body
        req.body.created_by = decode.id

        //create user internal

        const create = await ExternalUser.create(req.body)

        return res.status(200).json({
            status: "success",
            data: create
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: "failed",
            msg: e
        })
    }
};

exports.updateById = async (req, res, next) => {
    try{
        
        //decode jwt
        const decode = jwt.verify(req.headers.authorization.split(" ")[1], secret);

        //create user internal

        const updated = await ExternalUser.findByIdAndUpdate(req.params.id, req.body)

        return res.status(200).json({
            status: "success",
            data: updated
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: "failed",
            msg: e
        })
    }
};

exports.deleteById = async (req, res, next) => {
    try{
        const updated = await ExternalUser.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            status: "success",
            data: updated
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: "failed",
            msg: e
        })
    }
};

exports.getById = async (req, res, next) => {
    try{
        const user = await ExternalUser.findById(req.params.id).populate("department division shift")

        return res.status(200).json({
            status: "success",
            data: user
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({
            status: "failed",
            msg: e
        })
    }
};

exports.externalUserList = async function (req, res, next) {
    try {
      const str = JSON.parse(req.query.param);
      let query = {};
      if (str.filter !== null) query = { name: str.filter.name };
      const allData = await listExternalUser(query, 1, 0);
      const externalUser = await listExternalUser(query, str.pageNumber, str.limit);
      if (externalUser) {
        return res.status(200).json({
          status: "success",
          data: externalUser,
          totalCount: allData.length,
        });
      } else {
        return res
          .status(500)
          .json({ status: "error", data: "internal server error" });
      }
    } catch (e) {
      console.log(e);
    }
  }
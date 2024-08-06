const errorHandler = require("../../controllers/errorController");
const catchAsync = require("../../utils/catchAsync");
const excel = require("exceljs");
const readXlsxFile = require("read-excel-file/node");
const { LocationBuilding } = require("./model")
const jwt = require("jsonwebtoken");
const { secret } = require("../../config");
const fetch = require("node-fetch");
const {
    listLocationBuilding
} = require("./service")

exports.create = async (req, res, next) => {
    try{
        
        //decode jwt
        const decode = jwt.verify(req.headers.authorization.split(" ")[1], secret);

        //set decode.id to req.body
        req.body.created_by = decode.id

        //create user internal

        const create = await LocationBuilding.create(req.body)

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

exports.locationBuildingList = async function (req, res, next) {
    try {
      let {search, pageNumber, limit} = req.query
      const allData = await listLocationBuilding({}, 1, 0);
      let query = {};
      if (search) query = { name: search };
      const internalUser = await listLocationBuilding(query, parseInt(pageNumber), parseInt(limit));
      if (internalUser) {
        return res.status(200).json({
          status: "success",
          data: internalUser,
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

exports.getLocationSuggestionFromOpenStreetMap = async function (req, res, next) {
    try{
      let value = req.query.search
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1`;

      const fetchData = await fetch(
        `${url}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      const response = await fetchData.json();

      return res.status(200).json({
        status: "success",
        data: response
      })
    }

    catch(e){
      console.log(e)
      return res.status(500).json({
        status: 'failed',
        msg: "Internal Server Error"
      })
    }
}

exports.getListByMobile = async function (req, res, next) {
  try {
    const allData = await listLocationBuilding({}, 1, 0);

    return res.status(200).json({
      status: "success",
      data: allData,
    });
  
  } catch (e) {
    console.log(e);
  }
}

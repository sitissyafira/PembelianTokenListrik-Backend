const { Currency } = require("./model");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const errorHandler = require("../../controllers/errorController");
const excel = require("exceljs");
const readXlsxFile = require('read-excel-file/node');

exports.create = servicesFactory.createOne(Currency);
exports.GetById = servicesFactory.getOne(Currency);
exports.update = servicesFactory.updateOne(Currency);
exports.delete = servicesFactory.deleteOne(Currency);

/**
 * @param { pageNumber: number, limit: number, search: string  }
 * @description Search param, will search list by tax_name.
 */
exports.GetAll = catchAsync(async (req, res, next) => {
  const skip = (req.query.pageNumber - 1) * req.query.limit;
  let data;
  let allData;
  if (
    req.query.search === undefined ||
    req.query.search === null ||
    req.query.search === ""
  ) {
      const filter = { isDelete: false }
        data = await Currency.find(filter)
            .skip(skip)
            .limit(parseInt(req.query.limit));

        allData = await Currency.find(filter)
    } else {
        const filterSearch = { isDelete: false, currency: { $regex: req.query.search }}
        data = await Currency.find(filterSearch)
            .skip(skip)
            .limit(parseInt(req.query.limit))

        allData = await Currency.find(filterSearch)
    }
    res.status(200).json({
        status: "success",
        data: data,
        totalCount: allData.length
    });
});

exports.DeleteFlag = async (req, res, next) => {
    try {
        const filter = { _id: req.params.id };
        const update = { isDelete: true };
        const deleteData = await Currency.findByIdAndUpdate(filter, update)
        if(deleteData){
            res.status(200).json({
                status: "delete flag success!",
              });
        }
    } catch (error) {
      console.error(error);
      return errorHandler(error);
    }
  };

  exports.DownloadFormatXlxs = async (req, res, next)=>{
    let workbook = new excel.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    let worksheet = workbook.addWorksheet('currency master');
    worksheet.columns = [
        {header: "uniqueid", key:"id", hidden: true},
        {header: 'Currency', key: 'currency'},
        {header: 'Region', key: 'region'},
        {header: 'Value', key: 'value'},
        {header: 'Status', key: 'isDelete'},

    ];
    const data = await Currency.find();
    data.forEach(e => {
        const row = {
            id: e._id,
            currency: e.currency,
            region: e.region, 
            value: e.value, 
            isDelete : e.isDelete ? "Deleted" : "Active"
        };
        worksheet.addRow(row);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "currency_master.xlsx");
    return workbook.xlsx.write(res)
        .then(function() {
            res.status(200).end();
        });
},

/**
 * @param { created_by: Object ID }
 * @description Created by params for validation.
 */
    exports.UploadFormatXlxs = async (req, res, next)=>{
        try {
            let addData;
            const file = req.file;
            if(file === undefined){
                res.status(400).json({
                    status: "Failed",
                    message: "Please upload an xlsx file"
                  });
            }else{
                const filePath = file.path;
                let createdBy = req.body.created_by;
                readXlsxFile(filePath).then((rows) => {
                    if(rows.length <= 1){
                        res.status(400).json({
                            status: "Failed",
                            message: "Data is empty"
                          });
                    }else{
                        rows.forEach(async(element, index) => {
                            if(index > 0){

                                if (typeof element[0] !== 'object')
                                {
                                    var check = await Currency.findOne({
                                        _id: element[0].replace(/"+/ig, '')
                                    });
                                    if (check) {
                                        if (
                                            element[0] == check._id &&
                                            element[1] == check.currency &&
                                            element[2] == check.region &&
                                            element[3] == check.value
                                        ) {} else {
                                            update = await Currency.findByIdAndUpdate({
                                                _id: element[0].replace(/"+/ig, '')
                                            }, {
                                                currency: element[1],
                                                region: element[2],
                                                value: element[3],
                                                created_by : createdBy
                                            });
                                        }
                                    }
                                }else{
                                    const dataCurrency = {
                                        currency: element[1],
                                        region: element[2],
                                        value: element[3],
                                        created_by: createdBy
                                    }
                                    addData = await Currency.create(dataCurrency);
                                }
                            }
                        });
                        res.status(200).json({
                            status: "import success!",
                            msg: "Berhasil"
                        });
                    }
                })
            }
        } catch (error) {
            console.error(error);
            return errorHandler(error);
        }
    }
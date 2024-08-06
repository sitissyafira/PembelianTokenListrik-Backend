const { Tax } = require("./model");
const servicesFactory = require("../../services/handlerFactory");
const catchAsync = require("../../utils/catchAsync");
const errorHandler = require("../../controllers/errorController");
const excel = require("exceljs");
const readXlsxFile = require('read-excel-file/node');
const dateFormat = require("dateformat");

// exports.create = servicesFactory.createOne(Tax); /** This controller old (not dinamis) */

/**
 * This controller Dinamis
 * create one condition if active can only be one
 */
exports.create = catchAsync(async (req, res, next)=>{

    if(!req.body.ipadd) req.body.ipadd = req.ip;
  
    const date = new Date();
    date.setHours(date.getHours() +7);
    req.body.createdDate = date;
    req.body.created_by = req.user._id
  
    const doc = await Tax.create(req.body);

    if(doc.isActive){
        await Tax.updateMany({_id: { $nin: doc._id } }, { isActive: false })
    }
  
    res.status(201).json({
      status : 'success',
      data: doc
    });
});

exports.GetById = servicesFactory.getOne(Tax);
// exports.update = servicesFactory.updateOne(Tax); /** This controller old (not dinamis) */

/**
 * This controller edit dinamis
 * update one condition if active can only be one
 */
exports.update = catchAsync(async (req, res, next) => {
    const date = new Date();
    date.setHours(date.getHours() +7);
    req.body.updateDate = date;
    
    const doc = await Tax.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if(!doc){
        return next(new AppError('No document found with that ID', 404));
    }
    
    if(doc.isActive){
        await Tax.updateMany({_id: { $nin: req.params.id } }, { isActive: false })
    }

    res.status(200).json({
      status: 'success',
      data : doc
    });
});

exports.delete = servicesFactory.deleteOne(Tax);

/**
 * @param { page: number, limit: number, search: string  }
 * @description Search param, will search list by tax_name.
 * This get all can get isActive: true and false
 */
exports.GetAll = catchAsync(async (req, res, next) => {
    const skip = (req.query.page - 1) * req.query.limit;
  
    let filter_active = false;
  
    let filter = { isDelete: false }
    if (req.query.search) {
  
      filter.tax_name = { $regex: req.query.search };
  
    } else if (req.query?.active === "true") {
      filter_active = true
      filter.isActive = true;
  
    }
  
    let data = await Tax.find(filter)
              .skip(skip)
              .limit(parseInt(req.query.limit))
  
    let allData = await Tax.find(filter);
  
    data = filter_active ? data[0] : data 
    
    res.status(200).json({
      status: "success",
      data: data,
      totalCount: allData.length,
    });
});

exports.DeleteFlag = async (req, res, next) => {
    try {
        const filter = { _id: req.params.id };
        const update = { isDelete: true };
        const deleteData = await Tax.findByIdAndUpdate(filter, update)
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
    let worksheet = workbook.addWorksheet('tax master');
    worksheet.columns = [
        {header: 'Tax Code', key: 'tax_code'},
        {header: 'Name', key: 'tax_name'},
        {header: 'Nominal', key: 'nominal'},
        {header: 'Remarks', key: 'remarks'}
    ];
    const data = await Tax.find({ isDelete: false });
    data.forEach(e => {
        const row = {
            id: e._id,
            tax_code: e.tax_code,
            tax_name: e.tax_name, 
            nominal: e.nominal, 
            remarks: e.remarks
        };
        worksheet.addRow(row);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "tax_master.xlsx");
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
            console.log(file);
            if(file === undefined){
                res.status(400).json({
                    status: "Failed",
                    message: "Please upload an xlsx file"
                  });
            }else{
                const filePath = file.path;
                let createdBy = req.query.created_by;
                readXlsxFile(filePath).then((rows) => {
                    if(rows.length <= 1){
                        res.status(400).json({
                            status: "Failed",
                            message: "Data is empty"
                          });
                    }else{
                        rows.forEach(async(element, index) => {
                            if(index > 0){
                                const dataTax = {
                                    tax_code: element[0],
                                    tax_name: element[1],
                                    nominal: element[2],
                                    remarks: element[3],
                                    created_by: createdBy
                                }
                                 addData = await Tax.create(dataTax);
                            }else{
                                return
                            }
                        });
                        res.status(200).json({
                            status: "import success!",
                          });
                    }
                })
            }
        } catch (error) {
            console.error(error);
            return errorHandler(error);
        }
        
    }

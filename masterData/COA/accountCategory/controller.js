const { AccountCategory } = require("./model");

const AccountCategoryService = require("./service");
const AccountService = require("../account/service");

const ObjectId = require("mongoose").Types.ObjectId;

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

module.exports = {
    async createOne(req, res) {
        try {
            let { name, ...payload } = req.body
            req.body.createdDate = new Date();

            name = titleCase(name)

            let checkACName = await AccountCategoryService.checkACName(name)
            if (checkACName) return res.status(200).json({ status: "error", data: "Account category name has been registered" });

            const result = await AccountCategoryService.createOne({ name, payload });
            if (!result) return res.status(400).json({ status: "error", data: "Failed to create Account Category" });

            return res.status(200).json({ status: "success", data: result });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: "error", data: "Internal server error: Failed to create Account Category" });
        }
    },

    async getAll(req, res) {
        try {
            const host = `${req.protocol}://${req.headers.host}`;

            let search = req.query.search ? JSON.parse(req.query.search) : false;
            let page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            const withRef = req.query.refer === "true" ? true : false;
            let links = [];

            const PL = ["Operational Income", "Other Operational Income", "Operational Expenditure", "Non Operational Income/Expense", "Depreciation", "Company Taxes"];
            const BS = [
                "Cash on Hand and in Bank",
                "Account Receivable",
                "Prepaid Expense",
                "Inventories",
                "Cost",
                "Accumulated Depreciation",
                "Account Payable",
                "Taxes Payable",
                "Accrued Expenses",
                "Advance Payment",
                "Deffered Income",
                "Others Payable",
                "Deposits",
                "Sinking Fund Deposit",
                "Share Holder Equities",
            ];
            const filterType = { $in: req.query.type === "bs" ? BS : PL }

            // Data Filtering
            const Crit = { isDelete: false, name: filterType };
            if (search) {
                Object.keys(search).map(async (i) => {
                    if (Array.isArray(search[i])) {
                        Crit[i] = { $in: search[i] };
                    } else {
                        const sanitizedText = ["true", "false"].includes(search[i])
                            ? search[i] === "true" ? true : false
                            : search[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                        if (withRef) Crit[i] = sanitizedText;
                        else {
                            if (ObjectId.isValid(sanitizedText) || typeof sanitizedText === "boolean") Crit[i] = sanitizedText;
                            else Crit[i] = { $regex: sanitizedText, $options: "i" };
                        }
                    }
                });
            }

            const skip = (page - 1) * limit;
            let query = AccountCategory.find(Crit).skip(skip).limit(limit).sort({ $natural: -1 });
            let all = AccountCategory.find(Crit).countDocuments();

            let data = await query;
            const ccount = await all;
            const total = ccount / limit;

            const dataString = JSON.stringify(data);
            const dataObject = JSON.parse(dataString);

            data = dataObject.map((value) => ({
                ...value,
                links: [
                    {
                        name: "update",
                        method: "PATCH",
                        href: `${host}${req.baseUrl}/${value._id}`,
                    },
                    {
                        name: "deleteflag",
                        method: "DELETE",
                        href: `${host}${req.baseUrl}/deleteflag/${value._id}`,
                    },
                ],
            }));

            if (page < Math.ceil(total)) {
                const nextPage = {
                    name: "next",
                    method: "GET",
                    href: `${host}${req.baseUrl}?page=${page + 1}&limit=${limit}`,
                };
                links.push(nextPage);
            }
            if (page > 1) {
                const previousPage = {
                    name: "previous",
                    method: "GET",
                    href: `${host}${req.baseUrl}?page=${page - 1}&limit=${limit}`,
                };
                links.push(previousPage);
            }

            res.status(200).json({
                status: "success",
                totalCount: ccount,
                links,
                data: data,
            });
        } catch (error) {
            console.error(error);
            return errorHandler(error, req, res);
        }
    },

    async getOne(req, res) {
        try {
            const host = `${req.protocol}://${req.headers.host}`;
            let links = [
                { name: "update", method: "PATCH", href: `${host}${req.originalUrl}` },
                {
                    name: "deleteflag",
                    method: "DELETE",
                    href: `${host}${req.baseUrl}/deleteflag/${req.params.id}`,
                },
            ];

            let query = AccountCategory.findOne({ _id: req.params.id, isDelete: false });
            let doc = await query;

            if (!doc) {
                return next(
                    errorHandler({ statusCode: 400, isOperational: true, message: "No document found with that ID" }, req, res)
                );
            }

            const dataString = JSON.stringify(doc);
            const dataObject = JSON.parse(dataString);

            const includeCategory = await AccountService.includeCategoryParent([req.params.id]);
            const excludeCategory = await AccountService.excludeCategoryParent([req.params.id]);

            doc = {
                ...dataObject,
                includeCategory,
                excludeCategory,
            };

            res.status(200).json({
                status: "success",
                links,
                data: doc,
            });
        } catch (error) {
            console.error(error);
            return errorHandler(error, req, res);
        }
    },

    async deleteAcctCat(req, res) {
        try {
            await AccountCategoryService.deleteAcctCat(req.params.id)

            return res.status(200).json({ status: "success", data: result });
        } catch (error) {
            console.error(error);
            return errorHandler(error, req, res);
        }
    }
}
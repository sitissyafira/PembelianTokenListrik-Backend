/**
 *
 * Configuration for application
 *
 * @param
 */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  dbUrl: process.env.DATABASE_URL_LOCAL,
  secret: process.env.SECRET,
  port: process.env.PORT,
  image: process.env.IMAGEPBM,
};

/*
IP BE: 122.248.202.143
IP FE: 18.139.62.104

Port: 
Demo: 3000
Bres Live: 3001
QA: 3002
QC: 3003
Gym: 3500
Medina: 4001
EPA: 5001
CER: 6001
CPA: 7001
Evinciio: 8001
GPK: 3010
PBM: 3020

*/

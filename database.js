const mongoose = require("mongoose");
const { dbUrl } = require("./config");

function connect() {
  mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;

  db.on("error", (error) => console.log(error));
  db.once("open", async () => {
    console.log("DB Connected");
  });

  return db;
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };

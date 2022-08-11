const mongoose = require("mongoose");

const url = "mongodb+srv://tanmaygoyal:tanmaygoyal@cluster0.aiomrop.mongodb.net/?retryWrites=true&w=majority"

const options = {
  sslValidate: true,
  dbName: "neurolingua",
  useUnifiedTopology: true,
};

mongoose.connect(url, options);
const connection = mongoose.connection;

connection.on("error", (err) => {
  console.error.bind(console, "Database connection error");
  connection.close();
});

connection.once("connected", () => {
  console.log("Database connected successfully");
});

module.exports.db = connection;

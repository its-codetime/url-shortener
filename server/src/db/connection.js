const mongoose = require("mongoose");

// connect to mongodb
const dbConnect = () => {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  });

  mongoose.connection.once("open", () => {
    console.log("connected to mongoose");
  });
};

module.exports = dbConnect;

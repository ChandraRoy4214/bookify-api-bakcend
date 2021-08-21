const mongoose = require("mongoose");

const connectDB = async () => {

const  conn = await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useFindAndModify: false,
    useCreateIndex : true
});

    console.log(`DATABASE CONNECTED ${conn.connection.host}`.blue.bold.underline);

}

module.exports = connectDB;
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser")

const app = express();

// loading env variables
dotenv.config({path : "./config/.env"});

// connecting to DATABASE
connectDB();

// import route files here
const books = require("./routes/books");
const users = require("./routes/users");
const authors = require("./routes/authors");
const auth = require("./routes/auth");
const reviews = require("./routes/reviews")


// Body parser
app.use(express.json());

// parsing cookie data
app.use(cookieParser())


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file upload image
app.use(fileUpload())

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());


// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());


// Mount route files
app.use("/api/v1/books", books);
app.use("/api/v1/users", users);
app.use("/api/v1/authors", authors);
app.use("/api/v1/auth", auth);
app.use("/api/v1/reviews", reviews);



app.use(errorHandler)


// ==================================================

app.get("/", (req, res) => {
      return  res.send("BOOOKIFY API HOME PAGE")
});


const server = app.listen(process.env.PORT, () => {
      console.log(`Server is running on the port ${process.env.PORT}`.yellow.bold.underline);
});


// handle unhandeled promise rejection
process.on("unhandledRejection", (err, promise) => {
    console.log(`ERROR OCCURED: ${err.message}`);
    server.close(process.exit(1));
});
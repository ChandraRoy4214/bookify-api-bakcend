const ErrorResponse = require("../utils/errorResponse");

const ErrorHandler = (err, req, res, next) => {
    let error = {...err}
    error.message = err.message

    if(err.name === "CastError"){
        message = "Resource Not Found"
        error = new ErrorResponse(404, message)
    }

    if(err.code = 11000){
        const message = err.message;
        error = new ErrorResponse(400, message);
    }

    if(err.name === "ValidationError"){
        message = Object.values(err.errors).map((val) => val.message)
        error = new ErrorResponse(400, message);
    }

    res.status(error.statusCode || 500).json({
        success : false,
        error : error.message || "server error"
    })
};


module.exports = ErrorHandler;
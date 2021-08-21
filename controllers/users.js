// ======================================================================
// this is the controller file for CRUD operation on USERS for ADMIN
// ======================================================================
const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/User")


// @desc    get all users for admin
// Route    GET  /api/v1/auth/users
// access   PRIVATE / ADMIN
exports.getAllUsers = asyncWrapper(async (req, res, next) => {
    const users = await User.find({});
    const count = users.length
    res.status(200).json({
        count,
        success : true,
        data : users
    })
});


// @desc    get single user with id
// Route    GET  /api/v1//auth/users/:id
// access   PRIVATE / ADMIN
exports.getSingleUser = asyncWrapper(async (req, res, next) => {
    const id = req.params.id
    const user = await User.findById(id);
        if(!user){
        return res.status(404).json({ success : true, data : "sorry! user not found!"})
        }
    res.status(200).json({ sucess : true, data : user})
});


// @desc    create single user
// Route    POST  /api/v1/auth/users
// access   PRIVATE / ADMIN
exports.createUser = asyncWrapper(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(200).json({
        success : true, 
        data: user,
    })
});


// @desc    update single user with id
// Route    PUT  /api/v1/auth/users/:id
// access   PRIVATE / ADMIN
exports.updateUser = asyncWrapper(async (req, res, next) => {
    const id = req.params.id
    const user = await User.findByIdAndUpdate(id, req.body, {new : true, runValidators : true});
        if(!user){
            return res.status(404).json({ success : true, data : "sorry! user not found!"})
        }
    res.status(200).json({ success : true, data : user});
});


// @desc    delete single user with id
// Route    DELETE  /api/v1/auth/users/:id
// access   PRIVATE / ADMIN
exports.deleteUser = asyncWrapper(async(req, res, next) => {
    const id = req.params.id
    const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({ success : true, data : "sorry! user not found!"})
        }
    res.status(200).json({ success : true, data : {}})
})
// ======================================================================
// this is the controller file for CRUD operation on AUTHORS
// ======================================================================
const asyncWrapper = require("../middleware/asyncWrapper");
const Author = require("../models/Author");
const User = require("../models/User")


// @desc    get all authors
// Route    GET  /api/v1/authors
// access   PUBLIC
exports.getAllAuthors = asyncWrapper(async (req, res, next) => {
    const authors = await Author.find({});
    const count = authors.length
    res.status(200).json({
        count,
        success : true,
        data : authors
    })
});


// @desc    get single user with id
// Route    GET  /api/v1/users/:id
// access   PUBLIC
exports.getSingleAuthor = asyncWrapper(async (req, res, next) => {
    const id = req.params.id
    const author = await Author.findById(id);
        if(!author){
        return res.status(404).json({ success : true, data : "sorry! author not found!"})
        }
    res.status(200).json({ sucess : true, data : author})
});



// @desc    create single author
// Route    POST  /api/v1/authors/
// access   PRIVATE
exports.createAuthor = asyncWrapper(async (req, res, next) => {
    const author = await Author.create(req.body);
    const user = await User.create(req.body);

    res.status(200).json({
        success : true, 
        data: author,
    });
});


// @desc    update single author with id
// Route    PUT  /api/v1/authors/:id
// access   PRIVATE
exports.updateAuthor = asyncWrapper(async (req, res, next) => {
    const id = req.params.id

    const author = await Author.findByIdAndUpdate(id, req.body, {new : true, runValidators : true});

    const user = await User.findByIdAndUpdate(id, req.body, {new : true, runValidators : true});
        
        if(!author){
            return res.status(404).json({ success : true, data : "sorry! author not found!"})
          }

    res.status(200).json({ success : true, data : author});
});


// @desc    delete single author with id
// Route    DELETE  /api/v1/authors/:id
// access   PRIVATE
exports.deleteAuthor = asyncWrapper(async(req, res, next) => {
    const id = req.params.id

    const author = await Author.findByIdAndDelete(id);
    const user = await User.findByIdAndDelete(id);

        if(!author){
            return res.status(404).json({ success : true, data : "sorry! author not found!"})
        }
        
    res.status(200).json({ success : true, data :{}})
});

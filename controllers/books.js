// ======================================================================
// this is the controller file for CRUD operation for BOOKS
// ======================================================================
const Book = require("../models/Book");
const asyncWrapper = require("../middleware/asyncWrapper");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path")


// @desc      Get all books
// @route     GET /api/v1/books
// @access    Public 
exports.getAllBooks = asyncWrapper(async (req, res, next) => {
    const books = await Book.find({});
    const count = books.length
    res.status(200).json({
        count,
        success : true,
        data : books
    })
});


// @desc      Get single book
// @route     GET /api/v1/books/:id
// @access    Public 
exports.getSingleBook = asyncWrapper(async (req, res, next) => {
    const id = req.params.id
    const book = await Book.findById(id);
        if(!book){
        return res.status(404).json({ success : true, data : "sorry! book not found!"})
        }
    res.status(200).json({ sucess : true, data : book})
})


// @desc      create a books
// @route     POST /api/v1/books
// @access    Private 
exports.createBook = asyncWrapper(async (req, res, next) => {
    // Add authorId to req.body ==== book data
    req.body.authorId = req.user.id;
    req.body.author = req.user.name;

    const publishedBook = await Book.findOne({authorId : req.user.id});
    
    if(publishedBook && req.user.role !== "admin"){
        return next(new ErrorResponse(400, `user with ID ${req.user.id} has already published a Book! We can add only one book per user.`))
    }

    const book = await Book.create(req.body);
    
    res.status(200).json({
        success : true, 
        data: book,
    });
})


// @desc      update a books
// @route     PUT /api/v1/books/:id
// @access    Private 
exports.updateBook = asyncWrapper(async (req, res, next) => {
    const id = req.params.id
    let book = await Book.findById(id);

    if(!book){
        return res.status(404).json({ success : true, data : "sorry! Book not found!"})
      }
    
    if(book.authorId.toString() !== req.user.id && req.user.role !== "admin"){
          return next(new ErrorResponse(401, `user with this ID ${req.user.id} is not authorized to update this Book!`))
      }

    book = await Book.findByIdAndUpdate(id, req.body, {new : true, runValidators : true});

    res.status(200).json({ success : true, data : book});
})
// @desc      delete a books
// @route     DELETE /api/v1/books/:id
// @access    Private 
exports.deleteBook = asyncWrapper(async(req, res, next) => {
    const id = req.params.id
    const book = await Book.findById(id);

    if(!book){
        return res.status(404).json({ success : true, data : "sorry! book not found!"})
      }

    if(book.authorId.toString() !== req.user.id && req.user.role !== "admin"){
       return next(new ErrorResponse(401, `user with ID ${req.user.id} is not authorized to delete this book`))
    }
    book.remove();

    res.status(200).json({ success : true, data : {}})
})



// @desc      Get all books of single author
// @route     GET /api/v1/books/authors/:id
// @access    Public 
exports.getAllBooksofAuthor = asyncWrapper(async (req, res, next) => {
    const books = await Book.find({authorId : req.params.id});

    res.status(200).json({
        count : books.length,
        success : true,
        data : books
    });
});


// @desc      Get all purchased books of single user
// @route     GET /api/v1/books/users/:id
// @access    PRIVATE 
exports.getAllBooksofUser = asyncWrapper(async (req, res, next) => {
    const books = await Book.find({users : req.params.id});

    res.status(200).json({
        count: books.length,
        success : true,
        data : books
    })
});


// @desc      Upload photo for book
// @route     PUT /api/v1/books/:id/photo
// @access    Private
exports.bookPhotoUpload = asyncWrapper(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(
      new ErrorResponse(404, `Book not found with id of ${req.params.id}`)
    );
  }

  // Make sure user is book owner
  if (book.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(401, 
        `User ${req.user.id} is not authorized to update this book`
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(400, `Please upload a file`));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(400, `Please upload an image file`));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(400, 
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} Bytes`
      )
    );
  }

  // Create custom filename
  file.name = `photo_${book._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(500, `Problem with file upload`));
    }

    await Book.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
// ======================================================================
// this is the controller file for CRUD operation on REVIEWS
// ======================================================================

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncWrapper');
const Review = require('../models/Review');
const Book = require('../models/Book');



// @desc      Get all reviews
// @route     GET /api/v1/reviews
// @access    Public 
exports.getAllReviews = asyncHandler(async (req, res, next) => {

    const reviews = await Review.find({});
    const count = reviews.length;
    res.status(200).json({
        count,
        success : true,
        data : reviews
    })
});



// @desc      Get reviews of a single book
// @route     GET /api/v1/books/:bookId/reviews
// @access    Public
exports.getAllReviewsOfSingleBook = asyncHandler(async (req, res, next) => {

  if (req.params.bookId) {
    const reviews = await Review.find({ book: req.params.bookId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res);
  }
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {

  const review = await Review.findById(req.params.id).populate({
    path: 'book',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorResponse(404, `No review found with the id of ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc      Add review
// @route     POST /api/v1/books/:bookId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {

  req.body.book = req.params.bookId;
  req.body.user = req.user.id;


  const book = await Book.findById(req.params.bookId);

  if (!book) {
    return next(
      new ErrorResponse(404, 
        `No book with the id of ${req.params.bookId}`
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(404, `No review with the id of ${req.params.id}`)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(401, `Not authorized to update this review`));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  review.save();

  res.status(200).json({
    success: true,
    data: review,
    msg : "review updated successfully!"
  });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(404, `No review with the id of ${req.params.id}`)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(401, `Not authorized to delete this review`));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
    msg : "review deleted successfully!"
  });
});
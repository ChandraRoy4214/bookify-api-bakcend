const express = require('express');
const {
        getAllReviewsOfSingleBook,
        getAllReviews,
        getReview,
        addReview,
        updateReview,
        deleteReview
} = require('../controllers/reviews');


const router = express.Router({mergeParams : true});

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getAllReviews)
  .post(protect, authorize('user', 'admin'), addReview);


router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

router.get("/books/:bookId", getAllReviewsOfSingleBook)


module.exports = router;
const express = require("express");
const router = express.Router({mergeParams : true});
const { getAllBooks,
        getSingleBook,
        createBook,
        updateBook,
        deleteBook,
        getAllBooksofAuthor,
        getAllBooksofUser,
        bookPhotoUpload
    } = require("../controllers/books");

const reviewRouter = require("./reviews")

const {protect, authorize} = require("../middleware/auth");

// re-route into other resource route
router.use('/:bookId/reviews', reviewRouter);

router.route("/")
        .get(getAllBooks)
        .post(protect, authorize("admin", "publisher"), createBook);


router.route("/:id")
      .get(getSingleBook)
      .delete(protect,authorize("admin","publisher"),  deleteBook)
      .put( protect, authorize("admin","publisher"), updateBook);
      
router.put("/:id/photo", protect, authorize("admin","publisher"), bookPhotoUpload);



router.get("/authors/:id", protect, getAllBooksofAuthor);
router.get("/users/:id", protect, authorize("user", "publisher"), getAllBooksofUser);


module.exports = router;

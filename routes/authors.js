const express = require("express");
const router = express.Router();

const { getAllAuthors,
        getSingleAuthor,
        createAuthor,
        updateAuthor,
        deleteAuthor} = require("../controllers/authors");

const {protect, authorize} = require("../middleware/auth");

router.route("/").get(getAllAuthors).post(createAuthor);

router.route("/:id").get(getSingleAuthor).put(protect, authorize("author","admin"), updateAuthor).delete(protect, authorize("author","admin"), deleteAuthor);




module.exports = router;


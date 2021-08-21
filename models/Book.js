const mongoose = require("mongoose");
const Slugify = require("slugify");
const BookSchema = new mongoose.Schema({
    name: {
    type: String,
    unique : true,
    trim: true,
    required: [true, 'Please add a course title']
    },
// 2
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
// 3
    totalPages : Number,

// 4
    author : {
        type : String,
        required: [true, "let customers know who the author is?"]
    },
    
      authorId : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "Author"
  },

    price : {
        type : Number,
        required : [true, "please enter the proce"]
    },

    publishedBy : String,
    
    slug :String ,
    
    genre: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
          'Biography',
          "comic",
          "finance",
          "History",
          "spirutual",
          'self-help',
          'sports',
          "others"
      ]
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10']
    },

});

// creating a slug (the unique identifying part of a web address) for doc

BookSchema.pre("save", function(next){
    this.slug = Slugify(this.name, {lowercase : true});
    next();
})

module.exports = mongoose.model("Book", BookSchema);
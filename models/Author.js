const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, "please add your name"]
    },

    description : {
        type : String,
        required : [true, "please add some data about the author"]
    },

     email: {
        type: String,
        unique: true
  },
  
  website : String,
  
//   image : {
//       type : Boolean,
//       default : String
//   },

  age : Number,
  role : {
    type : String,
    default : "author"
  },

  books : {
    type : [String],
    required : true
  },

  genre : {
      type : [String],
      required : true,
      enum : [
          'Biography',
          "comic",
          "startups",
          "History",
          "spirutual",
          'self-help',
          'sports',
          "science",
          "others"
        ]
  }
});



// Reverse populate with virtuals

// AuthorSchema.virtual('books', {
//   ref: 'Book',
//   localField: '_id',
// });





module.exports = mongoose.model("Author", AuthorSchema);

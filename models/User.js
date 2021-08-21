const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    // 1 ==== name
    name : {
        type : String,
        required : [true, "Please add a name"],
    },

    // 2 ==== email
     email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },

// 3 ==== password
   password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  
  // 4 ==== role
  role : {
      type : String,
      enum : ["publisher", "user", "author", "admin"],
      default : "user"
  },
  // 5 ==== bought previously
  purchaseList : {
    type : Array,
  },

   // 7 ==== resetPasswordToken and expiry
    resetPasswordToken : String,
    resetPasswordTokenExpire : Date ,

  // 6 ==== created At
  createdAt : {
      type : Date,
      default : Date.now
  },
});


// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================
// lot to do here
// ==========================


// Generated reset passwordToken,
UserSchema.methods.getResetPasswordToken = function() {
  // Generate Reset Token
  const resetToken = crypto.randomBytes(16).toString('hex');

  // storing the hashed version of reset token in db field
  this.resetPasswordToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');

  this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
}



// 2. Generate email Confirm Token
// 3. 

module.exports = mongoose.model("User", UserSchema);

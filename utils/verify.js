// why my code is showing errors while brads is not


// @desc      forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({email : req.body.email});

    if(!user){
      return next(new ErrorResponse(404, `User with ${req.body.email} does not exists`))
    }

    const resetToken = user.getResetPasswordToken();

     await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;

    console.log(resetURL);
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;

  try {
        await sendEmail({
          email: user.email,
          subject: 'Password reset token',
          message,
        });

    res.status(200).json({ success: true, data: 'Email sent' });
    
  } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;

        await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse(500, 'Email could not be sent'));
  }

    res.status(200).json({success : true, data : user})

});

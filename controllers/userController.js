import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import nodemailer from 'nodemailer';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(res, user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, birthday, profilePicture } = req.body;
  console.log(profilePicture)
  // console.log(req.body);
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ 
      success: false,
      message: 'User already exists',
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    birthday,
    profilePicture
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(res, user._id),
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user data',      
    });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  //console.log("getUserProfile",req.params.id)
  const user = await User.findById(req.params.id);
  // console.log(user)
  if (user) {
    res.json({
      _id: user._id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      birthday: user.birthday,
      bio: user.bio,
      profilePicture: user.profilePicture,

    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { id, firstName, bio, lastName, birthday, profilePicture } = req.body;
  console.log(req.body)
  try {
    const user = await User.findByIdAndUpdate(id, {
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      bio: bio,
      profilePicture: profilePicture,
    }, { new: true });
    console.log(user)
    res.status(200).json({
      _id: user._id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      birthday: user.birthday,
      bio: user.bio,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(404);
    throw new Error('User not found');
  }
});


const updateUserProfileNotification = asyncHandler(async (req, res) => {
  const { _id, notificationtoken, currentLatitude, currentLongitude } = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id, {
      notificationtoken: notificationtoken,
      currentLatitude: currentLatitude,
      currentLongitude: currentLongitude,
    }, { new: true });
    console.log(user)
    res.status(200).json({
      _id: user._id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      birthday: user.birthday,
      bio: user.bio,
      profilePicture: user.profilePicture,
      notificationtoken: user.notificationtoken,
      currentLatitude: user.currentLatitude,
      currentLongitude: user.currentLongitude,
    });
  } catch (error) {
    res.status(404);
    throw new Error('User not found');
  }
});


async function mailer(recieveremail, code) {
  // console.log("Mailer function called");

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.NodeMailer_email, // generated ethereal user
      pass: process.env.NodeMailer_password, // generated ethereal password
    },
  });


  let info = await transporter.sendMail({
    from: "GeekChat",
    to: `${recieveremail}`,
    subject: "Email Verification",
    text: `Your Verification Code is ${code}`,
    html: `<b>Your Verification Code is ${code}</b>`,
  })

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const codes = {};

const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
 // console.log(email);
  try {
    const user = await User.findOne({ email }); // Add await here
  //  console.log(user);
    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000);
       mailer(email, code);
      codes[email] = code;
      res.status(200).json({
        success: true,
        message: "Code sent successfully",
        code: code,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: "Entered email is not registered",
    });
  }
});

const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  console.log(email, code);
  try {
    if (codes[email] == code) {
      res.status(200).json({
        message: "Code Verified",
      });
    }
    else {
      res.status(404);
      throw new Error('Code not verified');
    }
  }
  catch (error) {
    res.status(404);
    throw new Error('User not found');
  }
});


const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  console.log(email, newPassword);
  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
    
    // Check if the user exists
    if (user) {
      // Set the new password and save the user
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password Reset",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
    });
  }
});

export default resetPassword;




export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  sendVerificationCode,
  verifyCode,
  resetPassword,
  updateUserProfileNotification
};







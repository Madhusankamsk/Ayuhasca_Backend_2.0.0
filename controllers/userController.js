import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("login email: ", email);

  const user = await User.findOne({ email });

  if (!user) {
    res.status(500).json({
      success: false,
      message: "This email is not signed up",
    });
  }
  console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", generateToken(res, user._id));

  console.log("user: ", user._id);
  if (user.isgoogle) {
    res.status(500).json({
      success: false,
      message: "This email is signed up with Google signin",
    });
  } else {
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(res, user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
});

const checkGoogleAuth = async (req, res) => {
  try {
    const { email } = req.body; // Extract email from the request body
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      res.status(404).json({
        success: true,
        message: "User not found or not authenticated with Google",
      });
    } else if (user.isgoogle) {
      // If user is authenticated with Google
      //  console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",generateToken(res,user._id))

      res.json({
        _id: user._id,
        token: generateToken(res, user._id), // Assuming generateToken only needs user's ID
      });
    } else {
      // If user exists but is not authenticated with Google
      res.status(400).json({
        success: false,
        message: "This email is signed up with another method.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    birthday,
    profilePicture,
    isgoogle,
  } = req.body;
  console.log(req.body);
  // console.log(req.body);
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    birthday,
    profilePicture,
    isgoogle,
    isAddFakeEvent: false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(res, user._id),
    });
    // console.log(res)
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid user data",
    });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
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
      isAddFakeEvent: user.isAddFakeEvent,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { id, firstName, bio, lastName, birthday, profilePicture } = req.body;
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName: firstName,
        lastName: lastName,
        birthday: birthday,
        bio: bio,
        profilePicture: profilePicture,
      },
      { new: true }
    );
    console.log(user);
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
    throw new Error("User not found");
  }
});

const updateUserProfileNotification = asyncHandler(async (req, res) => {
  const { _id, notificationtoken, currentLatitude, currentLongitude } =
    req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        notificationtoken: notificationtoken,
        currentLatitude: currentLatitude,
        currentLongitude: currentLongitude,
      },
      { new: true }
    );
    console.log(user);
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
    throw new Error("User not found");
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
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const codes = {};

const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const user = await User.findOne({ email }); // Add await here
    // console.log(user);
    if (user) {
      if (user.isgoogle) {
        res.status(409).json({
          success: false,
          message: "This email is signed up with Google signin",
        });
      } else {
        const code = Math.floor(100000 + Math.random() * 900000);
        await mailer(email, code); // await here to ensure the email is sent before proceeding
        codes[email] = code;
        res.status(200).json({
          success: true,
          message: "Code sent successfully",
          code: code,
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the verification code",
    });
  }
});

// const sendVerificationCode = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//  // console.log(email);
//   try {
//     const user = await User.findOne({ email }); // Add await here
//   //  console.log(user);
//     if (user) {
//       const code = Math.floor(100000 + Math.random() * 900000);
//        mailer(email, code);
//       codes[email] = code;
//       res.status(200).json({
//         success: true,
//         message: "Code sent successfully",
//         code: code,
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({
//       success: false,
//       message: "Entered email is not registered",
//     });
//   }
// });

const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  console.log(email, code);
  try {
    if (codes[email] == code) {
      res.status(200).json({
        message: "Code Verified",
      });
    } else {
      res.status(404);
      throw new Error("Code not verified");
    }
  } catch (error) {
    res.status(404);
    throw new Error("User not found");
  }
});

// const resetPassword = asyncHandler(async (req, res) => {
//   const { email, newPassword } = req.body;
//   console.log(email, newPassword);
//   try {
//     // Find the user by email
//     const user = await User.findOne({ email: email });

//     // Check if the user exists
//     if (user) {
//         // Set the new password and save the user
//       user.password = newPassword;
//       await user.save();

//       res.status(200).json({
//         success: true,
//         message: "Password Reset",
//       });
//       }
//       res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Password reset failed',
//     });
//   }
// });

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
      message: "Password reset failed",
    });
  }
});

const versionChecker = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Define all the parameters
  let showPopUp = false;
  const showCloseButton = true;
  const topLeftText = "Ayuhasca Message";
  const buttonText = "Click";   // do not enter "Retry" as button name
  const buttonColor = "#FFFFFF";
  const buttonTextColor = "#834EFF";
  const imageUrl = "https://firebasestorage.googleapis.com/v0/b/kuubi-c55eb.appspot.com/o/images%2F1707757602932.jpeg?alt=media&token=9ac5c2b4-5afe-435f-806e-90de95675dbd";
  const showEngageButton = true;
  const engageButtonLink = "https://play.google.com/store/apps/details?id=com.madhusanka.Kuubi&pcampaignid=web_share"
  const imageLink = "https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.atlassian.com%2Fsoftware%2Fjira%3Futm_source%3Dfacebook%26utm_medium%3Dpaid-social%26utm_campaign%3DP%253Ajira%257CO%253Appm%257CV%253Afacebook%257CF%253Aconsider%257CG%253Arow%26utm_content%3DP%253Ajira%257CO%253Appm%257CV%253Afacebook%257CF%253Aconsider%257CG%253Arow%257CL%253Aen%257CT%253Aretargeting%257CA%253Aalla%257CD%253Aalld%257CU%253Ahomepage_image-features-template-template-everyworkflow-pac-na-na-choose%26utm_campaignid%3D120209026284820764%26utm_adgroupid%3D120209026286610764%26utm_adid%3D120209026308940764%26utm_id%3D120209026284820764%26utm_term%3D120209026286610764%26fbclid%3DIwAR1QORQJvcR2l0xM_c8h7sgRcqhXmnCgel0uc_tiGMCpb405xswl60K1nd4_aem_AeezlMPFBlC0deJiM1eBlzgmCfmS40armOGyozpSxW36YrQ3Jq3J8KYEbf1ld1F_Ls0FlAGAFQdv0sKa6cYty1Lf&h=AT1I1nbV8KmFIm32Pz0FLLJHmUa-Tvn3sYA4TPwvvXUCypSsyLSJNgD486q0qEyFJEWfbBaBkUT4I8bnPNztB7C8wjEOHA0hVsmnnYnWvFJvH-E7BEHpcEe-l4V5cLGoNdmD6I_c6YEG1OnvlrnCPA&__tn__=*I&c[0]=AT26Z4tmGvLDzlBQp5t7t09RvGi6jqwaFax7y0M7mrD2DCaQ4GXcmTuH5lEGtWgD64k_s3vZrH4APETZWzk2kJx8Zuf35HU8ZMcp9D5Ou1hU9PrHIsDa1Z7-5k1RJ7edre3zG1c6lepBy8xKqHqwk9Z0AXt8D3gUPHHv4coarXkr1uKLct4mhiPkJN8pOOy_Ux07ymkVhhMLz1faFaF33MRvoA";
  const showVideo = false;
  const isYouTubeVideo = true;
  const videoSource = "https://scienceandfilm.org/uploads/videos/files/Sleep_Dealer_(trailer).mp4";
  const videoId = "Ae0vrbnAues";
  const playVideo = true;
  const isPortrait = false;

  try {
    if (process.env.CURRENT_VERSION_CODE != id) {
      showPopUp = true
      res.status(200).json({
        success: true,
        message: "Version code is matching",
        data: {
          showPopUp,
          showCloseButton,
          topLeftText,
          buttonText,
          buttonColor,
          buttonTextColor,
          imageUrl,
          showEngageButton,
          engageButtonLink,
          imageLink,
          showVideo,
          isYouTubeVideo,
          videoSource,
          videoId,
          playVideo,
          isPortrait,
        },
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Version code is not matching",
        data: {
          showPopUp,
          showCloseButton,
          topLeftText,
          buttonText,
          buttonColor,
          buttonTextColor,
          imageUrl,
          showEngageButton,
          engageButtonLink,
          imageLink,
          showVideo,
          isYouTubeVideo,
          videoSource,
          videoId,
          playVideo,
          isPortrait,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Version Verification is not complete",
    });
  }
});

const dataDelete = asyncHandler(async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isRequestDataDelete: true
      },
      { new: true }
    );
    console.log(user);
    res.status(202).json({
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
    throw new Error("User not found");
  }
});

const accountDelete = asyncHandler(async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isRequestAccountDelete: true
      },
      { new: true }
    );
    console.log(user);
    res.status(202).json({
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
    throw new Error("User not found");
  }
});


export {
  authUser,
  registerUser,
  logoutUser,
  versionChecker,
  getUserProfile,
  updateUserProfile,
  sendVerificationCode,
  verifyCode,
  resetPassword,
  updateUserProfileNotification,
  checkGoogleAuth,
  dataDelete,
  accountDelete
};

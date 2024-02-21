import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
   //   default: "",
      required: true,
    },
    lastName: {
      type: String,
    //  default: "",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio:{
      type: String,
      default: "",
    },
    profilePicture:{
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    notificationtoken: {
      type: String,
      default: "",
    },
    addedMoments:{
      type: [String],
      default: [],
    },
    interestedEvents:{
      type: [String],
      default: [],
    },
    goingEvents:{
      type: [String],
      default: [],
    },
    currentLatitude:{
      type: Number,
      default: 0,
    },
    currentLongitude:{
      type: Number,
      default: 0,
    },
    marks:{
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;

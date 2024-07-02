import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  sendVerificationCode,
  resetPassword,
  verifyCode,
  updateUserProfileNotification,
  versionChecker,
  checkGoogleAuth,
  accountDelete,
  dataDelete
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.put('/profile',updateUserProfile);
router.put('/profilenotify',updateUserProfileNotification);
router.get('/ownerprofile/:id',getUserProfile);
router.get('/versioncode/:id',versionChecker);
router.post('/verify',verifyCode);
router.post('/send',sendVerificationCode);
router.post('/reset',resetPassword);
router.post('/email',checkGoogleAuth);
  // .get(protect, getUserProfile)
  // .put(protect, updateUserProfile);

router.put('/accountdeleterequest',accountDelete); // New two request to the resolve play store issue
router.put('/deleterequest',dataDelete);

export default router;

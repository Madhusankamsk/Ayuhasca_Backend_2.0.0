import express from "express";
import { addMoment, getMoments,getEachMoment,goinglistController,feedbackController,editPostOfUser,deletePost,getPost,likeUpdate,disLikeUpdate,getMyMoments,deleteEvent,createPost,getPostFeed,getUserDetails,getWholePosts,interestedUpdate,goingUpdate,contribute,selectLeaderBoard,reactToPhoto,updateEvents,searchEvents,sendNotification} from "../controllers/eventController.js"; // Adjust the path

const router = express.Router();

// Define routes here
router.post("/add", addMoment);
router.post("/get/:id", getMoments);
router.post("/getdata", getEachMoment);
router.get("/getposts/:id", getPost);
router.post("/updatelike", likeUpdate);
router.post("/updatedislike", disLikeUpdate);
router.post("/getmymoments", getMyMoments);
router.delete("/delete/:id", deleteEvent);
router.post("/createpost", createPost);
router.get("/getpostfeed/:id", getPostFeed);
router.get("/getuser/:id", getUserDetails);
//router.post("/createcomment", createComment);
router.get("/getmyposts/:id", getWholePosts);
router.post("/interested", interestedUpdate);
router.post("/going", goingUpdate);
router.post("/contributes", contribute);
router.get("/leaderboard/:id", selectLeaderBoard);
router.post("/react", reactToPhoto);
router.put("/updateevents", updateEvents);
router.get("/search/:id", searchEvents)
router.post("/sendnotification", sendNotification);
router.delete("/deleteposts/:id", deletePost);
router.put("/editposts/:id", editPostOfUser);
router.post("/sendfeedback", feedbackController);
router.post("/goinglist", goinglistController);

export default router;

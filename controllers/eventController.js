import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import Post from "../models/postFeedModel.js";
import Comment from "../models/commentModel.js";
import { Expo } from "expo-server-sdk";
import Feedback from "../models/feedback.js"
import moment from 'moment-timezone';

//const colomboTime = moment.tz("Asia/Colombo").format('YYYY-MM-DD HH:mm:ss');

//console.log(colomboTime.slice(11, 16));
//console.log("date ", colomboTime.slice)



const addMoment = asyncHandler(async (req, res) => {

    const {
        privacy,
        eventname,
        category,
        date,
        time,
        endTime,
        duration,
        locationText,
        location,
        latitude,
        longitude,
        hostid,
        description,
        invitationLink,
        contactDetails,
        ticketBookingLink,
        entrancefee,
        features,
        ticketprice,
        gallery
    } = req.body;

    console.log(req.body);

    const token = req.header('Authorization').replace('Bearer ', '');
    // console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //  const newGallery = gallery.map(item => ({ photoUrl: item })); // Create gallery objects
        const userdetails = await User.findById(decoded.userId);
        // console.log(decoded);
        console.log(decoded.userId);
        // Create a new event using the Event model
        const newEvent = await Event.create({
            privacy,
            publisherId: decoded.userId,
            publisherName: userdetails.firstName + " " + userdetails.lastName,
            eventname,
            category,
            date,
            time,
            endTime,
            duration,
            locationText,
            location,
            latitude,
            longitude,
            hostid,
            invitationLink,
            description,
            contactDetails,
            ticketBookingLink,
            entrancefee,
            features,
            ticketprice,
            //   gallery: newGallery
            gallery
        });
        console.log(newEvent);
        const user = await User.findById(decoded.userId);
        if (user) {
            user.addedMoments.push(newEvent._id); // Assuming newEvent._id is the ObjectId of the newly created event
            await user.save();
        } else {
            console.log("User not found");
        }



        res.status(201).json({
            success: true,
            message: "Event added successfully",
            data: newEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event creation failed",
            error: error.message
        });
    }
});
// const getMoments = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { latitude,longitude,longitudeDelta,latitudeDelta } = req.body;
//     console.log(latitude,longitude,longitudeDelta,latitudeDelta);

//     try {
//         let events;

//         if (id) {
//             if (id == 0) {
//                 events = await Event.find({});
//             } else {
//                 events = await Event.find({ category: id });
//             }
//         } else {
//             events = await Event.find({});
//         }

//         res.status(200).json({
//             success: true,
//             message: "Events fetched successfully",
//             data: events
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Events fetching failed",
//             error: error.message
//         });
//     }
// });

// const getMoments = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { latitude, longitude, longitudeDelta, latitudeDelta,selectedDate,justNow } = req.body;
//     console.log("mmmmmmmmmmmmmmmmm",req.body)
//     try {
//         let events;

//         const minLatitude = latitude - latitudeDelta;
//         const maxLatitude = latitude + latitudeDelta;
//         const minLongitude = longitude - longitudeDelta;
//         const maxLongitude = longitude + longitudeDelta;

//         if (id) {
//             if (id === '0') {
//                 events = await Event.find({
//                     //when selected date is not null
//                     date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
//                     latitude: { $gte: minLatitude, $lte: maxLatitude },
//                     longitude: { $gte: minLongitude, $lte: maxLongitude },
//                 });
//                // console.log(events);
//             } else {
//                 events = await Event.find({
//                     category: id,
//                     //when selected date is not null
//                     date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
//                     latitude: { $gte: minLatitude, $lte: maxLatitude },
//                     longitude: { $gte: minLongitude, $lte: maxLongitude },
//                 });
//               //  console.log(events);
//             }
//         } else {
//             events = await Event.find({
//                 //when selected date is not null
//                 date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
//                 latitude: { $gte: minLatitude, $lte: maxLatitude },
//                 longitude: { $gte: minLongitude, $lte: maxLongitude },
//             });
//            // console.log(events);
//         }



//         for(let i=0;i<events.length;i++){
//             let event = events[i];
//             if(event.date == colomboTime.slice(0, 10)){
//                 event.isToday = true;
//                 console.log("D",event.eventname);
//                 if(event.time <= colomboTime.slice(11, 16) && event.endTime >= colomboTime.slice(11, 16)){
//                     event.isLive = true;
//                     console.log("T",event.eventname);
//                 }else{
//                     if(event.endTime < colomboTime.slice(11, 16)){
//                         //this event remove from the list
//                         console.log("F",event.eventname);
//                         events.splice(i,1);
//                     }
//                 }
//             }
//         }

//      //   console.log(events);

//         res.status(200).json({
//             success: true,
//             message: "Events fetched successfully",
//             data: events
//         });


//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Events fetching failed',
//             error: error.message,
//         });
//     }
// });



// const getMoments = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { latitude, longitude, longitudeDelta, latitudeDelta,selectedDate,justNow } = req.body;
//     console.log("mmmmmmmmmmmmmmmmm",req.body)
//     try {
//         let events;

//         const minLatitude = latitude - latitudeDelta;
//         const maxLatitude = latitude + latitudeDelta;
//         const minLongitude = longitude - longitudeDelta;
//         const maxLongitude = longitude + longitudeDelta;

//         if (id) {
//             if (id === '0') {
//                 events = await Event.find({
//                     //when selected date is not null
//                     date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
//                     latitude: { $gte: minLatitude, $lte: maxLatitude },
//                     longitude: { $gte: minLongitude, $lte: maxLongitude },
//                 });
//                // console.log(events);
//             } else {
//                 events = await Event.find({
//                     category: id,
//                     //when selected date is not null
//                     date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
//                     latitude: { $gte: minLatitude, $lte: maxLatitude },
//                     longitude: { $gte: minLongitude, $lte: maxLongitude },
//                 });
//               //  console.log(events);
//             }
//         } else {
//             events = await Event.find({
//                 //when selected date is not null
//                 date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
//                 latitude: { $gte: minLatitude, $lte: maxLatitude },
//                 longitude: { $gte: minLongitude, $lte: maxLongitude },
//             });
//            // console.log(events);
//         }



//         for(let i=0;i<events.length;i++){
//             let event = events[i];
//             if(event.date == colomboTime.slice(0, 10)){
//                 event.isToday = true;
//                 console.log("D",event.eventname);
//                 if(event.time <= colomboTime.slice(11, 16) && event.endTime >= colomboTime.slice(11, 16)){
//                     event.isLive = true;
//                     console.log("T",event.eventname);
//                 }else{
//                     if(event.endTime < colomboTime.slice(11, 16)){
//                         //this event remove from the list
//                         console.log("F",event.eventname);
//                         events.splice(i,1);
//                     }
//                 }
//             }
//         }

//      //   console.log(events);

//         res.status(200).json({
//             success: true,
//             message: "Events fetched successfully",
//             data: events
//         });


//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Events fetching failed',
//             error: error.message,
//         });
//     }
// });

const getMoments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, longitudeDelta, latitudeDelta, selectedDate, justNow, usertime,userDate } = req.body;
     console.log("mmmmmmmmmmmmmmmmm", req.body)

    try {
        let events;

        const minLatitude = latitude - latitudeDelta;
        const maxLatitude = latitude + latitudeDelta;
        const minLongitude = longitude - longitudeDelta;
        const maxLongitude = longitude + longitudeDelta;

        if (id) {
            if (id === '0') {
                events = await Event.find({
                    date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
                    latitude: { $gte: minLatitude, $lte: maxLatitude },
                    longitude: { $gte: minLongitude, $lte: maxLongitude },
                }).exec();
            } else {
                events = await Event.find({
                    category: id,
                    date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
                    latitude: { $gte: minLatitude, $lte: maxLatitude },
                    longitude: { $gte: minLongitude, $lte: maxLongitude },
                }).exec();
            }
        } else {
            events = await Event.find({
                date: selectedDate ? selectedDate : { $gte: new Date().toISOString().slice(0, 10) },
                latitude: { $gte: minLatitude, $lte: maxLatitude },
                longitude: { $gte: minLongitude, $lte: maxLongitude },
            }).exec();
        }


       // console.log(events);

        events = events.filter((event) => {
            if (event.date === userDate) {
                event.isToday = true;
                if (event.time <= usertime && event.endTime >= usertime) {
                    event.isLive = true;
                } else {
                    if (event.endTime < usertime) {
                        return false; // Remove this event from the list
                    }
                }
            }
            return true; // Keep the event in the list
        });
        // events = events.filter((event) => {
        //     if (event.date === colomboTime.slice(0, 10)) {
        //         event.isToday = true;
        //         if (event.time <= colomboTime.slice(11, 16) && event.endTime >= colomboTime.slice(11, 16)) {
        //             event.isLive = true;
        //         } else {
        //             if (event.endTime < colomboTime.slice(11, 16)) {
        //                 return false; // Remove this event from the list
        //             }
        //         }
        //     }
        //     return true; // Keep the event in the list
        // });

        // If justNow is true, filter only events where isToday is true and isLive is true
        if (justNow) {
            events = events.filter((event) => event.isToday && event.isLive);
        }

        console.log(events);

        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            data: events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Events fetching failed',
            error: error.message,
        });
    }
});

const getEachMoment = asyncHandler(async (req, res) => {
    // console.log("cgsffgffgf")
    const { id, userId } = req.body;
    try {
        //whole events list fetch
        const event = await Event.findById(id)
        console.log(event);
        const user = await User.findById(userId);
        // console.log("Interested",event.interested.includes(userId));
        //  console.log("Intere",event.going.includes(userId));
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: {
                event,
                like: event.like.includes(userId),
                dislike: event.dislike.includes(userId),
                user: user,
                go: event.going.includes(userId),
                interested: event.interested.includes(userId),
                goingList: event.going,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    }
});
const getPost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    console.log("page", page,limit,startIndex);
    //sri lanka colombo time
 //   console.log(id)
    let eventsArray = [];
    try {
        const user = await User.findById(id);
        if (user) {
            //compare each events distance with user current location and return
            const events = await Event.find({
                date: { $gte: new Date().toISOString().slice(0, 10)} ,
            }).exec();
            for (let i = 0; i < events.length; i++) {
                let event = events[i];
                const distance = Math.sqrt(Math.pow(user.currentLatitude - event.latitude, 2) + Math.pow(user.currentLongitude - event.longitude, 2));
                eventsArray.push({ event: event, edate: event.date, distance: distance, marks: 0 });
            }
            eventsArray.sort((a, b) => a.distance - b.distance);
            for (let i = 0; i < eventsArray.length; i++) {
                eventsArray[i] = eventsArray[i].event;
            }

            const postFeed = eventsArray.slice(startIndex, startIndex + limit);
            console.log(postFeed);
            //today date in sri lanka colombo date
            // let today = new Date().toISOString().slice(0, 10);
            //  console.log(today);
            // console.log(eventsArray);
            res.status(200).json({
                success: true,
                message: "Event fetched successfully",
                data: postFeed
            });
            // console.log(eventsArray);
            // for(let i=0;i<eventsArray.length;i++){
            //     eventsArray[i].marks = ;
            // }
        } else {
            console.log("User not found");
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    }
})

const likeUpdate = asyncHandler(async (req, res) => {
    const { id, userId } = req.body;
    try {
        const event = await Event.findById(id);
        if (event) {
            if (event.like.includes(userId)) {
                // User already liked the event, so remove the like
                event.like.pull(userId);
            } else {
                // User is liking the event
                event.like.push(userId);
            }

            // Save the updated event
            await event.save();

            res.status(200).json({
                success: true,
                message: "Event like updated successfully",
                data: { event, like: event.like.includes(userId) }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Event not found",
                error: "Event not found with the provided ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event like update failed",
            error: error.message
        });
    }
});

const disLikeUpdate = asyncHandler(async (req, res) => {
    const { id, userId } = req.body;
    try {
        const event = await Event.findById(id);
        if (event) {
            if (event.dislike.includes(userId)) {
                // User already disliked the event, so remove the dislike
                event.dislike.pull(userId);
            } else {
                // User is disliking the event
                event.dislike.push(userId);
            }

            // Save the updated event
            await event.save();

            res.status(200).json({
                success: true,
                message: "Event dislike updated successfully",
                data: { event, dislike: event.dislike.includes(userId) }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Event not found",
                error: "Event not found with the provided ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event dislike update failed",
            error: error.message
        });
    }
})

const getMyMoments = asyncHandler(async (req, res) => {
    const { id } = req.body;
    try {
        //whole events list fetch
        const events = await Event.find({ publisherId: id }).sort({ createdAt: -1 });
        // console.log(events)
        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Events fetching failed",
            error: error.message
        });
    }
});

const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;  // Assuming the event ID is in the URL parameters
    console.log(id);
    try {
        // Find the event by ID and delete it
        await Event.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event deletion failed",
            error: error.message
        });
    }
});

const createPost = asyncHandler(async (req, res) => {
    const { eventId, postText, postImages, userId, eventname } = req.body;
    try {
        // Create a new post
        const newPost = await Post.create({
            publisherId: userId,
            postText: postText,
            postMedia: postImages,
            eventId: eventId,
            eventname: eventname
        });

        // Update the event's post array with the new post id
        await Event.findByIdAndUpdate(eventId, {
            $push: { post: newPost._id }, // Corrected 'posts' to 'post'
        });

        res.status(201).json({
            success: true,
            message: "Post added successfully",
            data: newPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Post creation failed",
            error: error.message
        });
    }
});

const getPostFeed = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id).populate('post').sort({ createdAt: -1 });
        //  console.log(event.post);
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event.post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    }
});

const getUserDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    //    console.log("fdsfgff66",id);
    try {
        const user = await User.findById(id);
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User fetching failed",
            error: error.message
        });
    }
});

const getWholePosts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const post = await Post.find({ publisherId: id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: post
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        })
    }
});

//Interested and going process controller create as like dislike process
const interestedUpdate = asyncHandler(async (req, res) => {

    const { id, userId } = req.body;
    try {
        const event = await Event.findById(id);
        const user = await User.findById(userId);
        if (event && user) {
            if (event.interested.includes(userId) && user.interestedEvents.includes(id)) {
                event.interested.pull(userId);
                user.interestedEvents.pull(id);
            } else {
                event.interested.push(userId);
                user.interestedEvents.push(id);
            }

            await event.save();
            await user.save();

            console.log(event.interested.includes(userId));

            res.status(200).json({
                success: true,
                message: "Event interested updated successfully",
                data: { event, interest: event.interested.includes(userId) }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Event not found",
                error: "Event not found with the provided ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event interested update failed",
            error: error.message
        });
    }
});

const goingUpdate = asyncHandler(async (req, res) => {

    const { id, userId } = req.body;
    try {
        const event = await Event.findById(id);
        const user = await User.findById(userId);
        if (event && user) {
            if (event.going.includes(userId) && user.goingEvents.includes(id)) {
                event.going.pull(userId);
                user.goingEvents.pull(id);
            } else {
                event.going.push(userId);
                user.goingEvents.push(id);
            }

            await event.save();
            await user.save();

            //console.log(event.going.includes(userId));

            res.status(200).json({
                success: true,
                message: "Event going updated successfully",
                data: { event, go: event.going.includes(userId) }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Event not found",
                error: "Event not found with the provided ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event going update failed",
            error: error.message
        });
    }
});

const contribute = asyncHandler(async (req, res) => {
    //const {userId} = req.params;
    const { userId } = req.body;
    console.log("userId", userId);
    try {
        const user = await User.findById(userId);
        if (user) {
            //get each event id from user going array and return the event details time sorted
            const events = await Event.find({ _id: { $in: user.goingEvents } }).sort({ createdAt: -1 });
            //   console.log(events);
            res.status(200).json({
                success: true,
                message: "Event fetched successfully",
                data: events
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    }
});

const selectLeaderBoard = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        // get all events and post of each users and multiply by 10 and 5 respectively and save the total to the marks in user model and sort by descending order and get top 10 users
        const users = await User.find({}).sort({ createdAt: -1 });
        let myMarks = 0;
        let fName = '';
        let leaderBoard = [];
        for (let i = 0; i < users.length; i++) {
            let user = users[i];

            const events = await Event.find({ publisherId: user._id });
            const posts = await Post.find({ publisherId: user._id });
            let total = events.length * 10 + posts.length * 5;
            if (user._id == id) {
                myMarks = total;
                fName = user.firstName + " " + user.lastName;
            }
            // leaderBoard.push({user:user,total:total});
            leaderBoard.push({ userId: user._id, total: total, firstName: user.firstName, lastName: user.lastName, profilePicture: user.profilePicture });
        }
        leaderBoard.sort((a, b) => b.total - a.total);
        leaderBoard = leaderBoard.slice(0, 10);
        console.log(leaderBoard);
        res.status(200).json({
            success: true,
            message: "LeaderBoard fetched successfully",
            data: { leaderBoard: leaderBoard, myMarks: myMarks, myName: fName }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "LeaderBoard fetching failed",
            error: error.message
        });
    }
});
//react to use to find event eventId and photos find by image id and update the reacted users array with user id
const reactToPhoto = asyncHandler(async (req, res) => {
    const { eventId, imageId, userId } = req.body;
    console.log(eventId, imageId, userId);
    try {
        const event = await Event.findById(eventId);
        if (event) {
            const photo = event.gallery.id(imageId);
            if (photo) {
                if (photo.reactedUsers.includes(userId)) {
                    // User already reacted to the photo, so remove the reaction
                    photo.reactedUsers.pull(userId);
                } else {
                    // User is reacting to the photo
                    photo.reactedUsers.push(userId);
                }

                // Save the updated event
                await event.save();
                //console.log(photo.reactedUsers.includes(userId) ? photo.reactedUsers.length : "not reacted")
                res.status(200).json({
                    success: true,
                    message: "Photo reaction updated successfully",
                    data: { event }
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Photo not found",
                    error: "Photo not found with the provided ID"
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: "Event not found",
                error: "Event not found with the provided ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Photo reaction update failed",
            error: error.message
        });
    }
});

const updateEvents = asyncHandler(async (req, res) => {
    const { id, userId, eventData } = req.body;

    try {
        // First, check if the user (userId) has permission to update the event with the given id
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found',
            });
        }

        if (event.publisherId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied. You are not the publisher of this event.',
            });
        }

        // Now, update the event data
        const updatedEvent = await Event.findByIdAndUpdate(id, eventData, { new: true });

        if (!updatedEvent) {
            return res.status(500).json({
                success: false,
                message: 'Event update failed',
            });
        }
        console.log("Done")
        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Event update failed',
            error: error.message,
        });
    }
});

const searchEvents = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const events = await Event.find({ eventname: { $regex: id, $options: 'i' } })
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    }
})


// const sendNotification = asyncHandler(async (req, res) => {
//     const { message } = req.body;
//     console.log(message);

//     try {
//       const users = await User.find({});
//       const somePushTokens = [];

//       for (let user of users) {
//         if (user.notificationtoken) {
//           somePushTokens.push(user.notificationtoken);
//         }
//       }

//       let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
//       const messages = [];

//       for (let pushToken of somePushTokens) {
//         messages.push({
//           to: pushToken,
//           sound: 'default',
//           title: 'Original Title',
//           body: message.body,
//           data: { withSome: 'data' },
//         });
//       }

//         await expo.sendPushNotificationsAsync([message]);
//       res.status(200).json({ success: true, message: 'Notification sent successfully' });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Notification sending failed",
//         error: error.message
//       });
//     }
//   });

const sendNotification = asyncHandler(async (req, res) => {
    const { message, latitude, longitude } = req.body;
    console.log(req.body);

    try {
        const users = await User.find({});
        const somePushTokens = [];

        for (let user of users) {
            if (user.notificationtoken && user.currentLatitude && user.currentLongitude) {
                const distance = Math.sqrt(Math.pow(latitude - user.currentLatitude, 2) + Math.pow(longitude - user.currentLongitude, 2));
                console.log(distance);
                if (distance <= 0.1) {
                    somePushTokens.push(user.notificationtoken);
                }

            }
        }
        let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
        const messages = [];
        for (let pushToken of somePushTokens) {
            messages.push({
                to: pushToken,
                sound: 'default',
                title: message.title,
                body: message.body,
                data: { withSome: 'data' },
            });
        }

        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];
        (async () => {
            for (let chunk of chunks) {
                try {
                    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.error(error);
                }
            }
        })();
        const receiptIds = [];
        for (let ticket of tickets) {
            if (ticket.id) {
                receiptIds.push(ticket.id);
            }
        }
        const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
        (async () => {
            for (let chunk of receiptIdChunks) {
                try {
                    const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
                    console.log(receipts);
                    for (let receipt of receipts) {
                        if (receipt.status === 'ok') {
                            continue;
                        } else if (receipt.status === 'error') {
                            console.error(`There was an error sending a notification: ${receipt.message}`);
                            if (receipt.details && receipt.details.error) {
                                console.error(`The error code is ${receipt.details.error}`);
                            }
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        })();
        res.status(200).json({ success: true, message: 'Notification sent successfully' });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Notification sending failed",
            error: error.message
        });
    }
});

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;  // Assuming the event ID is in the URL parameters
    console.log(id);
    try {
        // Find the event by ID and delete it
        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Post deletion failed",
            error: error.message
        });
    }
})

const editPostOfUser = asyncHandler(async (req, res) => {
    //only post text can be edited
    const { id } = req.params;
    const { postText } = req.body;
    console.log(id, postText);
    try {
        const post = await Post.findById(id);
        if (post) {
            post.postText = postText;
            await post.save();
            res.status(200).json({
                success: true,
                message: "Post updated successfully",
                data: post
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Post not found",
                error: "Post not found with the provided ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Post update failed",
            error: error.message
        });
    }
})

const feedbackController = asyncHandler(async (req, res) => {
    const { userId, userInput, selectedOption, selectedImage } = req.body;
    try {
        const feedback = await Feedback.create({
            userId: userId,
            userInput: userInput,
            selectedOption: selectedOption,
            selectedImage: selectedImage
        });
        res.status(201).json({
            success: true,
            message: "Feedback added successfully",
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Feedback creation failed",
            error: error.message
        });
    }
});

const goinglistController = asyncHandler(async (req, res) => {
    const { goingList } = req.body;
    let goingListData = [];

    try {
        for (let i = 0; i < goingList.length; i++) {
            const user = await User.findById(goingList[i]);
            if (user) {
                goingListData.push({ username: user.firstName + " " + user.lastName, profilePicture: user.profilePicture, userId: user._id });
            }
        }

        // Sort the array in alphabetical order based on the username
      //  goingListData.sort((a, b) => a.username.localeCompare(b.username));

        console.log(goingListData);
        res.status(200).json({
            success: true,
            message: "Going list fetched successfully",
            data: goingListData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Going list fetching failed",
            error: error.message
        });
    }

    console.log(goingListData);
});




export { addMoment, getMoments, editPostOfUser, goinglistController, feedbackController, getEachMoment, getPost, likeUpdate, deletePost, disLikeUpdate, getMyMoments, deleteEvent, createPost, getPostFeed, getUserDetails, getWholePosts, interestedUpdate, goingUpdate, contribute, selectLeaderBoard, reactToPhoto, updateEvents, searchEvents, sendNotification };

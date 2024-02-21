import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
    {
        publisherId: {
            type: String,
            required: true,
        },
        publisherName: {
            type: String,
            required: true,
        },
        privacy: {
            type: Boolean,
            required: true,
        },
        invitationLink: {
            type: String,
            default: '',
        },
        eventname: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            default: '',
           // required: true,
        },
        locationText: {
            type: String,
            // required: true,
        },
        location: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
            default: 0,
            // required: true,
        },
        isLive: {
            type: Boolean,
            default: false,
        },
        isToday: {
            type: Boolean,
            default: false,
        },
        longitude: {
            type: Number,
            default: 0,
            // required: true,
        },
        hostid: {
            type: String,
            required: true,
        },
        features: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            required: true,
        },
        contactDetails: {
            type: String,
          //  required: true,
        },
        like: {
            type: [String],
            default: [],
        },
        dislike: {
            type: [String],
            default: [],
        },
        entrancefee: {
            type: Boolean,
            required: true,
        },
        ticketBookingLink: {
            type: String,
            default: '',
        },
        ticketprice: {
            type: [Number],
            default: [],
        },
        // gallery: [{
        //     photoUrl: {
        //         type: String,
        //         required: true,
        //     },
        //     reactedUsers: {
        //         type: [String],
        //         default: [],
        //     }
        // }],
        gallery: {
            type: [String],
            default: [],
        },
        interested: {
            type: [String],
            default: [],
        },
        going: {
            type: [String],
            default: [],
        },
        post: [{type: mongoose.Schema.Types.ObjectId,ref: 'Post'}]
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;

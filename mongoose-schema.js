import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    publicData: {
        fullName: {
            type: String,
            required: true,
        },
    },

    personalData: {
        email: {
            address: {
                type: String,
                required: true,
                unique: true,
            },
            isVerified: { // by email
                type: Boolean,
                required: true,
                default: false,
            },
            verificationDate: {
                type: Date,
                required: false,
            },
        },
        password: {
            type: String,
            required: true,
        },
    },

    registerDate: {
        type: Date,
        required: true,
        default: Date.now,
    },

    isBlocked: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const groupsSchema = new mongoose.Schema({
    groupCreatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },

    generalSettings: {
        groupName: {
            type: String,
            required: true
        },
        groupDescription: {
            type: String,
            required: true
        },
        groupURL: { // groupina.com/group/example-group
            type: String,
            required: true,
            unique: true
        },
        joinPolicy: {
            type: Number, // 0 - Closed, 1 - Open To Public, 2 - Open By Email Invite Only
            required: true,
            default: 1
        },
    },

    posts: {
        active: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
            default: []
        }],
        pending: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
            default: []

        }],
        declined: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
            default: []
        }]
    },

    members: {
        activeMembers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            default: []
        }],
        kickedMembers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            default: []
        }]
    },
    joinRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JoinRequest',
        required: true,
        default: []
    }],
    joinRequestHistory: [{  // ALL requests the have status voteClosed = true
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JoinRequest',
        required: true,
        default: []
    }]
})
export const User = mongoose.model("User", userSchema, 'users');
export const Group = mongoose.model('Groups', groupsSchema, 'groups')

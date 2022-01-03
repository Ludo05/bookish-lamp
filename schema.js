import graphql from "graphql";
import {Group, User} from './mongoose-schema.js'


//Sub sections
const Email = new graphql.GraphQLObjectType({
    name: 'Email',
    fields: () => ({
        address: { type: graphql.GraphQLString },
        isVerified: { type: graphql.GraphQLBoolean  },
        verificationDate: { type: graphql.GraphQLString  }
    })
});
const PersonalData = new graphql.GraphQLObjectType({
    name: 'PersonalData',
    fields: () => ({
        email: { type: Email },
        password: { type: graphql.GraphQLString  }
    })
});
const PublicData = new graphql.GraphQLObjectType({
    name: 'PublicData',
    fields: () => ({
        fullName: { type: graphql.GraphQLString },
    })
});
const GeneralSettings = new graphql.GraphQLObjectType({
    name: 'GeneralSettings',
    fields: () => ({
        groupName: { type: graphql.GraphQLString },
        groupDescription: { type:  new graphql.GraphQLNonNull(graphql.GraphQLString) },
        groupURL: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        joinPolicy: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    })
});
const Post = new graphql.GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        active: { type: new graphql.GraphQLList(graphql.GraphQLString) },
        pending: { type: new graphql.GraphQLList(graphql.GraphQLString) },
        declined: { type: new graphql.GraphQLList(graphql.GraphQLString) }
    })
});
const Member = new graphql.GraphQLObjectType({
    name: 'Member',
    fields: () => ({
        activeMembers: { type: new graphql.GraphQLList(graphql.GraphQLString) },
        kickedMembers: { type: new graphql.GraphQLList(graphql.GraphQLString) },
    })
});


//Mongoose Schemas
const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    description: 'a user',
    fields: () => ({
        id: {type: graphql.GraphQLString},
        publicData: {type: PublicData},
        personalData: { type: PersonalData},
        registerDate: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
            description: 'book name'
        },
        isBlocked: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
            description: 'book name'
        },
        groups: {
            type: new graphql.GraphQLList(GroupType),
            resolve: async (parent) => Group.find({groupCreatorId: parent.id}).exec()
        }
    })
})
const GroupType = new graphql.GraphQLObjectType({
    name: 'Group',
    description: 'groups',
    fields: () => ({
        groupCreatorId:{ type: graphql.GraphQLString},
        createdAt:{ type: graphql.GraphQLString},
        generalSettings:{ type: GeneralSettings} ,
        posts:{ type: Post},
        members:{ type: Member },
        joinRequests:{ type:   new graphql.GraphQLList(graphql.GraphQLString)},
        joinRequestHistory:{type:  new graphql.GraphQLList(graphql.GraphQLString)}
    })
})


const RootQueryType = new graphql.GraphQLObjectType({
    name: 'Query',
    description: 'Queries for book store',
    fields: () => ({
        user: {
            type: UserType,
            description: ' get single book',
            args: {
                email: {type: graphql.GraphQLString}
            },
            resolve: async (parent, args) => await User.findOne({'personalData.email.address': args.email}).exec()
        },
        users: {
            type: new graphql.GraphQLList(UserType),
            description: 'list of books',
            resolve: async () => await User.find({}).exec()
        },
        groups: {
            type: new graphql.GraphQLList(GroupType),
            description: 'list of groups',
            resolve: async () => await Group.find({}).exec()
        }
    })
})
const RootMutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    description: 'root for mutations',
    fields: () => ({
        addBook: {
            type: UserType,
            description: 'add user',
            args: {
                name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
                authorId: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {name: args.name, authorId: args.authorId, id: books.length + 1}
                books.push(book)
                return book
            }
        }
    })
})


export default new graphql.GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

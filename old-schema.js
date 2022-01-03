import graphql from "graphql";
import {authors, books} from "./data.js";
import { User } from './mongoose-schema.js'
const AuthorType = new graphql.GraphQLObjectType({
    name: 'Author',
    description: 'author of book',
    fields: () => ({
        id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
            description: 'book id'
        },
        name: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
            description: 'book name'
        },
        books: {
            type: new graphql.GraphQLList(BookType),
            //Resolve takes a source (Parent source which is usually the parent object you are in.
            //Is used to make calls to filter child object by value.
            resolve: (author ) => {
                //These are usually rest calls
                return books.filter(book => book.authorId === author.id)
            }

        }
    })
})
const BookType = new graphql.GraphQLObjectType({
    name: 'Book',
    description: 'a book',
    fields: () => ({
        id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
            description: 'book id'
        },
        name: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString),
            description: 'book name'
        },
        authorId: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
            description: 'book author id'
        },
        author: {
            type: AuthorType,
            resolve: (book) => {
                //These are usually rest calls
                return authors.find(author => author.id === book.authorId)
            }

        }
    })
})




const RootQueryType = new graphql.GraphQLObjectType({
    name: 'Query',
    description: 'Queries for book store',
    fields: () => ({
        book: {
            type: BookType,
            description: ' get single book',
            args: {
                id: { type: graphql.GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new graphql.GraphQLList(BookType),
            description: 'list of books',
            resolve: () => books
        },
        authors: {
            type: new graphql.GraphQLList(AuthorType),
            description: 'list of authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'get single author',
            args: {
                id: { type: graphql.GraphQLInt}
            },
            resolve: (parent, args) => authors.find( author => author.id === args.id)
        }
    })
})
const RootMutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    description: 'root for mutations',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'add book',
            args: {
                name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
                authorId: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
            },
            resolve: (parent,args) => {
                const book = {name: args.name, authorId: args.authorId, id: books.length + 1}
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'add author',
            args: {
                name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
            },
            resolve: (parent,args) => {
                const author = {name: args.name, id: authors.length + 1}
                authors.push(author)
                return author
            }
        },
        deleteBook: {
            type: graphql.GraphQLString,
            description: 'delete book',
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
            },
            resolve: (parent,args) => {
                books = books.filter((book) => book.id !== args.id )
                return `book deleted`;
            }
        },
        deleteAuthor: {
            type: graphql.GraphQLString,
            description: 'delete author',
            args: {
                id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
            },
            resolve: (parent,args) => {
                authors = authors.filter((author) => author.id !== args.id )
                return 'author deleted';
            }
        }

    })
})


export default new graphql.GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

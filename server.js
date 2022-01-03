import express from 'express';
import {graphqlHTTP} from 'express-graphql'
import schema from './schema.js'
const PORT = 5000;
const app = express();
import mongoose from'mongoose';

mongoose.connect('mongodb+srv://admin:admin@cluster0.xpwrw.mongodb.net/blog?retryWrites=true&w=majority')

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}))

app.listen(PORT, () => {
    console.log('listening on port', PORT)
})



import express from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas'; 
import db from './config/connection.js';
import { authenticateToken } from './services/auth'; 

const app: any = express(); 
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Authentication middleware
app.use(authenticateToken); 

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,          
  resolvers,         
  context: ({ req }) => {
    // Pass the user from the request to context
    return { user: req.user || null }; 
  },
});

server.applyMiddleware({ app });


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


db.once('open', () => {
  app.listen(PORT, () =>
    console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`)
  );
});
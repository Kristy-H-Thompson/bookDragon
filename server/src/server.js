import express from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import db from './config/connection.js';
import authenticateToken from './services/auth';
const app = express(); // Cast to 'any' to bypass type issue
const PORT = process.env.PORT || 3001;
// Middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Authentication middleware
app.use(authenticateToken); // Apply token authentication globally
// Set up Apollo Server
const server = new ApolloServer({
    typeDefs, // GraphQL type definitions
    resolvers, // GraphQL resolvers
    context: ({ req }) => {
        // Pass the user from the request (attached by authenticateToken) into context
        return { user: req.user || null }; // If no user, context is null (unauthenticated)
    },
});
// Apply Apollo Server as middleware to the Express app
server.applyMiddleware({ app });
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}
// Define or import routes (example below)
// import routes from './routes';  // Uncomment and adjust the import path as needed
// app.use('/api', routes);
// Database connection and server start
db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`));
});

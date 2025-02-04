import express from 'express';
import path from 'node:path';
import mongoose from 'mongoose';
import routes from './routes/api/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { getUserFromToken } from './services/auth.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/googlebooks';


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


await server.start();
console.log('Apollo Server started'); 

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1] || '';
      const user = getUserFromToken(token); 
      return { user };
    },
  })
);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
}

app.use(routes);
console.log('Routes added...'); 7

mongoose.connect(MONGO_URI);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully'); 

  app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});


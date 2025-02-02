import express, { Request, Response } from 'express'; 
import path from 'node:path';
import cors from 'cors'; 
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas/index.js'; 
import db from './config/connection.js';
import { authenticateToken } from './services/auth.js'; 
import jwt from 'jsonwebtoken'; 
import User  from './models/User.js'; 

const app: any = express();
const PORT = process.env.PORT || 3001;

// Use CORS middleware to allow your frontend to make requests to your backend
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: 'GET, POST, PUT, DELETE', // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
}));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public routes (no authentication required)
app.post('/api/users', async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create a new user object (no password hashing here)
    const newUser = new User({ username, email, password });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1h' } // Token expiration time (adjust as needed)
    );

    // Send the token and success message
    return res.status(201).json({ message: 'User created successfully', token });

  } catch (error: any) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Apply the authentication middleware only to routes that require it
app.use(authenticateToken);  // Now, authenticateToken is applied to the other routes

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { user: req.user || null };
  },
});

const startServer = async (): Promise<void> => {
  try {
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
    }

    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`);
      });
    });

  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();
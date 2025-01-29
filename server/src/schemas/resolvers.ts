import * as jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Book from '../models/Book.js';  // Importing Book to use in the resolvers

const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      return user; // `user` comes from the authMiddleware
    },
    // Added query to fetch all books
    books: async () => {
      return await Book.find(); // Fetch all books from the database
    },
  },
  Mutation: {
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Incorrect credentials');
      }
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      return { token, user };
    },
    addUser: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      return { token, user };
    },
    saveBook: async (_: any, { bookId, authors, description, title, image, link }: any, { user }: any) => {
      if (!user) throw new Error('You need to be logged in!');
      user.savedBooks.push({ bookId, authors, description, title, image, link });
      await user.save();
      return user;
    },
    removeBook: async (_: any, { bookId }: any, { user }: any) => {
      if (!user) throw new Error('You need to be logged in!');
      user.savedBooks = user.savedBooks.filter((book: any) => book.bookId !== bookId);
      await user.save();
      return user;
    },
  },
};

export default resolvers
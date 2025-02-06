import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Book from '../models/Book.js'; // Importing Book model

const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      const loggedinUser = await User.findOne({ email: user.email });
      if (!loggedinUser) throw new Error('You need to be logged in!');
      return loggedinUser; // `user` comes from the authMiddleware
    },
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
      console.log(user);
      const loggedinUser = await User.findOne({ email: user.email });
      if (!loggedinUser) throw new Error('You need to be logged in!');

      // Create a new Book instance using the imported Book model
      const book = new Book({
        bookId,
        authors,
        description,
        title,
        image,
        link,
      });

      // Push the Book instance into the savedBooks array
      loggedinUser.savedBooks.push(book);
      await loggedinUser.save();

      return loggedinUser;
    },
    removeBook: async (_: any, { bookId }: any, { user }: any) => {
      const loggedinUser = await User.findOne({ email: user.email });
      if (!loggedinUser) throw new Error('You need to be logged in!');
      loggedinUser.savedBooks = loggedinUser.savedBooks.filter((book: any) => book.bookId !== bookId);
      await loggedinUser.save();
      return loggedinUser;
    },
  },
};

export default resolvers;
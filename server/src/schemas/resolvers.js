import User from '../models/User';
import Book from '../models/Book'; // Importing Book to use in the resolvers
import jwt from 'jsonwebtoken';
export const resolvers = {
    Query: {
        me: async (_, __, { user }) => {
            return user; // `user` comes from the authMiddleware
        },
        // Added query to fetch all books
        books: async () => {
            return await Book.find(); // Fetch all books from the database
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new Error('Incorrect credentials');
            }
            const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
            return { token, user };
        },
        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
            return { token, user };
        },
        saveBook: async (_, { bookId, authors, description, title, image, link }, { user }) => {
            if (!user)
                throw new Error('You need to be logged in!');
            user.savedBooks.push({ bookId, authors, description, title, image, link });
            await user.save();
            return user;
        },
        removeBook: async (_, { bookId }, { user }) => {
            if (!user)
                throw new Error('You need to be logged in!');
            user.savedBooks = user.savedBooks.filter((book) => book.bookId !== bookId);
            await user.save();
            return user;
        },
    },
};

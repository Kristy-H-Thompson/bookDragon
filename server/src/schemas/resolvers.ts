import { AuthenticationError } from 'apollo-server-errors';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: { user: any }) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in!');
      }
      return User.findById(context.user._id).populate('savedBooks');
    },
  },
  Mutation: {
    login: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const isPasswordValid = await user.isCorrectPassword(password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user._id.toString(), user.email, user.username);
      return { token, user };
    },
    addUser: async (_parent: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user._id.toString(), user.email, user.username);
      return { token, user };
    },
    saveBook: async (_parent: unknown, { bookData }: { bookData: any }, context: { user: any }) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in!');
      }
     console.log(bookData);
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedBooks: bookData } }, // Use $push here
        { new: true, runValidators: true }
      );
    
      return updatedUser;
    },
    removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: { user: any }) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in!');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

export default resolvers;
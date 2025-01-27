import { Request, Response } from 'express';
import User from '../models/User.js'; 
import { signToken } from '../services/auth.js'; 
import Book, { BookDocument } from '../models/Book'; // Use BookDocument here

// Define the UserType interface
interface UserType {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[]; // Use BookDocument here
  isCorrectPassword: (password: string) => Promise<boolean>;
}

// Define saveBook function
export const saveBook = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as UserType)._id;
    const { bookId, title, authors, description, image, link } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Create a new Book document using Mongoose
    const newBook = new Book({
      bookId,
      title,
      authors,
      description,
      image,
      link,
    });

    // Save the book details to the user's savedBooks array
    user.savedBooks.push(newBook);
    await user.save();

    return res.status(200).json(user); // Respond with the updated user object
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while saving book' });
  }
};

// Define deleteBook function
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Remove the book from the user's savedBooks array
    user.savedBooks = user.savedBooks.filter((book: BookDocument) => book.bookId !== bookId);
    await user.save();

    return res.status(200).json(user); // Respond with the updated user object
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while deleting book' });
  }
};

// Other controller methods like createUser, login, etc.
export const createUser = async (req: Request, res: Response) => {
  const user = await User.create(req.body);

  if (!user) {
    return res.status(400).json({ message: 'Something went wrong!' });
  }

  const token = signToken(user.username, user.password, user._id);
  return res.json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }

  const typedUser = user as UserType;

  const correctPw = await typedUser.isCorrectPassword(password);

  if (!correctPw) {
    return res.status(400).json({ message: 'Wrong password!' });
  }

  const token = signToken(typedUser.username, typedUser.password, typedUser._id);
  return res.json({ token, user });
};

export const getSingleUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(400).json({ message: 'No user found in request' });
  }

  const foundUser = await User.findOne({
    $or: [
      { _id: (req.user as UserType)._id },
      { username: req.params.username }
    ],
  });

  if (!foundUser) {
    return res.status(400).json({ message: 'Cannot find a user with this id!' });
  }

  return res.json(foundUser);
};
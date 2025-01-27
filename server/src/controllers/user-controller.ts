import type { Request, Response } from 'express';
// import user model
import User from '../models/User.js';
// import sign token function from auth
import { signToken } from '../services/auth.js';

// Define the User type (import if it's defined elsewhere)
interface UserType {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: any[];
  isCorrectPassword: (password: string) => Promise<boolean>;
}

export const getSingleUser = async (req: Request, res: Response) => {
  const foundUser = await User.findOne({
    $or: [
      { _id: (req.user as UserType)._id }, // Assert req.user is a UserType
      { username: req.params.username }
    ],
  });

  if (!foundUser) {
    return res.status(400).json({ message: 'Cannot find a user with this id!' });
  }

  return res.json(foundUser);
};

export const createUser = async (req: Request, res: Response) => {
  const user = await User.create(req.body);

  if (!user) {
    return res.status(400).json({ message: 'Something is wrong!' });
  }

  // Ensure that `user` is properly typed
  const token = signToken(user.username, user.password, user._id);
  return res.json({ token, user });
};

// {body} is destructured req.body
export const login = async (req: Request, res: Response) => {
  // Assert req.body to match the structure expected for login
  const { username, email, password } = req.body;

  // Type annotation ensures that `user` is correctly typed as `UserType`
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // Check if user exists (user could be null)
  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }

  // Explicitly assert the type of `user` to `UserType` for safe property access
  const typedUser = user as UserType; // Assert `user` to `UserType`

  // Make sure we are accessing valid properties from `typedUser`
  if (typedUser.username && typedUser.password && typedUser._id) {
    const correctPw = await typedUser.isCorrectPassword(password);

    if (!correctPw) {
      return res.status(400).json({ message: 'Wrong password!' });
    }

    // Now that we know `typedUser` is a valid `UserType`, we can use its properties
    const token = signToken(typedUser.username, typedUser.password, typedUser._id);
    return res.json({ token, user });
  } else {
    return res.status(400).json({ message: 'User data is incomplete!' });
  }
};
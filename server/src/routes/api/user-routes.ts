import express from 'express';
const router = express.Router();
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';

// import middleware
import { authenticateToken } from '../../services/auth.js';

// Route for creating a new user (no token required)
router.route('/').post(createUser); // User creation does not need a token

// Route for logging in (no token required)
router.route('/login').post(login);

// Route to get the current user's info (requires token)
router.route('/me').get(authenticateToken, getSingleUser);

// Route to save a book (requires token)
router.route('/').put(authenticateToken, saveBook);

// Route to delete a book (requires token)
router.route('/books/:bookId').delete(authenticateToken, deleteBook);

export default router;

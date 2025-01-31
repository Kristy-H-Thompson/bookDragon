import type { User } from '../models/User.js';
import type { Book } from '../models/Book.js';

// Utility function to check response status and throw error if not ok
const checkResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json(); // return JSON data if successful
};

// route to get logged in user's info (needs the token)
export const getMe = (token: string) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse) // Check if response is ok
    .catch((error) => {
      console.error('Error fetching user info:', error);
      throw error; // You can handle it in the component
    });
};

export const createUserRequest = (userData: User) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData: User) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error('Error logging in:', error);
      throw error;
    });
};

// save book data for a logged in user
export const saveBook = (bookData: Book, token: string) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error('Error saving book:', error);
      throw error;
    });
};

// remove saved book data for a logged in user
export const deleteBook = (bookId: string, token: string) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error('Error deleting book:', error);
      throw error;
    });
};

// make a search to google books api
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
    .then(checkResponse)
    .catch((error) => {
      console.error('Error searching Google Books:', error);
      throw error;
    });
};
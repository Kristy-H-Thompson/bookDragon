Book Dragon
![License](https://img.shields.io/badge/License-MIT-yellow.svg "License")

Description
 Book Dragon is a fully functioning Google Books API search engine built with a RESTful API, and refactor it to be a GraphQL API built with Apollo Server. The app was built using the MERN stack, with a React front end, MongoDB database, and Node.js/Express.js server and API. It was already set up to allow users to save book searches to the back end. My goal was to take the starter code provided by the University of Denver and refactor it to use GraphQL. 

Features
- Search for books
- Save your favorite books to view later
- View a list of your favorite books
- Delete books from your list
- Login, logout, and register

Technologies Used
- Google Books API
- React
- Typescript
- GraphQL
- MongoDB
- Node.js
- Express.js
- Mongoose

Deployed website link:
[Website here](https://bookdragon.onrender.com/)

Table of Contents
- Installation
- Usage
- Credits
- License
- User Stories
- Acceptance Criteria

Installation
No extra installation required, just open the deployed website in your browser 

Usage
If you want to work with the code you will need to set up your .env file
- npm install
- npm run build
- npm run develop

Credits
Contributors
- Kristy Thompson: [GitHub Profile](https://github.com/Kristy-H-Thompson)

Resources
- [GraphQL](https://graphql.org/)
- [MongoDB Installation Guide](https://coding-boot-camp.github.io/full-stack/mongodb/how-to-install-mongodb)
- [MongoDB Documentation](https://www.mongodb.com/docs/v5.0/reference/method/cursor.toArray/)
- [Professional README Guide](https://coding-boot-camp.github.io/full-stack/github/professional-readme-guide)
- [Mongoose Documentation](https://mongoosejs.com/)

License
This project is licensed under the MIT License.

User Stories
- AS AN avid reader
- I WANT to search for new books to read SO THAT I can keep a list of books to purchase

Acceptance Criteria
GIVEN a book search engine
- WHEN I load the search engine THEN I am presented with a menu with the options Search for Books and Login/Signup and an input field to search for books and a submit button
- WHEN I click on the Search for Books menu option THEN I am presented with an input field to search for books and a submit button
- WHEN I am not logged in and enter a search term in the input field and click the submit button THEN I am presented with several search results, each featuring a book’s title, author, description, image, and a link to that book on the Google Books site
- WHEN I click on the Login/Signup menu option THEN a modal appears on the screen with a toggle between the option to log in or sign up
- WHEN the toggle is set to Signup THEN I am presented with three inputs for a username, an email address, and a password, and a signup button
- WHEN the toggle is set to Login THEN I am presented with two inputs for an email address and a password and login button
- WHEN I enter a valid email address and create a password and click on the signup button THEN my user account is created and I am logged in to the site
- WHEN I enter my account’s email address and password and click on the login button THEN the modal closes and I am logged in to the site
- WHEN I am logged in to the site THEN the menu options change to Search for Books, an option to see my saved books, and Logout
- WHEN I am logged in and enter a search term in the input field and click the submit button THEN I am presented with several search results, each featuring a book’s title, author, description, image, and a link to that book on the Google Books site and a button to save a book to my account
- WHEN I click on the Save button on a book THEN that book’s information is saved to my account
- WHEN I click on the option to see my saved books THEN I am presented with all of the books I have saved to my account, each featuring the book’s title, author, description, image, and a link to that book on the Google Books site and a button to remove a book from my account
- WHEN I click on the Remove button on a book THEN that book is deleted from my saved books list
- WHEN I click on the Logout button THEN I am logged out of the site and presented with a menu with the options Search for Books and Login/Signup and an input field to search for books and a submit button  
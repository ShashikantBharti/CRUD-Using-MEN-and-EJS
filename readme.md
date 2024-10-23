# Social Media Platform

This project is a basic social media platform where users can register, log in, create posts, like posts, and edit or delete their own posts. It is built using **Node.js**, **Express**, **MongoDB**, **JWT (JsonWebToken)** for authentication, and **EJS** for templating.

## Features

- **User Registration & Login**: Users can register and log in using their email or username.
- **JWT Authentication**: Secure user sessions with JWT tokens stored in cookies.
- **Post Creation & Management**: Users can create, edit, and update posts.
- **Post Liking**: Users can like and unlike posts.
- **Profile Page**: Each user has a profile page displaying their own posts.
- **Middleware for Authentication**: Only authenticated users can access restricted routes.
- **Error Handling**: 404 page for non-existent routes.

## Technologies Used

- **Node.js**: JavaScript runtime for the backend.
- **Express.js**: Web framework for handling routes and middleware.
- **MongoDB**: NoSQL database to store users and posts.
- **Mongoose**: MongoDB ORM to define schemas and interact with the database.
- **EJS**: Templating engine for dynamic HTML rendering.
- **JWT (JsonWebToken)**: For secure user authentication and authorization.
- **bcrypt**: To hash user passwords securely.
- **cookie-parser**: To manage cookies in Express.

## Project Structure

```bash
.
├── models
│   ├── user.js            # User model
│   ├── post.js            # Post model
├── views
│   ├── index.ejs          # Home page template
│   ├── profile.ejs        # User profile page template
│   ├── register.ejs       # Registration page template
│   ├── login.ejs          # Login page template
│   ├── edit.ejs           # Edit post template
│   ├── restricted.ejs     # Restricted access page
│   ├── 404.ejs            # 404 error page
├── app.js                 # Main server file
├── package.json           # Project metadata and dependencies
├── README.md              # Project documentation
```

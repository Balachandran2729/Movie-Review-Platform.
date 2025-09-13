# Movie Review Platform

A full-stack web application for browsing movies, reading and writing reviews, rating films, and managing a personal watchlist.

## Features

*   **User Authentication:** Register and login functionality.
*   **Movie Browsing:** View a list of movies with pagination.
*   **Search & Filter:** Search movies by title.
*   **Movie Details:** View detailed information about a movie, including synopsis, cast, director, and poster.
*   **Reviews:** Read reviews from other users and submit your own reviews with star ratings.
*   **Ratings:** See the average rating for each movie based on user reviews.
*   **Watchlist:** Add/remove movies to/from a personal watchlist.
*   **User Profile:** View profile information, review history, and watchlist.
*   **Admin Functionality:** Admin users can add new movies (including uploading posters).

## Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Redux Toolkit, React Router, React Icons
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT)
*   **Image Upload:** Multer (for handling `multipart/form-data` on the backend)
*   **Environment Variables:** dotenv

## Project Structure
movie-review-platform/
├── client/ # React Frontend (Vite + Tailwind + Redux)
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/ # Reusable UI components (Header, Footer, MovieCard, etc.)
│ │ ├── pages/ # Page components (Home, Movies, MovieDetail, etc.)
│ │ ├── redux/ # Redux store, slices (auth, movies, user)
│ │ ├── services/ # API service (Axios instance)
│ │ ├── utils/ # Utility functions
│ │ ├── App.jsx # Main App component with routing
│ │ ├── main.jsx # Entry point
│ │ └── index.css # Tailwind imports
│ ├── index.html
│ ├── vite.config.js
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ └── package.json
│
├── server/ # Node.js + Express Backend
│ ├── controllers/ # Request handlers (movieController, userController, etc.)
│ ├── models/ # Mongoose models (Movie, User, Review, Watchlist)
│ ├── routes/ # API routes (movieRoutes, userRoutes, etc.)
│ ├── middleware/ # Custom middleware (auth, validation)
│ ├── config/ # Configuration files (database connection)
│ ├── utils/ # Utility functions
│ ├── uploads/ # Directory for uploaded movie posters (created on first upload)
│ ├── .env # Environment variables (see setup)
│ ├── server.js # Main server file
│ └── package.json
│
├── .gitignore
└── README.md # This file


## Setup and Installation

### Prerequisites

*   **Node.js** (version 16 or later recommended)
*   **npm** (comes with Node.js) or **yarn**
*   **MongoDB** (local instance or MongoDB Atlas account)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd movie-review-platform


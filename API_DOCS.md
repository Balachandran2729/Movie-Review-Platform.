# Movie Review Platform API Documentation

This document describes the RESTful API endpoints for the Movie Review Platform backend.

**Base URL:** `http://localhost:5000/api` (Development) or your deployed backend URL.

---

## Authentication

Most endpoints (marked with 🔐) require a valid JSON Web Token (JWT) for authentication.

*   **To obtain a token:** Use the `/auth/login` or `/auth/register` endpoints.
*   **To use a token:** Include it in the `Authorization` header of your requests:
    ```
    Authorization: Bearer <your_jwt_token_here>
    ```

---

## Endpoints

### Auth Routes (`/auth`)

#### `POST /auth/register`

Registers a new user.

*   **URL:** `/api/auth/register`
*   **Method:** `POST`
*   **Auth Required:** No
*   **Data Params (Request Body):**
    ```json
    {
      "username": "string", // Required, 3-30 chars
      "email": "string",    // Required, valid email format
      "password": "string"  // Required, min 6 chars
    }
    ```
*   **Success Response:**
    *   **Code:** `201 CREATED`
    *   **Content:**
        ```json
        {
          "_id": "user_id",
          "username": "string",
          "email": "string",
          "role": "user", // or "admin"
          "token": "jwt_token_string"
        }
        ```
*   **Error Responses:**
    *   **Code:** `400 BAD REQUEST` - If validation fails (e.g., missing fields, invalid format) or user already exists.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.

#### `POST /auth/login`

Authenticates a user and returns a JWT.

*   **URL:** `/api/auth/login`
*   **Method:** `POST`
*   **Auth Required:** No
*   **Data Params (Request Body):**
    ```json
    {
      "email": "string",    // Required
      "password": "string"  // Required
    }
    ```
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Content:**
        ```json
        {
          "_id": "user_id",
          "username": "string",
          "email": "string",
          "role": "user", // or "admin"
          "token": "jwt_token_string"
        }
        ```
*   **Error Responses:**
    *   **Code:** `400 BAD REQUEST` - If validation fails (e.g., missing fields).
    *   **Code:** `401 UNAUTHORIZED` - If email or password is incorrect.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.

---

### Movie Routes (`/movies`)

#### `GET /movies`

Retrieves a paginated list of movies, with optional search.

*   **URL:** `/api/movies`
*   **Method:** `GET`
*   **Auth Required:** No
*   **Query Params:**
    *   `page` (integer, optional): Page number (default: 1).
    *   `search` (string, optional): Search term for movie titles.
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Content:**
        ```json
        {
          "movies": [
            {
              "_id": "movie_id",
              "title": "string",
              "genre": ["string"],
              "releaseYear": number,
              "director": "string",
              "cast": ["string"],
              "synopsis": "string",
              "posterUrl": "string", // URL or path to poster
              "averageRating": number,
              "totalReviews": number,
              "createdAt": "date_string",
              "updatedAt": "date_string"
            }
            // ... more movies
          ],
          "page": number,
          "pages": number, // Total pages
          "total": number  // Total movies matching criteria
        }
        ```
*   **Error Responses:**
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs during database query.

#### `POST /movies`

Creates a new movie. Requires admin privileges.

*   **URL:** `/api/movies`
*   **Method:** `POST`
*   **Auth Required:** 🔐 (Admin)
*   **Data Params (Request Body):** `multipart/form-data`
    *   `title` (string, required)
    *   `genre` (string, required) - Comma-separated genres (e.g., "Action,Sci-Fi")
    *   `releaseYear` (number, required)
    *   `director` (string, required)
    *   `cast` (string, optional) - Comma-separated actors (e.g., "Actor 1,Actor 2")
    *   `synopsis` (string, required)
    *   `poster` (file, optional) - Image file for the movie poster.
    *   `trailerUrl` (string, optional) - URL to the movie trailer.
*   **Success Response:**
    *   **Code:** `201 CREATED`
    *   **Content:** The created movie object (including the generated `posterUrl` if an image was uploaded).
        ```json
        {
          "_id": "movie_id",
          "title": "string",
          "genre": ["string"],
          "releaseYear": number,
          "director": "string",
          "cast": ["string"],
          "synopsis": "string",
          "posterUrl": "string", // e.g., "/uploads/posters/movie_id.jpg"
          "averageRating": 0,
          "totalReviews": 0,
          "createdAt": "date_string",
          "updatedAt": "date_string"
        }
        ```
*   **Error Responses:**
    *   **Code:** `400 BAD REQUEST` - If validation fails (e.g., missing required fields, invalid data types).
    *   **Code:** `401 UNAUTHORIZED` - If no valid JWT is provided.
    *   **Code:** `403 FORBIDDEN` - If the user is not an admin.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs (e.g., database error, file upload error).

#### `GET /movies/:id`

Retrieves a specific movie by its ID, including its associated reviews.

*   **URL:** `/api/movies/:id` (where `:id` is the Movie's ObjectId)
*   **Method:** `GET`
*   **Auth Required:** No
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Content:** The movie object with an embedded `reviews` array.
        ```json
        {
          "_id": "movie_id",
          "title": "string",
          "genre": ["string"],
          "releaseYear": number,
          "director": "string",
          "cast": ["string"],
          "synopsis": "string",
          "posterUrl": "string",
          "averageRating": number,
          "totalReviews": number,
          "reviews": [
            {
              "_id": "review_id",
              "userId": {
                "_id": "user_id",
                "username": "string",
                "profilePicture": "string" // or null
              },
              "movieId": "movie_id", // Reference
              "rating": number, // 1-5
              "reviewText": "string",
              "createdAt": "date_string",
              "updatedAt": "date_string"
            }
            // ... more reviews
          ],
          "createdAt": "date_string",
          "updatedAt": "date_string"
        }
        ```
*   **Error Responses:**
    *   **Code:** `400 BAD REQUEST` - If the `:id` parameter is not a valid MongoDB ObjectId format.
    *   **Code:** `404 NOT FOUND` - If no movie exists with the given `:id`.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.

---

### Review Routes (`/movies/:id/reviews`)

#### `GET /movies/:id/reviews`

Retrieves all reviews for a specific movie by its ID.

*   **URL:** `/api/movies/:id/reviews` (where `:id` is the Movie's ObjectId)
*   **Method:** `GET`
*   **Auth Required:** No
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Content:** An array of review objects for the specified movie.
        ```json
        [
          {
            "_id": "review_id",
            "userId": {
              "_id": "user_id",
              "username": "string",
              "profilePicture": "string" // or null
            },
            "movieId": "movie_id", // Reference
            "rating": number, // 1-5
            "reviewText": "string",
            "createdAt": "date_string",
            "updatedAt": "date_string"
          }
          // ... more reviews
        ]
        ```
*   **Error Responses:**
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs during database query.

#### `POST /movies/:id/reviews`

Submits a new review for a specific movie. Requires authentication.

*   **URL:** `/api/movies/:id/reviews` (where `:id` is the Movie's ObjectId)
*   **Method:** `POST`
*   **Auth Required:** 🔐 (Any authenticated user)
*   **Data Params (Request Body):**
    ```json
    {
      "rating": number, // Required, integer between 1 and 5
      "reviewText": "string" // Required, max 1000 chars
    }
    ```
*   **Success Response:**
    *   **Code:** `201 CREATED`
    *   **Content:** The created review object (with populated `userId` information).
        ```json
        {
          "_id": "review_id",
          "userId": {
            "_id": "user_id",
            "username": "string",
            "profilePicture": "string" // or null
          },
          "movieId": "movie_id", // Reference
          "rating": number, // 1-5
          "reviewText": "string",
          "createdAt": "date_string",
          "updatedAt": "date_string"
        }
        ```
        *Note: The associated movie's `averageRating` and `totalReviews` fields are also updated in the database.*
*   **Error Responses:**
    *   **Code:** `400 BAD REQUEST` - If validation fails (e.g., missing fields, invalid rating, review already exists for this user/movie).
    *   **Code:** `401 UNAUTHORIZED` - If no valid JWT is provided.
    *   **Code:** `404 NOT FOUND` - If no movie exists with the given `:id`.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.

---

### User Routes (`/users/:id`)

#### `GET /users/:id`

Retrieves a user's profile information, including their submitted reviews.

*   **URL:** `/api/users/:id` (where `:id` is the User's ObjectId)
*   **Method:** `GET`
*   **Auth Required:** 🔐 (User must be authenticated and requesting their own profile, or be an admin)
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Content:** The user object with an embedded `reviews` array.
        ```json
        {
          "_id": "user_id",
          "username": "string",
          "email": "string",
          "profilePicture": "string", // or null/empty string
          "joinDate": "date_string",
          "role": "string", // "user" or "admin"
          "reviews": [
            {
              "_id": "review_id",
              "userId": "user_id", // Reference
              "movieId": {
                 "_id": "movie_id",
                 "title": "string",
                 "posterUrl": "string" // or null/empty string
              },
              "rating": number, // 1-5
              "reviewText": "string",
              "createdAt": "date_string",
              "updatedAt": "date_string"
            }
            // ... more reviews by this user
          ]
        }
        ```
*   **Error Responses:**
    *   **Code:** `401 UNAUTHORIZED` - If no valid JWT is provided.
    *   **Code:** `403 FORBIDDEN` - If the authenticated user is not the requested user and is not an admin.
    *   **Code:** `404 NOT FOUND` - If no user exists with the given `:id`.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.

#### `PUT /users/:id`

Updates a user's profile information.

*   **URL:** `/api/users/:id` (where `:id` is the User's ObjectId)
*   **Method:** `PUT`
*   **Auth Required:** 🔐 (User must be authenticated and updating their own profile)
*   **Data Params (Request Body):** (Send only fields to be updated)
    ```json
    {
      "username": "string",       // Optional
      "email": "string",          // Optional
      "profilePicture": "string"  // Optional
      // Note: password updates are typically handled via a separate endpoint
    }
    ```
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Content:** The updated user object (limited fields returned).
        ```json
        {
          "_id": "user_id",
          "username": "string",
          "email": "string",
          "profilePicture": "string", // or null/empty string
          "role": "string" // "user" or "admin"
        }
        ```
*   **Error Responses:**
    *   **Code:** `400 BAD REQUEST` - If validation fails (e.g., invalid email format).
    *   **Code:** `401 UNAUTHORIZED` - If no valid JWT is provided.
    *   **Code:** `403 FORBIDDEN` - If the authenticated user is not the requested user.
    *   **Code:** `404 NOT FOUND` - If no user exists with the given `:id`.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.

#### `GET /users/:id/watchlist`

Retrieves the authenticated user's watchlist.

*   **URL:** `/api/users/:id/watchlist` (where `:id` is the User's ObjectId)
*   **Method:** `GET`
*   **Auth Required:** 🔐 (User must be authenticated and requesting their own watchlist)
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Content:** An array of watchlist items, with populated movie details.
        ```json
        [
          {
            "_id": "watchlist_item_id",
            "userId": "user_id", // Reference
            "movieId": {
              "_id": "movie_id",
              "title": "string",
              "genre": ["string"],
              "releaseYear": number,
              "director": "string",
              "cast": ["string"],
              "synopsis": "string",
              "posterUrl": "string",
              "averageRating": number,
              "totalReviews": number
              // ... other movie fields
            },
            "createdAt": "date_string",
            "updatedAt": "date_string"
          }
          // ... more watchlist items
        ]
        ```
*   **Error Responses:**
    *   **Code:** `401 UNAUTHORIZED` - If no valid JWT is provided.
    *   **Code:** `403 FORBIDDEN` - If the authenticated user is not the requested user.
    *   **Code:** `404 NOT FOUND` - If no user exists with the given `:id`.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.

#### `POST /users/:id/watchlist`

Adds a movie to the authenticated user's watchlist.

*   **URL:** `/api/users/:id/watchlist` (where `:id` is the User's ObjectId)
*   **Method:** `POST`
*   **Auth Required:** 🔐 (User must be authenticated and adding to their own watchlist)
*   **Data Params (Request Body):**
    ```json
    {
      "movieId": "string" // Required, the ObjectId of the movie to add
    }
    ```
*   **Success Response:**
    *   **Code:** `201 CREATED`
    *   **Content:** The created watchlist item (with populated movie details).
        ```json
        {
          "_id": "watchlist_item_id",
          "userId": "user_id", // Reference
          "movieId": {
            "_id": "movie_id",
            "title": "string",
            "genre": ["string"],
            "releaseYear": number,
            "director": "string",
            "cast": ["string"],
            "synopsis": "string",
            "posterUrl": "string",
            "averageRating": number,
            "totalReviews": number
            // ... other movie fields
          },
          "createdAt": "date_string",
          "updatedAt": "date_string"
        }
        ```
*   **Error Responses:**
    *   **Code:** `400 BAD REQUEST` - If validation fails (e.g., missing `movieId`, movie already in watchlist).
    *   **Code:** `401 UNAUTHORIZED` - If no valid JWT is provided.
    *   **Code:** `403 FORBIDDEN` - If the authenticated user is not the requested user.
    *   **Code:** `404 NOT FOUND` - If no user or movie exists with the given IDs.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.

#### `DELETE /users/:id/watchlist/:movieId`

Removes a movie from the authenticated user's watchlist.

*   **URL:** `/api/users/:id/watchlist/:movieId` (where `:id` is the User's ObjectId, `:movieId` is the Movie's ObjectId)
*   **Method:** `DELETE`
*   **Auth Required:** 🔐 (User must be authenticated and removing from their own watchlist)
*   **Success Response:**
    *   **Code:** `200 OK`
    *   **Content:**
        ```json
        {
          "message": "Removed from watchlist"
        }
        ```
*   **Error Responses:**
    *   **Code:** `401 UNAUTHORIZED` - If no valid JWT is provided.
    *   **Code:** `403 FORBIDDEN` - If the authenticated user is not the requested user.
    *   **Code:** `404 NOT FOUND` - If no user exists with the given `:id`, or the movie is not found in the user's watchlist.
    *   **Code:** `500 INTERNAL SERVER ERROR` - If an unexpected error occurs.
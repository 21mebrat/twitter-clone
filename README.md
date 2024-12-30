# Twitter Clone

This is a Twitter Clone project built using the MERN stack (MongoDB, Express, React, and Node.js). The application replicates core functionalities of Twitter, including user authentication, posting tweets, following/unfollowing users, and real-time updates.

## Features

- User authentication (register/login/logout)
- Create, read, update, and delete tweets
- Follow/unfollow users
- Real-time updates for tweets and notifications
- Responsive design for all devices
- Profile customization
- Like and comment on tweets

## Tech Stack

### Frontend
- React.js
- Tailwind CSS 
- reactquery for state management

### Backend
- Node.js
- Express.js
- MongoDB (Database)
## Installation and Setup

### Prerequisites

- Node.js installed
- MongoDB database setup locally or using a cloud service (e.g., MongoDB Atlas)

### Clone the Repository
```bash
git clone https://github.com/21mebrat/twitter-clone.git
cd twitter-clone
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add the following environment variables:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add the following environment variable:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Access the Application

- Open your browser and go to `http://localhost:3000` to access the application.

## Project Structure

```
.
|-- backend
|   |-- controllers
|   |-- models
|   |-- routes
|   |-- middlewares
|   |-- server.js
|-- frontend
|   |-- public
|   |-- src
|       |-- components
|       |-- pages
|       |-- context
|       |-- App.js
|       |-- index.js
|-- README.md
```

## Scripts

### Backend
- `npm run dev`: Starts the server in development mode
- `npm run start`: Starts the server in production mode

### Frontend
- `npm start`: Starts the React development server
- `npm run build`: Builds the app for production

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request with your updates.

## Contact

For any questions or feedback, please contact:
- Name: Mebrat Matebie
- Email: [mebratmatebie@gmail.com]
- GitHub: [https://github.com/21mebrat](https://github.com/21mebrat)


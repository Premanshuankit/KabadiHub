📄 README.md
# ScrapFlow – MERN Scrap Management System

A full-stack MERN application that connects Buyers and Sellers for scrap trading.  
Built with secure authentication, cloud database, logging, and production deployment.

---

## Live Demo

Backend API: https://scrapwallah.onrender.com

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Joi Validation
- Winston Logging
- New Relic Monitoring

### Database
- MongoDB Atlas (Cloud Database)

### Deployment
- Render
- MongoDB Atlas (Cloud Storage)

## Features

- JWT-based Authentication
- Role-Based Access Control (Buyer / Seller)
- Scrap Listing Management
- Input Validation using Joi
- Schema Validation using Mongoose
- Structured Logging with Winston
- Performance Monitoring via New Relic
- Cloud Deployment (Render + Atlas)
- Environment-based Secret Management (used key vault on render)


---

## Installation (Local Development)

### Clone Repository


git clone https://github.com/Premanshuankit/ScrapWala.git  --> backend

cd folder_name


---

### Setup Backend


cd folder_name
npm install


Create `.env` file:

DATABASE_URI = your_mongodb_connection_string (with username, password and db name)
ACCESS_TOKEN_SECRET = your_secret
REFRESH_TOKEN_SECRET = your_secret
NEW_RELIC_LICENSE_KEY = your_key


Run backend:


npm start


---

### Setup Frontend

npm install
npm start


---

## Production Deployment

- Backend deployed on Render Web Service
- MongoDB hosted on MongoDB Atlas
- Secrets stored securely using Render Environment Variables

---

## Authentication Flow

1. User registers (Buyer / Seller)
2. Password hashed using bcrypt
3. Login returns:
   - Access Token (short-lived)
4. Protected routes verified using JWT middleware

---

## Logging & Monitoring

- Winston used for structured JSON logging
- New Relic APM integrated for:
  - Performance monitoring
  - Error tracking
  - Log forwarding

---

## Future Improvements

- Add scrap bidding system
- Add payment integration
- Add admin dashboard
- Add rate limiting
- Add email verification
- Add mobile verification

---

## Author

Premanshu Ankit  
Full Stack Developer | MERN Stack
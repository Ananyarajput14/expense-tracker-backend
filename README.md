# Expense Tracker Backend (MERN Stack)

Backend API for **Expense Tracker** built with the MERN stack.  
Handles user authentication, expense & income management, and provides Excel export functionality.

---

## About

This backend powers the Expense Tracker app. Users can:

- Register and log in securely  
- Add, update, delete, and fetch expense and income records  
- Download income and expense reports as Excel sheets  
- View summarized financial data  

---

## Tech Stack

- **MongoDB** – NoSQL database for storing users, expenses, and income data  
- **Express.js** – Web framework for handling routes and APIs  
- **React** – Frontend (consumes this backend API)  
- **Node.js** – Runtime environment for the server  
- **JWT** – User authentication  
- **bcrypt** – Password hashing  
- **dotenv** – Environment variable management  
- **exceljs** – Export financial data to Excel  
- **cors, express-validator** – Middleware for security and validation  

---

## Features

- **User Authentication**: Registration, login, JWT-based protected routes  
- **Expense & Income CRUD**: Full management of financial records  
- **Excel Export**: Download detailed income and expense reports as `.xlsx` files  
- **Database Integration**: MongoDB persistence  
- **Secure Routes**: Only authenticated users can access sensitive endpoints  


git clone https://github.com/Ananyarajput14/expense-tracker-backend.git
cd expense-tracker-backend

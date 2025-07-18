# 🚢 Cruise Ship Management System

A web-based Cruise Ship Management System built with React and Firebase, designed to handle operations like ship booking, crew management, scheduling, and more — with a focus on security and modular design.

---

## 🚀 Features

- Firebase Authentication for secure login/logout
- Firestore Database for managing ship and passenger data
- Role-based access control (Admin, Staff, Voyager)
- Environment-based Firebase configuration using `.env`
- Responsive UI built with modern React practices

---

## ⚙️ Tech Stack

- **Frontend**: React, JavaScript
- **Backend/Database**: Firebase (Auth + Firestore)
- **Other**: Firebase Hosting, `.env` config, Git & GitHub

---

## 🔐 Firebase Environment Setup

To run this project locally, you must provide Firebase configuration values via environment variables.

### Step 1: Create a `.env` file in the root of the project

REACT_APP_API_KEY=your-api-key
REACT_APP_AUTH_DOMAIN=your-auth-domain
REACT_APP_PROJECT_ID=your-project-id
REACT_APP_STORAGE_BUCKET=your-storage-bucket
REACT_APP_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_APP_ID=your-app-id


> ⚠️ These values can be found in your Firebase project settings.

### Step 2: Install dependencies and run the app

```bash
npm install
npm start

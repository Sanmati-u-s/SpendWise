# SpendWise - Personal Expenses Tracker

A modern, intuitive, and feature-rich personal expense tracking application built to help you manage your finances efficiently.

![SpendWise Screenshots](https://via.placeholder.com/800x400?text=SpendWise+App+Screenshot)

## 🚀 Key Features

### 🔐 Authentication & User Profile

- **Secure Signup**: Create an account with a unique **Username** and Email.
- **Easy Login**: Access your dashboard securely using your Email and Password.
- **Personalized Dashboard**: Displays your chosen username for a personal touch.

### 📊 Visual Data Analytics

- **Category Distribution**: Interactive **Donut Chart** visualization of your spending habits.
- **Monthly Trends**: **Bar Chart** showing your spending history over the last 12 months.
- **Spending Summary**: Real-time calculation of your total expenses.

### 🎨 Modern UI & Experimentation

- **Glassmorphism Design**: Sleek, translucent cards with vibrant background gradients.
- **Dark Mode**: Fully supported dark theme for comfortable night-time usage.
- **Responsive Layout**: Works seamlessly on desktops, tablets, and mobile devices.
- **Interactive Elements**: Smooth animations, hover effects, and custom-styled inputs.

### 📅 Expense Management

- **CRUD Operations**: Easily **Add**, **Edit**, and **Delete** expenses.
- **Smart Categorization**: Auto-assigned emojis for categories (🍔 Food, 🚗 Transport, etc.).
- **Filtering**: View expenses for specific months or see your entire history.

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 (Variables & Flexbox/Grid).
- **Backend / Database**: Firebase Firestore (NoSQL).
- **Authentication**: Firebase Authentication.
- **Build Tool**: Vite.
- **Libraries**: `Chart.js` for data visualization.

## ⚙️ Setup & Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/spendwise-tracker.git
   cd spendwise-tracker
   ```
2. **Install Dependencies**:

   ```bash
   npm install
   ```
3. **Configure Firebase**:

   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Create a web app and copy your configuration.
   - Update `src/firebase.js` with your config keys.
   - **Firestore Rules**: Ensure your Firestore rules allow read/write for authenticated users.
4. **Run Development Server**:

   ```bash
   npm run dev
   ```
5. **Build for Production**:

   ```bash
   npm run build
   ```

## 🛡️ Firestore Security Rules

To ensure the application functions correctly, use the following security rules in your Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for login (if using username login flow)
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Secure expenses
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
  }
}
```

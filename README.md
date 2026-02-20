# SpendWise - Personal Expenses Tracker
A modern and intuitive personal expense tracking application built to help you manage your finances efficiently.

>Note: This project is still under active development!

## 🚀 Key Features

### 🔐 Authentication & User Profile

- **Secure Signup**: Create an account with a unique **Username** and **Email**.
- **Easy Login**: Access your dashboard securely using your Email and Password.

### 📊 Visual Data Analytics

- **Category Distribution**: Interactive **Donut Chart** visualization of your spending habits.
- **Monthly Trends**: **Bar Chart** showing your spending history over the last 12 months.
- **Spending Summary**: Real-time calculation of your total expenses.

### 🎨 Modern UI & Experimentation

- **Responsive Layout**: Works seamlessly on desktops, tablets, and mobile devices.

### 💸 Expense Management

- **CRUD Operations**: Easily **Add**, **Edit**, and **Delete** expenses.
- **Catergorization**: Add expenses with description, amount, category, and date
- **Real-time data synchronization**: Using Firestore listeners
- **Filtering**: View expenses for specific months or see your entire history.

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 (Variables & Flexbox/Grid).
- **Backend / Database**: Firebase Firestore (NoSQL).
- **Authentication**: Firebase Authentication.
- **Build Tool**: Vite.
- **Libraries**: `Chart.js` for data visualization.

### Deployment

- Vercel

### 🚀 Live Demo

https://personal-expenses-tracker-gamma.vercel.app/

## ⚙️ Setup & Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Sanmati-u-s/SpendWise.git
   cd SpendWise
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

## 🔮 Future Directions / Future Scope

To take **SpendWise** to the next level, the following features are planned for future updates, categorized by complexity and impact:

### Level 1: Essential Enhancements

* **Income Section**:
  * Track income separate from expenses.
  * Bar chart to show monthly income & expenses.
* **Budget Goals & Alerts**:
  * Set monthly spending limits(e.g., "Feb: Rs.500").
  * Visual progress bars and color-coded alerts when approaching or exceeding limits.
* **Data Export (CSV/PDF)**:
  * One-click download of transaction history as CSV or PDF files.
  * Useful for external analysis, tax preparation, or backup.
* **Social Login**:
  * Quick and secure sign-in using Google accounts to simplify the onboarding process.

### Level 2: Advanced Intelligence & Search

* **AI Spending Insights**:
  * Smart text summaries analyzing spending patterns (e.g., "You spent 20% more on dining out this month compared to last month").
  * Personalized recommendations for saving money based on historical data.
* **Search & Advanced Filtering**:
  * Global search bar to find transactions by keyword (e.g., "Starbucks", "Uber").
  * Custom date range filters and multi-category selection for detailed analysis.

### Level 3: Pro Features & Engagement

* **Gamification**:
  * Award badges and achievements for reaching financial milestones (e.g., "Savings Saver", "7-Day Streak").
  * Encourage consistent tracking through positive reinforcement.
* **Progressive Web App (PWA)**:
  * Installable as a native-like app on mobile devices (iOS/Android).
  * Offline capabilities to view data even without an internet connection.

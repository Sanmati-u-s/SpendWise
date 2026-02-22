# SpendWise - Personal Expenses Tracker

A simple tool to help you track your spending and manage your everyday better.

## 🚀 Live Demo

**[Visit SpendWise](https://personal-expenses-tracker-gamma.vercel.app/)**

## 🚀 Key Features

### 💸 Transactions

- **Add Transaction**: Add Income / Expense with description, category, amount and date.
- **Search & Filter**: Find any transaction instantly by typing its name.
- **Delete & Update**: Click on any transaction to update & hover to view delete option / select multiple transactions to delete.

### 📊 Visual Dashboard

- **Interactive Charts**: A clear breakdown of your spending by category.
- **Spending Trends**: Track your income and expenses over the last 12 months.
- **Live Stats**: Real-time view of your balance, total earnings, and spending.

### 💡 Smart Insights

- **Monthly Comparisons**: Know exactly if you're spending more or less than last month.
- **Top Categories**: Automatically identifies where most of your money is going.
- **Power Tips**: Personalized advice based on your current budget and savings.

### 📅 Budgeting & Control

- **Custom Limits**: Set a unique spending goal for every month.
- **Progress Alerts**: Get visual warnings as you approach your budget limit.

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript.
- **Charts**: Chart.js.
- **Database**: Firebase (Auth & Firestore).

## ⚙️ Setup

Follow these steps to get a local copy of SpendWise up and running:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Sanmati-u-s/SpendWise.git
   cd SpendWise
   ```
2. **Install Dependencies**:
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:

   ```bash
   npm install
   ```
3. **Configure Firebase**:

   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Add a "Web App" to your project and copy the `firebaseConfig` object.
   - Open `src/firebase.js` and update it with your configuration keys.
   - Enable **Authentication** (Email/Password) and **Cloud Firestore**.
4. **Initialize Firestore**:

   - Create a Firestore Database in "Test Mode" or apply the recommended security rules (see below).
5. **Run the Development Server**:

   ```bash
   npm run dev
   ```

## 🔮 Future Directions

* **Data Export**: One-click download of your transaction history as CSV or PDF.
* **Social Auth**: Support for Google and Apple sign-in.
* **Gamification**: Badges and achievements for hitting savings milestones.
* **PWA**: Installable mobile app with offline capabilities.

# SpendWise — Personal Expense Tracker (v2)

SpendWise is a modern personal finance web app for tracking income and expenses, visualizing spending patterns, and managing monthly budgets with smart feedback.

## Live Demo

- App: **https://personal-expenses-tracker-gamma.vercel.app/**

## What's New in v2

- Refreshed dashboard experience with cleaner layout and improved visual hierarchy.
- Monthly budget progress with warnings and contextual messaging.
- Category, trend, and income-vs-expense chart tabs for faster analysis.
- Bulk-select and search workflows for transaction management.
- Light/Dark theme toggle with persisted user preference.

## Core Features

### Authentication
- Email/password signup and login with Firebase Authentication.
- Session persistence configured for browser session usage.

### Transactions
- Add income or expense transactions.
- Edit and delete existing entries.
- Search transactions by text.
- Multi-select transactions for bulk deletion.

### Insights & Analytics
- Real-time totals for balance, income, and expenses.
- Category distribution chart.
- Monthly trends chart.
- Income vs expense comparison chart.

### Budgeting
- Set month-wise budget limits.
- Visual budget progress indicator.
- Dynamic status and warning message on over-spend.

### UX
- Responsive interface.
- Personalized greeting on dashboard.
- Theme support (light/dark) with local preference storage.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vite)
- **Charts:** Chart.js
- **Backend Services:** Firebase Authentication + Cloud Firestore

## Project Setup

### 1) Clone repository

```bash
git clone https://github.com/Sanmati-u-s/SpendWise.git
cd SpendWise
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure Firebase

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a Web App and copy the Firebase config object.
3. Update `src/firebase.js` with your project credentials.
4. Enable:
   - Authentication (Email/Password)
   - Cloud Firestore

### 4) Run locally

```bash
npm run dev
```

### 5) Build for production

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run preview` — preview production build locally

## Suggested Roadmap

- CSV/PDF transaction export
- Recurring transactions
- Category budget caps
- Social login providers
- PWA + offline mode

## License

This project is licensed under the terms of the [LICENSE](./LICENSE) file.

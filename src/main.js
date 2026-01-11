import './style.css';
import { initAuth, registerUser, loginUser, logoutUser } from './auth';
import { addExpense, subscribeToExpenses } from './db';
import { renderLogin, renderSignup, renderDashboard } from './ui';

const app = document.querySelector('#app');

// State
let currentUser = null;
let expensesCleanup = null;

// Initialization
initAuth((user) => {
  currentUser = user;
  if (user) {
    showDashboard(user);
  } else {
    showLogin();
  }
});

// Navigation Functions
function showLogin() {
  if (expensesCleanup) expensesCleanup();
  app.innerHTML = renderLogin();

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await loginUser(email, password);
    } catch (error) {
      alert(error.message);
    }
  });

  document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    showSignup();
  });
}

function showSignup() {
  app.innerHTML = renderSignup();

  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await registerUser(email, password);
    } catch (error) {
      alert(error.message);
    }
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });
}

function showDashboard(user) {
  app.innerHTML = renderDashboard(user);

  // Setup Logout
  document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
  });

  // Setup Add Expense Modal
  const modal = document.getElementById('add-expense-modal');
  const addBtn = document.getElementById('add-expense-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('add-expense-form');

  addBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const expense = {
      description: e.target.description.value,
      amount: parseFloat(e.target.amount.value),
      category: e.target.category.value,
      date: e.target.date.value
    };

    try {
      await addExpense(user.uid, expense);
      modal.classList.remove('active');
      form.reset();
    } catch (error) {
      console.error("Error adding expense: ", error);
      alert("Failed to add expense");
    }
  });

  // Load Expenses
  const listContainer = document.getElementById('expenses-list');
  const totalAmountEl = document.getElementById('total-amount');

  expensesCleanup = subscribeToExpenses(user.uid, (expenses) => {
    listContainer.innerHTML = '';
    let total = 0;

    if (expenses.length === 0) {
      listContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No expenses yet. Add one!</p>';
    }

    expenses.forEach(exp => {
      total += exp.amount;
      const el = document.createElement('div');
      el.className = 'expense-item';
      el.innerHTML = `
        <div class="expense-info">
          <h4>${exp.description}</h4>
          <p class="date">${new Date(exp.date).toLocaleDateString()}</p>
          <span class="expense-category">${exp.category}</span>
        </div>
        <div class="expense-right">
          <span class="expense-amount">Rs. ${exp.amount.toFixed(2)}</span>
        </div>
      `;
      listContainer.appendChild(el);
    });

    totalAmountEl.textContent = `Rs. ${total.toFixed(2)}`;
  });
}

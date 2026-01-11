import './style.css';
import { initAuth, registerUser, loginUser, logoutUser } from './auth';
import { addExpense, subscribeToExpenses, deleteExpense, updateExpense } from './db';
import { renderLogin, renderSignup, renderDashboard } from './ui';
import Chart from 'chart.js/auto';

const app = document.querySelector('#app');

// State
let currentUser = null;
let expensesCleanup = null;
let currentEditingId = null;

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
    form.reset();
    currentEditingId = null;
    document.querySelector('#add-expense-modal h3').textContent = 'Add New Expense';
    document.querySelector('#add-expense-form button[type="submit"]').textContent = 'Add Expense';
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
      if (currentEditingId) {
        await updateExpense(currentEditingId, expense);
      } else {
        await addExpense(user.uid, expense);
      }
      modal.classList.remove('active');
      form.reset();

      // Reset Edit State
      currentEditingId = null;
      document.querySelector('#add-expense-modal h3').textContent = 'Add New Expense';
      document.querySelector('#add-expense-form button[type="submit"]').textContent = 'Add Expense';
    } catch (error) {
      console.error("Error saving expense: ", error);
      alert("Failed to save expense");
    }
  });

  // Load Expenses
  const listContainer = document.getElementById('expenses-list');
  const totalAmountEl = document.getElementById('total-amount');
  const filterSelect = document.getElementById('date-filter');

  let allExpenses = [];

  // Chart Instances
  let pieChart = null;
  let barChart = null;

  const updateCharts = (currentExpenses, allExpenses) => {
    const pieCtx = document.getElementById('pie-chart');
    const barCtx = document.getElementById('bar-chart');

    // 1. Pie Chart Logic (Uses current filtered data)
    const categoryCounts = {};
    currentExpenses.forEach(exp => {
      if (categoryCounts[exp.category]) categoryCounts[exp.category] += exp.amount;
      else categoryCounts[exp.category] = exp.amount;
    });

    const pieData = {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6'],
        borderWidth: 0
      }]
    };

    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: pieData,
      options: {
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%'
      }
    });

    // 2. Bar Chart Logic (Uses LAST 6 MONTHS regardless of filter)
    const monthlyTotals = {};
    const today = new Date();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('default', { month: 'short' });
      monthlyTotals[monthYear] = 0;
      last6Months.push({ key: monthYear, label: label });
    }

    allExpenses.forEach(exp => {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyTotals.hasOwnProperty(key)) {
        monthlyTotals[key] += exp.amount;
      }
    });

    const barData = {
      labels: last6Months.map(m => m.label),
      datasets: [{
        label: 'Monthly Spending',
        data: last6Months.map(m => monthlyTotals[m.key]),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      }]
    };

    if (barChart) barChart.destroy();
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: barData,
      options: {
        scales: {
          y: { beginAtZero: true, grid: { display: false } },
          x: { grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });
  };

  const renderExpenses = () => {
    const filterValue = filterSelect.value;
    let filteredExpenses = allExpenses;

    if (filterValue !== 'all') {
      filteredExpenses = allExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        const monthYear = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
        return monthYear === filterValue;
      });
    }

    // Update Charts
    updateCharts(filteredExpenses, allExpenses);

    listContainer.innerHTML = '';
    let total = 0;
    const categoryTotals = {};

    if (filteredExpenses.length === 0) {
      listContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No expenses found for this period.</p>';
    }

    filteredExpenses.forEach(expense => {
      // Ensure number
      expense.amount = parseFloat(expense.amount);
      total += expense.amount;

      // Category Calculation
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }

      const el = document.createElement('div');
      el.className = 'expense-item';
      el.innerHTML = `
        <div class="expense-info">
          <h4>${expense.description}</h4>
          <p class="date">${new Date(expense.date).toLocaleDateString()}</p>
          <span class="expense-category">${expense.category}</span>
        </div>
        <div class="expense-right">
          <span class="expense-amount">Rs. ${expense.amount.toFixed(2)}</span>
          <div class="expense-actions">
            <button class="btn-icon btn-edit" title="Edit">✎</button>
            <button class="btn-icon btn-delete" title="Delete">🗑</button>
          </div>
        </div>
      `;

      // Attach Listeners
      el.querySelector('.btn-delete').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this expense?')) {
          try {
            await deleteExpense(expense.id);
          } catch (error) {
            console.error("Error deleting expense: ", error);
            alert("Failed to delete expense");
          }
        }
      });

      el.querySelector('.btn-edit').addEventListener('click', () => {
        currentEditingId = expense.id;
        form.description.value = expense.description;
        form.amount.value = expense.amount;
        form.category.value = expense.category;
        form.date.value = expense.date;

        document.querySelector('#add-expense-modal h3').textContent = 'Edit Expense';
        document.querySelector('#add-expense-form button[type="submit"]').textContent = 'Update Expense';
        modal.classList.add('active');
      });

      listContainer.appendChild(el);
    });

    totalAmountEl.textContent = `Rs. ${total.toFixed(2)}`;

    // Render Category Breakdown
    const categoryContainer = document.getElementById('category-breakdown');
    if (categoryContainer) {
      categoryContainer.innerHTML = '';
      Object.keys(categoryTotals).forEach(category => {
        const catTotal = categoryTotals[category];
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
          <h3>${category}</h3>
          <div class="value" style="font-size: 1.5rem;">Rs. ${catTotal.toFixed(2)}</div>
        `;
        categoryContainer.appendChild(card);
      });
    }
  };

  const updateFilterOptions = () => {
    const currentSelection = filterSelect.value;
    const dates = new Set();

    allExpenses.forEach(exp => {
      const d = new Date(exp.date);
      if (!isNaN(d.getTime())) {
        dates.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }
    });

    const sortedDates = Array.from(dates).sort().reverse();

    filterSelect.innerHTML = '<option value="all">All Time</option>';
    sortedDates.forEach(dateStr => {
      const [year, month] = dateStr.split('-');
      const dateObj = new Date(year, month - 1);
      const label = dateObj.toLocaleDateString('default', { month: 'long', year: 'numeric' });

      const option = document.createElement('option');
      option.value = dateStr;
      option.textContent = label;
      filterSelect.appendChild(option);
    });

    // Restore selection if it still exists
    if (Array.from(filterSelect.options).some(opt => opt.value === currentSelection)) {
      filterSelect.value = currentSelection;
    }
  };

  filterSelect.addEventListener('change', renderExpenses);

  expensesCleanup = subscribeToExpenses(user.uid, (expenses) => {
    allExpenses = expenses;
    updateFilterOptions();
    renderExpenses();
  });
}
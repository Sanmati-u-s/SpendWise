import './style.css';
import { initAuth, registerUser, loginUser, logoutUser } from './auth';
import { addExpense, subscribeToExpenses, deleteExpense, updateExpense, setMonthlyBudget, subscribeToBudget } from './db';
import { renderLogin, renderSignup, renderDashboard } from './ui';
import Chart from 'chart.js/auto';

const app = document.querySelector('#app');

// State
let currentUser = null;
let expensesCleanup = null;
let budgetCleanup = null;
let currentEditingId = null;
let currentBudgetLimit = null;

// Theme Management
const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Initialize Theme
setTheme(getPreferredTheme());

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
  if (budgetCleanup) budgetCleanup();
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

  // Theme Toggle Logic
  const themeInput = document.getElementById('theme-toggle-input');
  if (themeInput) {
    themeInput.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    themeInput.addEventListener('change', (e) => setTheme(e.target.checked ? 'dark' : 'light'));
  }
}

function showSignup() {
  app.innerHTML = renderSignup();

  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value; // Get username
    try {
      await registerUser(username, email, password);
      // Reload to ensure displayName is updated in the UI
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });

  // Theme Toggle Logic
  const themeInput = document.getElementById('theme-toggle-input');
  if (themeInput) {
    themeInput.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    themeInput.addEventListener('change', (e) => setTheme(e.target.checked ? 'dark' : 'light'));
  }
}

function showDashboard(user) {
  app.innerHTML = renderDashboard(user);

  // Theme Toggle Logic
  const themeInput = document.getElementById('theme-toggle-input');
  const updateThemeState = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeInput.checked = currentTheme === 'dark';
  };
  updateThemeState();

  themeInput.addEventListener('change', (e) => {
    const newTheme = e.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
  });

  // Setup Logout
  document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
  });

  // Setup Add Expense/Income Modals
  const modal = document.getElementById('add-expense-modal');
  const addExpenseBtn = document.getElementById('add-expense-btn');
  const addIncomeBtn = document.getElementById('add-income-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('add-expense-form');

  const openModal = (type) => {
    modal.classList.add('active');
    const titleEl = document.querySelector('#add-expense-modal h3');
    const submitBtn = document.querySelector('#add-expense-form button[type="submit"]');

    if (type === 'income') {
      titleEl.textContent = 'Add New Income';
      submitBtn.textContent = 'Add Income';
      form.type.value = 'income';
    } else {
      titleEl.textContent = 'Add New Expense';
      submitBtn.textContent = 'Add Expense';
      form.type.value = 'expense';
    }
  };

  if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', () => {
      openModal('expense');
    });
  }

  if (addIncomeBtn) {
    addIncomeBtn.addEventListener('click', () => {
      openModal('income');
    });
  }

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
      date: e.target.date.value,
      type: e.target.type.value // 'income' or 'expense'
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
      document.querySelector('#add-expense-modal h3').textContent = 'Add New Transaction';
      document.querySelector('#add-expense-form button[type="submit"]').textContent = 'Add Transaction';
    } catch (error) {
      console.error("Error saving expense: ", error);
      alert("Failed to save transaction");
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

    // Milder Pastel Palette matching the theme
    // Expanded to 12 colors for the bar chart
    const pastelColors = [
      '#60a5fa', // Blue
      '#34d399', // Emerald
      '#fbbf24', // Amber
      '#f87171', // Red
      '#818cf8', // Indigo
      '#c084fc', // Purple
      '#22d3ee', // Cyan
      '#f472b6', // Pink
      '#a3e635', // Lime
      '#fb923c', // Orange
      '#2dd4bf', // Teal
      '#38bdf8'  // Sky
    ];

    const pieData = {
      labels: Object.keys(categoryCounts),
      datasets: [{
        data: Object.values(categoryCounts),
        backgroundColor: pastelColors,
        borderWidth: 2,
        borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1e293b' : '#ffffff',
        hoverOffset: 4
      }]
    };

    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: pieData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                family: "'Outfit', sans-serif",
                size: 13,
                weight: '500'
              },
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
            }
          }
        },
        cutout: '70%', /* Slightly thicker */
        layout: {
          padding: 10
        },
        elements: {
          arc: {
            borderRadius: 8
          }
        }
      }
    });

    // 2. Bar Chart Logic (Uses LAST 12 MONTHS regardless of filter)
    const monthlyTotals = {};
    const today = new Date();
    const last12Months = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('default', { month: 'short' });
      monthlyTotals[monthYear] = 0;
      last12Months.push({ key: monthYear, label: label });
    }

    allExpenses.forEach(exp => {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyTotals.hasOwnProperty(key)) {
        monthlyTotals[key] += exp.amount;
      }
    });

    const barData = {
      labels: last12Months.map(m => m.label),
      datasets: [{
        label: 'Monthly Spending',
        data: last12Months.map(m => monthlyTotals[m.key]),
        backgroundColor: pastelColors, /* Use the colorful palette */
        borderRadius: 6,
        barPercentage: 0.9,
        categoryPercentage: 0.9
      }]
    };

    if (barChart) barChart.destroy();
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: barData,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false, /* Fix spacing/aspect ratio */
        layout: {
          padding: {
            bottom: 0,
            top: 0
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: false, drawBorder: false },
            ticks: { autoSkip: false, font: { family: "'Outfit', sans-serif" } }
          },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { font: { family: "'Outfit', sans-serif" } }
          }
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
        // exp.date is YYYY-MM-DD. filterValue is YYYY-MM.
        return exp.date.startsWith(filterValue);
      });
    }

    // Calculate Totals
    const incomeTotal = filteredExpenses
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const expenseTotal = filteredExpenses
      .filter(t => t.type !== 'income') // Default to expense if missing
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const balance = incomeTotal - expenseTotal;

    // Update Overview Cards
    const balanceEl = document.getElementById('balance-amount');
    const incomeEl = document.getElementById('income-amount');
    const expensesEl = document.getElementById('total-amount');

    if (balanceEl) balanceEl.textContent = `₹ ${balance.toFixed(2)}`;
    if (incomeEl) incomeEl.textContent = `₹ ${incomeTotal.toFixed(2)}`;
    if (expensesEl) expensesEl.textContent = `₹ ${expenseTotal.toFixed(2)}`;


    // Update Charts (ONLY Expenses)
    const expenseOnlyData = filteredExpenses.filter(t => t.type !== 'income');
    updateCharts(expenseOnlyData, allExpenses.filter(t => t.type !== 'income'));

    listContainer.innerHTML = '';

    if (filteredExpenses.length === 0) {
      listContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No transactions found for this period.</p>';
    }

    // Category Totals for Expense Breakdown
    const categoryTotals = {};
    expenseOnlyData.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    filteredExpenses.forEach(expense => {
      // Ensure number
      expense.amount = parseFloat(expense.amount);
      const isIncome = expense.type === 'income';

      // Emoji Mapper (Keep for transaction list for now, or update to icons too? Let's keep emojis for the list as they are compact)
      const getCategoryEmoji = (cat) => {
        const lowerCat = cat.toLowerCase();
        // Income
        if (lowerCat.includes('salary')) return '💰';
        if (lowerCat.includes('freelance')) return '💻';
        if (lowerCat.includes('invest')) return '📈';
        if (lowerCat.includes('gift')) return '🎁';

        // Expenses
        if (lowerCat.includes('food')) return '🍔';
        if (lowerCat.includes('transport')) return '🚗';
        if (lowerCat.includes('utility') || lowerCat.includes('bill')) return '💡';
        if (lowerCat.includes('game') || lowerCat.includes('entertainment')) return '🎮';
        if (lowerCat.includes('health')) return '🏥';
        if (lowerCat.includes('shop')) return '🛍️';
        return isIncome ? '💵' : '💸';
      };

      const emoji = getCategoryEmoji(expense.category);
      const amountClass = isIncome ? 'text-success' : 'text-danger';
      const sign = isIncome ? '+' : '-';

      const el = document.createElement('div');
      el.className = 'expense-item';
      // Add border color based on type
      el.style.borderLeftColor = isIncome ? 'var(--success-color)' : 'var(--danger-color)';

      el.innerHTML = `
        <div class="expense-info">
          <h4>${expense.description}</h4>
          <p class="date">${new Date(expense.date).toLocaleDateString('en-GB')}</p>
          <span class="expense-category">${emoji} ${expense.category}</span>
        </div>
        <div class="expense-right">
          <span class="expense-amount ${amountClass}">${sign} Rs. ${expense.amount.toFixed(2)}</span>
          <div class="expense-actions">
            <button class="btn-icon btn-edit" title="Edit">✎</button>
            <button class="btn-icon btn-delete" title="Delete">🗑</button>
          </div>
        </div>
      `;

      // Attach Listeners
      el.querySelector('.btn-delete').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this transaction?')) {
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

        // Set Type
        if (expense.type) {
          form.type.value = expense.type;
        } else {
          form.type.value = 'expense';
        }

        document.querySelector('#add-expense-modal h3').textContent = 'Edit Transaction';
        document.querySelector('#add-expense-form button[type="submit"]').textContent = 'Update Transaction';
        modal.classList.add('active');
      });

      listContainer.appendChild(el);
    });

    // Render Category Breakdown (Expenses Only) - NEW PRO STYLE
    const categoryContainer = document.getElementById('category-breakdown');
    if (categoryContainer) {
      categoryContainer.innerHTML = '';

      // Calculate Total Expenses again to be sure (for percentages)
      const totalExp = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

      const categoryList = document.createElement('div');
      categoryList.className = 'category-list';
      categoryList.style.display = 'flex';
      categoryList.style.flexDirection = 'column';
      categoryList.style.gap = '1rem';

      Object.keys(categoryTotals).forEach(category => {
        const catTotal = categoryTotals[category];
        const percent = totalExp > 0 ? (catTotal / totalExp) * 100 : 0;

        // Icon Mapping (Bootstrap Icons)
        let iconClass = 'bi-wallet2';
        const lowerCat = category.toLowerCase();
        let colorClass = 'bg-secondary';

        if (lowerCat.includes('food')) { iconClass = 'bi-basket'; colorClass = 'bg-warning'; }
        else if (lowerCat.includes('transport')) { iconClass = 'bi-car-front'; colorClass = 'bg-info'; }
        else if (lowerCat.includes('utility') || lowerCat.includes('bill')) { iconClass = 'bi-lightning-charge'; colorClass = 'bg-warning'; }
        else if (lowerCat.includes('game') || lowerCat.includes('entertainment')) { iconClass = 'bi-controller'; colorClass = 'bg-primary'; }
        else if (lowerCat.includes('health')) { iconClass = 'bi-heart-pulse'; colorClass = 'bg-danger'; }
        else if (lowerCat.includes('shop')) { iconClass = 'bi-bag'; colorClass = 'bg-primary'; }
        else if (lowerCat.includes('home') || lowerCat.includes('rent')) { iconClass = 'bi-house-door'; colorClass = 'bg-info'; }

        const item = document.createElement('div');
        item.className = 'category-list-item';
        item.innerHTML = `
            <div class="d-flex align-items-center mb-1 justify-content-between">
                <div class="d-flex align-items-center gap-2">
                    <div class="item-icon ${colorClass} bg-opacity-10 text-body p-2 rounded" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                         <i class="bi ${iconClass}"></i>
                    </div>
                    <span class="fw-medium">${category}</span>
                </div>
                <div class="text-end">
                    <div class="fw-bold">₹ ${catTotal.toFixed(2)}</div>
                    <div class="small text-secondary">${percent.toFixed(1)}%</div>
                </div>
            </div>
         `;
        categoryList.appendChild(item);
      });

      const card = document.createElement('div');
      card.className = 'breakdown-card w-100'; // Custom class for distinct styling
      card.innerHTML = `<h3 class="mb-3">Expense Breakdown</h3>`;
      card.appendChild(categoryList);

      categoryContainer.innerHTML = ''; // Clear previous
      categoryContainer.appendChild(card);
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

  // Budget Logic
  let currentBudgetMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  let allBudgets = {};

  const budgetMonthSelect = document.getElementById('budget-month-select');

  const updateBudgetMonthOptions = () => {
    if (!budgetMonthSelect) return;

    const distinctMonths = new Set();
    distinctMonths.add(new Date().toISOString().slice(0, 7)); // Ensure current month is always there

    // Add months from expenses
    allExpenses.forEach(e => distinctMonths.add(e.date.slice(0, 7)));

    // Add months from budgets
    Object.keys(allBudgets).forEach(m => distinctMonths.add(m));

    const sortedMonths = Array.from(distinctMonths).sort().reverse();

    budgetMonthSelect.innerHTML = '';
    sortedMonths.forEach(month => {
      const [y, m] = month.split('-');
      const label = new Date(y, m - 1).toLocaleDateString('default', { month: 'long', year: 'numeric' });
      const opt = document.createElement('option');
      opt.value = month;
      opt.textContent = label;
      budgetMonthSelect.appendChild(opt);
    });

    budgetMonthSelect.value = currentBudgetMonth;
  };

  if (budgetMonthSelect) {
    budgetMonthSelect.addEventListener('change', (e) => {
      currentBudgetMonth = e.target.value;
      updateBudgetUI();
    });
  }

  const updateBudgetUI = () => {
    const budgetCard = document.querySelector('.budget-overview');
    if (!budgetCard) return;

    const limit = allBudgets[currentBudgetMonth] || 0;

    if (limit === 0) {
      document.getElementById('budget-status-text').textContent = 'No budget set for this month';
      document.getElementById('budget-percentage').textContent = '';
      document.getElementById('budget-progress-bar').style.width = '0%';
      document.getElementById('budget-warning').style.display = 'none';
      return;
    }

    // Calculate total expenses for SELECTED MONTH
    // currentBudgetMonth is YYYY-MM

    const currentMonthExpenses = allExpenses
      .filter(t => t.type !== 'income') // Only expenses
      .filter(t => {
        // Robust string check: YYYY-MM-DD starts with YYYY-MM
        return t.date.startsWith(currentBudgetMonth);
      })
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const percentage = Math.min((currentMonthExpenses / limit) * 100, 100);
    const isOverBudget = currentMonthExpenses > limit;

    // Update Text
    const remaining = Math.max(limit - currentMonthExpenses, 0);
    document.getElementById('budget-status-text').innerHTML = `
        <span style="display: block; margin-bottom: 2px;">Spent: ₹ ${currentMonthExpenses.toFixed(2)} / ₹ ${limit.toFixed(2)}</span>
        <span style="font-size: 0.85rem; color: ${remaining < (limit * 0.2) ? 'var(--danger-color)' : 'var(--success-color)'};">
            Remaining: ₹ ${remaining.toFixed(2)}
        </span>
    `;
    document.getElementById('budget-percentage').textContent = `${Math.round((currentMonthExpenses / limit) * 100)}%`;

    // Update Bar Color & Width
    const progressBar = document.getElementById('budget-progress-bar');
    progressBar.style.width = `${percentage}%`;

    let color = 'var(--success-color)';
    if (percentage > 50) color = '#fbbf24'; // Warning (Yellow/Orange)
    if (percentage > 90) color = 'var(--danger-color)'; // Danger (Red)

    progressBar.style.backgroundColor = color;

    // Warning Text
    const warningEl = document.getElementById('budget-warning');
    if (isOverBudget) {
      warningEl.style.display = 'block';
    } else {
      warningEl.style.display = 'none';
    }
  };

  // Budget Modal Listeners
  const budgetModal = document.getElementById('edit-budget-modal');
  const editBudgetBtn = document.getElementById('edit-budget-btn');
  const closeBudgetBtn = document.getElementById('close-budget-modal-btn');
  const budgetForm = document.getElementById('edit-budget-form');

  if (editBudgetBtn) {
    editBudgetBtn.addEventListener('click', () => {
      budgetModal.classList.add('active');
      budgetForm.month.value = currentBudgetMonth;
      if (allBudgets[currentBudgetMonth]) {
        budgetForm.limit.value = allBudgets[currentBudgetMonth];
      } else {
        budgetForm.limit.value = '';
      }
    });
  }

  if (closeBudgetBtn) {
    closeBudgetBtn.addEventListener('click', () => {
      budgetModal.classList.remove('active');
    });
  }

  if (budgetForm) {
    budgetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const limit = e.target.limit.value;
      const month = e.target.month.value;
      try {
        await setMonthlyBudget(user.uid, month, limit);
        budgetModal.classList.remove('active');
      } catch (error) {
        console.error("Error setting budget:", error);
        alert(`Failed to save budget: ${error.message}`);
      }
    });
  }

  expensesCleanup = subscribeToExpenses(user.uid, (expenses) => {
    allExpenses = expenses;
    updateFilterOptions();
    updateBudgetMonthOptions(); // Update month dropdown
    renderExpenses();
    updateBudgetUI(); // Recalculate on expense change
  });

  budgetCleanup = subscribeToBudget(user.uid, (budgets) => {
    allBudgets = budgets;
    updateBudgetMonthOptions(); // Ensure logic handles new budget months
    updateBudgetUI(); // Recalculate on budget change
  });
}
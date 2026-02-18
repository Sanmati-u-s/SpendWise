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
  let incomeExpenseChart = null;

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

    // 2. Bar Chart Logic (last 12 months from LATEST transaction or Today)
    const monthlyTotals = {};

    // Find latest date in expenses to determine the 12-month window
    let latestDate = new Date();
    if (allExpenses.length > 0) {
      const maxDate = new Date(Math.max(...allExpenses.map(e => new Date(e.date))));
      if (maxDate > latestDate) {
        latestDate = maxDate;
      }
    }

    const last12Months = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(latestDate.getFullYear(), latestDate.getMonth() - i, 1);
      const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('default', { month: 'short', year: '2-digit' }); // Added year for clarity
      monthlyTotals[monthYear] = 0;
      last12Months.push({ key: monthYear, label: label });
    }

    allExpenses.forEach(exp => {
      // Only count expenses for Monthly Spending
      if (exp.type === 'income') return;

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

    // 3. Income vs Expenses Chart Logic (Line Chart)
    const incomeExpenseCtx = document.getElementById('income-expense-chart');
    if (incomeExpenseCtx) {
      const monthlyIncome = {};
      const monthlyExpenses = {};

      // Initialize with 0 for last 12 months
      last12Months.forEach(m => {
        monthlyIncome[m.key] = 0;
        monthlyExpenses[m.key] = 0;
      });

      allExpenses.forEach(trans => {
        const d = new Date(trans.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        if (monthlyIncome.hasOwnProperty(key)) {
          if (trans.type === 'income') {
            monthlyIncome[key] += trans.amount;
          } else {
            monthlyExpenses[key] += trans.amount;
          }
        }
      });

      const incomeExpenseData = {
        labels: last12Months.map(m => m.label),
        datasets: [
          {
            label: 'Income',
            data: last12Months.map(m => monthlyIncome[m.key]),
            borderColor: '#10b981', // Success Green
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Expenses',
            data: last12Months.map(m => monthlyExpenses[m.key]),
            borderColor: '#ef4444', // Danger Red
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      };

      if (incomeExpenseChart) incomeExpenseChart.destroy();
      incomeExpenseChart = new Chart(incomeExpenseCtx, {
        type: 'line',
        data: incomeExpenseData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                font: { family: "'Outfit', sans-serif" }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { family: "'Outfit', sans-serif" } }
            },
            y: {
              beginAtZero: true,
              grid: { color: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
              ticks: { font: { family: "'Outfit', sans-serif" } }
            }
          }
        }
      });
    }
  };

  // State for filtering
  let selectedCategoryFilter = null;

  const renderExpenses = () => {
    const filterValue = filterSelect.value;
    let dateFilteredExpenses = allExpenses;

    // 1. Filter by Date (Base Filter)
    if (filterValue !== 'all') {
      dateFilteredExpenses = allExpenses.filter(exp => {
        return exp.date.startsWith(filterValue);
      });
    }

    // Calculate Totals (Based on Date Filter)
    const incomeTotal = dateFilteredExpenses
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const expenseTotal = dateFilteredExpenses
      .filter(t => t.type !== 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const balance = incomeTotal - expenseTotal;

    // Update Overview Cards
    const balanceEl = document.getElementById('balance-amount');
    const incomeEl = document.getElementById('income-amount');
    const expensesEl = document.getElementById('total-amount');

    if (balanceEl) balanceEl.textContent = `₹ ${balance.toFixed(2)}`;
    if (incomeEl) incomeEl.textContent = `₹ ${incomeTotal.toFixed(2)}`;
    if (expensesEl) expensesEl.textContent = `₹ ${expenseTotal.toFixed(2)}`;

    // Update Charts (Based on Date Filter - ONLY Expenses for Pie, ALL for Line/Bar)
    const expenseOnlyData = dateFilteredExpenses.filter(t => t.type !== 'income');
    updateCharts(expenseOnlyData, allExpenses);

    // 2. Filter by Category (Secondary Filter for List)
    let listData = dateFilteredExpenses;
    if (selectedCategoryFilter) {
      listData = dateFilteredExpenses.filter(exp => exp.category === selectedCategoryFilter);
    }

    // Update Recent Transactions Header (Simplified)
    const transactionsHeader = document.querySelector('main h3'); // "Recent Transactions"
    if (transactionsHeader) {
      if (selectedCategoryFilter) {
        transactionsHeader.textContent = `Recent Transactions - ${selectedCategoryFilter}`;
      } else {
        transactionsHeader.textContent = 'Recent Transactions';
      }
    }

    listContainer.innerHTML = '';

    if (listData.length === 0) {
      listContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No transactions found.</p>';
    }

    // Category Totals for Expense Breakdown (Based on Date Filter)
    const categoryTotals = {};
    expenseOnlyData.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    listData.forEach(expense => {
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

      // Icon & Color Logic (Reused from breakdown for consistency)
      let colorClass = 'bg-secondary';
      let iconClass = 'bi-wallet2';
      const lowerCat = expense.category.toLowerCase();

      if (lowerCat.includes('food')) { iconClass = 'bi-basket'; colorClass = 'bg-warning'; }
      else if (lowerCat.includes('transport')) { iconClass = 'bi-car-front'; colorClass = 'bg-info'; }
      else if (lowerCat.includes('utility') || lowerCat.includes('bill')) { iconClass = 'bi-lightning-charge'; colorClass = 'bg-warning'; }
      else if (lowerCat.includes('game') || lowerCat.includes('entertainment')) { iconClass = 'bi-controller'; colorClass = 'bg-primary'; }
      else if (lowerCat.includes('health')) { iconClass = 'bi-heart-pulse'; colorClass = 'bg-danger'; }
      else if (lowerCat.includes('shop')) { iconClass = 'bi-bag'; colorClass = 'bg-primary'; }
      else if (lowerCat.includes('home') || lowerCat.includes('rent')) { iconClass = 'bi-house-door'; colorClass = 'bg-info'; }
      else if (isIncome) { iconClass = 'bi-cash-coin'; colorClass = 'bg-success'; }

      el.innerHTML = `
        <div class="expense-icon-box ${colorClass} bg-opacity-10 text-body">
            <i class="bi ${iconClass}"></i>
        </div>
        
        <div class="expense-details">
            <div class="expense-title">${expense.description}</div>
            <div class="expense-date">${new Date(expense.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
        </div>

        <div class="expense-category-badge">
            ${expense.category}
        </div>

        <div class="expense-amount ${amountClass}">${sign} ₹ ${expense.amount.toFixed(2)}</div>
        
        <div class="expense-actions">
            <button class="btn-icon btn-edit" title="Edit"><i class="bi bi-pencil-fill" style="font-size: 0.8rem;"></i></button>
            <button class="btn-icon btn-delete" title="Delete"><i class="bi bi-trash-fill" style="font-size: 0.8rem;"></i></button>
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

    // Handle Filter Status / Back Button in Header
    const filterStatusContainer = document.getElementById('filter-status');
    if (filterStatusContainer) {
      filterStatusContainer.innerHTML = ''; // Clear previous
      if (selectedCategoryFilter) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn-secondary btn-sm';
        clearBtn.style.padding = '0.2rem 0.6rem';
        clearBtn.style.fontSize = '0.75rem';
        clearBtn.innerHTML = '<i class="bi bi-x-circle me-1"></i> ' + selectedCategoryFilter;
        clearBtn.title = 'Clear Filter';
        clearBtn.addEventListener('click', () => {
          selectedCategoryFilter = null;
          renderExpenses();
        });
        filterStatusContainer.appendChild(clearBtn);
      }
    }

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
        item.className = `category-list-item ${selectedCategoryFilter === category ? 'selected-category' : ''}`;

        // Add click listener for filtering
        item.addEventListener('click', () => {
          if (selectedCategoryFilter === category) {
            selectedCategoryFilter = null; // Toggle off
          } else {
            selectedCategoryFilter = category; // Set filter
          }
          renderExpenses(); // Re-render
        });

        item.innerHTML = `
            <div class="d-flex align-items-center mb-1 justify-content-between">
                <div class="d-flex align-items-center gap-2">
                    <div class="item-icon ${colorClass} bg-opacity-10 text-body p-2 rounded" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                         <i class="bi ${iconClass}"></i>
                    </div>
                    <span class="expense-category-badge" style="font-size: 0.7rem; padding: 0.25rem 0.6rem;">${category}</span>
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

      // Breakdown Header with Optional Clear Button
      const headerDiv = document.createElement('div');
      headerDiv.className = 'd-flex justify-content-between align-items-center mb-3';
      headerDiv.innerHTML = `<h3 class="m-0">Expense Breakdown</h3>`;


      card.appendChild(headerDiv);
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

  filterSelect.addEventListener('change', () => {
    renderExpenses(); // Re-render should respect date filter AND clear category if needed? 
    // Optionally clear category filter on date change to avoid confusion
    // selectedCategoryFilter = null; 
  });


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

    // Update limit field when month is changed inside the modal
    budgetForm.month.addEventListener('change', (e) => {
      const selectedMonth = e.target.value;
      if (allBudgets[selectedMonth]) {
        budgetForm.limit.value = allBudgets[selectedMonth];
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
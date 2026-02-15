export const renderLogin = () => {
  return `
    <div class="container">
      <div style="display: flex; justify-content: flex-end; padding: 1rem 0;">
          <span class="theme-label" style="font-size: 0.9rem; margin-right: 0.5rem; font-weight: 600;">Dark Mode</span>
          <label class="theme-switch" title="Toggle Theme">
            <input type="checkbox" id="theme-toggle-input">
            <span class="slider round"></span>
          </label>
      </div>
      <div class="auth-container">
        <div class="brand-header">
            <p class="welcome-text">Welcome to</p>
            <img src="/assets/logo2.svg" alt="SpendWise Logo" class="brand-logo" />
            <h1 class="brand-name">SpendWise</h1>
        </div>
        <p style="text-align: center; color: var(--text-secondary); margin-top: 0.5rem; margin-bottom: 2rem;">Track your everyday expenses!</p>
        <form id="login-form">
          <div class="input-group">
            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><polyline points="3 7 12 13 21 7"></polyline></svg>
            <input type="email" id="email" placeholder="Email Address" required />
          </div>
          <div class="input-group">
             <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input type="password" id="password" placeholder="Password" required />
          </div>
          <button type="submit" class="auth-btn">Sign In</button>
        </form>
        <p class="auth-switch">Don't have an account? <a href="#" id="show-signup">Create account</a></p>
      </div>
    </div>
  `;
};

export const renderSignup = () => {
  return `
    <div class="container">
      <div style="display: flex; justify-content: flex-end; padding: 1rem 0;">
          <span class="theme-label" style="font-size: 0.9rem; margin-right: 0.5rem; font-weight: 600;">Dark Mode</span>
          <label class="theme-switch" title="Toggle Theme">
            <input type="checkbox" id="theme-toggle-input">
            <span class="slider round"></span>
          </label>
      </div>
      <div class="auth-container">
        <div class="brand-header">
             <p class="welcome-text">Join</p>
             <img src="/assets/logo.svg" alt="SpendWise Logo" class="brand-logo" />
             <h1 class="brand-name">SpendWise</h1>
        </div>
        <form id="signup-form">
          <div class="input-group">
            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <input type="text" id="username" placeholder="Username" required />
          </div>
          <div class="input-group">
            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><polyline points="3 7 12 13 21 7"></polyline></svg>
            <input type="email" id="email" placeholder="Email Address" required />
          </div>
          <div class="input-group">
            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <input type="password" id="password" placeholder="Password (min 6 chars)" required minlength="6" />
          </div>
          <button type="submit" class="auth-btn">Sign Up</button>
        </form>
        <p class="auth-switch">Already have an account? <a href="#" id="show-login">Sign in</a></p>
      </div>
    </div>
  `;
};

export const renderDashboard = (user) => {
  return `
    <div class="container">
      <header>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img src="/assets/logo2.svg" alt="SpendWise Logo" class="brand-logo" style="width: 50px; height: 50px; margin: 0;" />
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <h1 class="brand-name" style="font-size: 2rem; text-align: left; margin-bottom: 0; line-height: 1.1;">SpendWise</h1>
             <p style="font-size: 0.9rem; font-weight: 500; color: var(--primary-color); margin: 0 0 0.2rem 0; letter-spacing: 0.5px;">Smart tracking. Better decisions!</p>
            <p style="color: var(--text-secondary); margin: 0; font-size: 0.95rem; font-weight: 500;">Welcome, ${user.displayName || 'User'}</p>
          </div>
        </div>
        
        <div class="header-actions">
          <span class="theme-label" style="font-size: 0.9rem; margin-right: 0.5rem; font-weight: 600;">Dark Mode</span>
          <label class="theme-switch" title="Toggle Theme">
            <input type="checkbox" id="theme-toggle-input">
            <span class="slider round"></span>
          </label>
          <button id="logout-btn" class="btn-secondary">Logout</button>
        </div>
      </header>
      
      <main>
        <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
          <select id="date-filter" style="padding: 0.5rem; border-radius: var(--radius); border: 1px solid var(--border-color); background: var(--surface-color); color: var(--text-color); font-weight: 500; cursor: pointer;">
              <option value="all">All Time</option>
          </select>
        </div>

        <div class="stats-container">
          <!-- Total Balance -->
          <div class="stat-card">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h3>Total Balance</h3>
                <div class="icon-bg bg-primary bg-opacity-10 text-primary rounded-circle p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-wallet"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v-4h-2z"></path></svg>
                </div>
            </div>
            <div class="value" id="balance-amount">₹ 0.00</div>
          </div>

          <!-- Total Income -->
          <div class="stat-card">
             <div class="d-flex justify-content-between align-items-center mb-2">
                <h3>Total Income</h3>
                <div class="icon-bg bg-success bg-opacity-10 text-success rounded-circle p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                </div>
            </div>
            <div class="value text-success" id="income-amount">₹ 0.00</div>
          </div>

          <!-- Total Expenses -->
          <div class="stat-card">
             <div class="d-flex justify-content-between align-items-center mb-2">
                <h3>Total Expenses</h3>
                <div class="icon-bg bg-danger bg-opacity-10 text-danger rounded-circle p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trending-down"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                </div>
            </div>
            <div class="value text-danger" id="total-amount">₹ 0.00</div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <!-- Main Column -->
          <div class="dashboard-main">
            <!-- Budget Overview -->
            <div class="budget-overview" style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius); margin-bottom: 2rem; box-shadow: var(--shadow);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0;">Monthly Budget</h3>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <select id="budget-month-select" style="padding: 0.25rem; font-size: 0.8rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color);">
                            <!-- Options populated by JS -->
                        </select>
                        <button id="edit-budget-btn" class="btn-secondary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">Set Budget</button>
                    </div>
                </div>
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; font-weight: 500; color: var(--text-secondary);">
                    <span id="budget-status-text">Spent: ₹ 0.00 / ₹ 0.00</span>
                    <span id="budget-percentage">0%</span>
                </div>
                <div style="background: var(--border-color); height: 10px; border-radius: 5px; overflow: hidden;">
                    <div id="budget-progress-bar" style="width: 0%; height: 100%; background: var(--success-color); transition: width 0.3s ease, background-color 0.3s ease;"></div>
                </div>
                <p id="budget-warning" style="color: var(--danger-color); font-size: 0.9rem; margin-top: 0.5rem; display: none;">⚠️ You have exceeded your monthly budget!</p>
            </div>

            <!-- Charts -->
            <div class="charts-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
              <div class="chart-card">
                <h3>Category Distribution</h3>
                <canvas id="pie-chart"></canvas>
              </div>
              <div class="chart-card">
                <h3>Monthly Trends (Last 12 Months)</h3>
                <canvas id="bar-chart"></canvas>
              </div>
              <div class="chart-card" style="grid-column: 1 / -1;">
                <h3>Income vs Expenses</h3>
                <canvas id="income-expense-chart"></canvas>
              </div>
            </div>
          </div>

          <!-- Sidebar Column -->
          <div class="dashboard-sidebar">
             <div id="category-breakdown">
               <!-- Category stats will be injected here -->
             </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3>Recent Transactions</h3>
          <div style="display: flex; gap: 0.5rem;">
            <button id="add-income-btn" type="button" style="background: var(--success-color); border: none; color: white; padding: 1rem 2rem; border-radius: var(--radius); font-size: 1.1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);">Add Income</button>
            <button id="add-expense-btn" type="button">Add Expense</button>
          </div>
        </div>
        
        <div id="expenses-list">
          <p>Loading expenses...</p>
        </div>
      </main>
      
      <!-- Add Expense/Income Modal -->
      <div id="add-expense-modal" class="modal">
        <div class="modal-content">
          <h3>Add New Transaction</h3>
          <form id="add-expense-form">
            <input type="hidden" name="type" value="expense">
            
            <div class="form-group">
                <label class="form-label" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Description</label>
                <input type="text" name="description" placeholder="e.g., Grocery Shopping" required style="width: 100%; box-sizing: border-box;" />
            </div>

            <div class="form-group">
                <label class="form-label" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Amount</label>
                <input type="number" name="amount" placeholder="0.00" step="0.01" min="0" required style="width: 100%; box-sizing: border-box;" />
            </div>

            <div class="form-group">
                <label class="form-label" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Category</label>
                <input type="text" name="category" placeholder="Select or type category" list="categories" required style="width: 100%; box-sizing: border-box;" />
                <datalist id="categories">
                  <option value="Food">
                  <option value="Transport">
                  <option value="Utilities">
                  <option value="Entertainment">
                  <option value="Health">
                  <option value="Salary">
                  <option value="Freelance">
                  <option value="Investment">
                </datalist>
            </div>

            <div class="form-group">
                <label class="form-label" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Date</label>
                <input type="date" name="date" required style="width: 100%; box-sizing: border-box;" />
            </div>
            
            <div class="modal-actions">
              <button type="button" id="close-modal-btn" class="btn-secondary">Cancel</button>
              <button type="submit" id="submit-expense-btn" style="background: var(--primary-color); color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 0.8rem; font-weight: 600; cursor: pointer;">Add Expense</button>
             </div>
          </form>
        </div>
      </div>

      <!-- Edit Budget Modal -->
      <div id="edit-budget-modal" class="modal">
        <div class="modal-content" style="max-width: 400px;">
            <h3>Set Monthly Budget</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.5;">Set a spending limit for a specific month to track your financial goals.</p>
            <form id="edit-budget-form">
                <div class="form-group">
                    <label class="form-label" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Select Month</label>
                    <input type="month" name="month" required style="width: 100%; box-sizing: border-box;" />
                </div>
                <div class="form-group">
                    <label class="form-label" style="display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem;">Budget Limit</label>
                    <input type="number" name="limit" placeholder="e.g., 20000" step="0.01" min="0" required style="width: 100%; box-sizing: border-box;" />
                </div>
                <div class="modal-actions">
                    <button type="button" id="close-budget-modal-btn" class="btn-secondary">Cancel</button>
                    <button type="submit" style="background: var(--primary-color); color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 0.8rem; font-weight: 600; cursor: pointer;">Save Limit</button>
                </div>
            </form>
        </div>
      </div>
    </div>
  `;
};
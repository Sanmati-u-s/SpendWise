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
        <h2>Welcome to SpendWise</h2>
        <p style="text-align: center; color: var(--text-secondary); margin-top: -1.0rem; margin-bottom: 2rem;">Track your everyday expenses!</p>
        <form id="login-form">
          <input type="email" id="email" placeholder="Email Address" required />
          <input type="password" id="password" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
        <p>Don't have an account? <a href="#" id="show-signup">Create account</a></p>
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
        <h2>Create Account</h2>
        <form id="signup-form">
          <input type="text" id="username" placeholder="Username" required />
          <input type="email" id="email" placeholder="Email Address" required />
          <input type="password" id="password" placeholder="Password (min 6 chars)" required minlength="6" />
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a href="#" id="show-login">Sign in</a></p>
      </div>
    </div>
  `;
};

export const renderDashboard = (user) => {
  return `
    <div class="container">
      <header>
        <div>
          <h2>SpendWise</h2>
          <p style="color: var(--text-secondary); margin: 0; font-size: 1.1rem; font-weight: 500;">Welcome, ${user.displayName || 'User'}</p>
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
        <div class="stats-container">
          <div class="stat-card">
            <h3>Total Spending</h3>
            <div class="value" id="total-amount">Rs. 0.00</div>
          </div>
        </div>
        
        <div class="stats-container" id="category-breakdown">
          <!-- Category stats will be injected here -->
        </div>

        <div class="charts-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div class="chart-card">
            <h3>Category Distribution</h3>
            <canvas id="pie-chart"></canvas>
          </div>
          <div class="chart-card">
            <h3>Monthly Trends (Last 12 Months)</h3>
            <canvas id="bar-chart"></canvas>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3>Recent Transactions</h3>
          <div style="display: flex; gap: 0.5rem;">
            <select id="date-filter" style="padding: 0.5rem; border-radius: var(--radius); border: 1px solid var(--border-color); margin-bottom: 0;">
              <option value="all">All Time</option>
            </select>
            <button id="add-expense-btn">Add Expense</button>
          </div>
        </div>
        
        <div id="expenses-list">
          <p>Loading expenses...</p>
        </div>
      </main>
      
      <!-- Add Expense Modal -->
      <div id="add-expense-modal" class="modal">
        <div class="modal-content">
          <h3>Add New Expense</h3>
          <form id="add-expense-form">
            <input type="text" name="description" placeholder="Description (e.g., Grocery)" required />
            <input type="number" name="amount" placeholder="Amount" step="0.01" min="0" required />
            <input type="text" name="category" placeholder="Category" list="categories" required />
            <datalist id="categories">
              <option value="Food">
              <option value="Transport">
              <option value="Utilities">
              <option value="Entertainment">
              <option value="Health">
            </datalist>
            <input type="date" name="date" required />
            
            <div class="modal-actions">
              <button type="button" id="close-modal-btn" class="btn-secondary">Cancel</button>
              <button type="submit">Add Expense</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
};
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
            <img src="/src/assets/logo.svg" alt="SpendWise Logo" class="brand-logo" />
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
             <img src="/src/assets/logo.svg" alt="SpendWise Logo" class="brand-logo" />
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
          <img src="/src/assets/logo.svg" alt="SpendWise Logo" class="brand-logo" style="width: 50px; height: 50px; margin: 0;" />
          <div>
            <h1 class="brand-name" style="font-size: 2rem; text-align: left; margin-bottom: 0;">SpendWise</h1>
            <p style="color: var(--text-secondary); margin: 0; font-size: 1rem; font-weight: 500;">Welcome, ${user.displayName || 'User'}</p>
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
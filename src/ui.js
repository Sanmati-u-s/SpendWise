export const renderLogin = () => {
  return `
    <div class="container">
      <div class="auth-container">
        <h2>Welcome Back</h2>
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
      <div class="auth-container">
        <h2>Create Account</h2>
        <form id="signup-form">
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
          <h2>My Expenses</h2>
          <p style="color: var(--text-secondary); margin: 0;">${user.email}</p>
        </div>
        <button id="logout-btn" class="btn-secondary">Logout</button>
      </header>
      
      <main>
        <div class="stats-container">
          <div class="stat-card">
            <h3>Total Spending</h3>
            <div class="value" id="total-amount">Rs. 0.00</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3>Recent Transactions</h3>
          <button id="add-expense-btn">Add Expense</button>
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

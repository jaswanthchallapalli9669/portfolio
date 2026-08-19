const INTRO_KEY = 'fintrack-intro-seen';

document.addEventListener('DOMContentLoaded', () => {
  injectUxStyles();
  applyUserPreferences();
  setupThemeToggle();
  setupMobileNavigation();
  setupDynamicNavigation();
  setupTransactionModal();
  setupSalarySavingsPulse();
  setupDashboardInteractions();
  setupFinancialHealth();
  setupSmartInsights();
  setupBudgetRecommendations();
  setupGoalEnhancements();
  setupSpendingHeatmap();
  setupIntroExperience();
  document.body.classList.add('ux-ready');
});

function setupDynamicNavigation() {
  const navigation = document.querySelector('.sidebar-nav');
  if (!navigation) return;

  // Subscriptions link
  if (!navigation.querySelector('[href="subscriptions.html"]')) {
    const subLink = document.createElement('a');
    subLink.className = `nav-item ${document.body.dataset.page === 'subscriptions' ? 'active' : ''}`;
    subLink.href = 'subscriptions.html';
    subLink.innerHTML = '<i class="fa-solid fa-repeat"></i><span>Subscriptions</span>';
    const analyticsLink = navigation.querySelector('[href="analytics.html"]');
    if (analyticsLink) analyticsLink.insertAdjacentElement('beforebegin', subLink);
    else navigation.appendChild(subLink);
  }

  // Deals & Offers link
  if (!navigation.querySelector('[href="deals.html"]')) {
    const dealsLink = document.createElement('a');
    dealsLink.className = `nav-item ${document.body.dataset.page === 'deals' ? 'active' : ''}`;
    dealsLink.href = 'deals.html';
    dealsLink.innerHTML = '<i class="fa-solid fa-tags"></i><span>Deals & Offers</span>';
    const analyticsLink = navigation.querySelector('[href="analytics.html"]');
    if (analyticsLink) analyticsLink.insertAdjacentElement('beforebegin', dealsLink);
    else navigation.appendChild(dealsLink);
  }
}

function setupSalarySavingsPulse() {
  if (document.body.dataset.page !== 'dashboard') return;
  const summaryGrid = document.querySelector('.summary-grid');
  if (!summaryGrid || document.querySelector('#salarySavingsPulse')) return;

  const section = document.createElement('section');
  section.className = 'panel salary-pulse-panel';
  section.id = 'salarySavingsPulse';
  section.innerHTML = `
    <div class="pulse-head">
      <div>
        <span class="category-badge safe-badge"><i class="fa-solid fa-calculator"></i> Your Money Flow</span>
        <h2>Monthly Salary & Future Savings</h2>
        <p>A simple, zero-confusion breakdown of where your salary goes and what you have saved to spend on deals.</p>
      </div>
      <a href="deals.html" class="primary-button pulse-deal-btn">
        <i class="fa-solid fa-tags"></i> Explore Deals & Buy from Savings <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
    <div class="salary-flow-grid">
      <div class="flow-card">
        <span class="flow-icon"><i class="fa-solid fa-money-bill-wave"></i></span>
        <div>
          <span class="flow-label">Monthly Salary</span>
          <strong class="flow-value" id="pulseSalary">₹0</strong>
          <small id="pulsePayday">Budgeted baseline</small>
        </div>
      </div>
      <div class="flow-divider"><i class="fa-solid fa-minus"></i></div>
      <div class="flow-card">
        <span class="flow-icon orange"><i class="fa-solid fa-arrow-trend-down"></i></span>
        <div>
          <span class="flow-label">Spent This Month</span>
          <strong class="flow-value" id="pulseSpent">₹0</strong>
          <small id="pulseExpensesCount">0 transactions</small>
        </div>
      </div>
      <div class="flow-divider"><i class="fa-solid fa-equals"></i></div>
      <div class="flow-card highlight">
        <span class="flow-icon green"><i class="fa-solid fa-check-circle"></i></span>
        <div>
          <span class="flow-label">Safe to Spend Balance</span>
          <strong class="flow-value highlight" id="pulseSafeSpend">₹0</strong>
          <small>Protected from bills & savings</small>
        </div>
      </div>
      <div class="flow-divider plus"><i class="fa-solid fa-gem"></i></div>
      <div class="flow-card future-pool">
        <span class="flow-icon purple"><i class="fa-solid fa-piggy-bank"></i></span>
        <div>
          <span class="flow-label">Future Buyings Savings</span>
          <strong class="flow-value purple" id="pulseFutureSavings">₹0</strong>
          <small>Reserved for Amazon/Flipkart deals</small>
        </div>
      </div>
    </div>
  `;

  summaryGrid.insertAdjacentElement('afterend', section);
  renderSalarySavingsPulse();
  window.addEventListener('fintrack:data-updated', renderSalarySavingsPulse);
}

function renderSalarySavingsPulse() {
  const pulseSalary = document.getElementById('pulseSalary');
  if (!pulseSalary) return;

  const data = getData();
  const summary = getSalarySummary(data);

  pulseSalary.textContent = formatCurrency(summary.salary);
  document.getElementById('pulseSpent').textContent = formatCurrency(summary.spentThisMonth);
  document.getElementById('pulseSafeSpend').textContent = formatCurrency(summary.safeToSpend);
  document.getElementById('pulseFutureSavings').textContent = formatCurrency(summary.futureSavings);

  const monthExpenses = getMonthTransactions(data.transactions).filter(t => t.type === 'expense');
  document.getElementById('pulseExpensesCount').textContent = `${monthExpenses.length} expense log${monthExpenses.length === 1 ? '' : 's'}`;
}


function injectUxStyles() {
  if (document.querySelector('link[data-ux-styles]')) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'css/ux.css';
  stylesheet.dataset.uxStyles = 'true';
  document.head.appendChild(stylesheet);
}

function applyUserPreferences() {
  const data = getData();
  document.body.classList.toggle('dark', data.settings.theme === 'dark');
  const profileName = document.querySelector('#profileName');
  const greeting = document.querySelector('#userGreeting');
  const avatar = document.querySelector('#userAvatar');
  if (profileName) profileName.textContent = data.profile.name;
  if (greeting) greeting.textContent = data.profile.name.split(' ')[0];
  if (avatar) avatar.textContent = getInitials(data.profile.name);
  const dateNode = document.querySelector('#currentDate');
  if (dateNode) dateNode.textContent = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
}

function getInitials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function setupThemeToggle() {
  document.querySelectorAll('#themeToggle, #settingsTheme').forEach((button) => button.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark');
    updateData((data) => { data.settings.theme = isDark ? 'dark' : 'light'; });
    document.body.classList.toggle('dark', isDark);
  }));
}

function setupMobileNavigation() {
  document.querySelector('#mobileMenu')?.addEventListener('click', () => document.querySelector('#sidebar')?.classList.toggle('open'));
  document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => document.querySelector('#sidebar')?.classList.remove('open')));
}

function setupIntroExperience() {
  if (document.body.dataset.page !== 'dashboard' || sessionStorage.getItem(INTRO_KEY)) return;
  const overlay = document.createElement('div');
  overlay.className = 'intro-overlay';
  overlay.innerHTML = `<div class="intro-content"><div class="intro-brand"><span class="intro-mark"><i class="fa-solid fa-chart-line"></i></span>Fin<span>Track</span></div><div class="mascot" aria-hidden="true"><div class="mascot-wallet"></div><div class="mascot-face">• •</div><div class="mascot-coin">₹</div></div><p class="intro-copy">Making your money make sense.<strong class="intro-ready">Ready for today?</strong></p><button class="intro-skip" type="button">Skip intro</button></div>`;
  document.body.appendChild(overlay);
  const finish = () => { sessionStorage.setItem(INTRO_KEY, 'true'); overlay.classList.add('is-leaving'); setTimeout(() => overlay.remove(), 320); };
  overlay.querySelector('.intro-skip').addEventListener('click', finish);
  setTimeout(finish, 1700);
}

function setupDashboardInteractions() {
  if (document.body.dataset.page !== 'dashboard') return;
  const cards = [['totalBalance', 'index.html'], ['totalIncome', 'transactions.html?type=income'], ['totalExpenses', 'transactions.html?type=expense'], ['totalSavings', 'analytics.html']];
  cards.forEach(([id, destination]) => {
    const card = document.getElementById(id)?.closest('.summary-card');
    if (!card) return;
    card.classList.add('is-interactive');
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.addEventListener('click', () => { window.location.href = destination; });
    card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.location.href = destination; } });
  });
  window.addEventListener('fintrack:data-updated', () => animateSummaryNumbers());
  setTimeout(animateSummaryNumbers, 120);
}

function setupFinancialHealth() {
  if (document.body.dataset.page !== 'dashboard') return;
  const summaryGrid = document.querySelector('.summary-grid');
  if (!summaryGrid || document.querySelector('#financialHealth')) return;
  const panel = document.createElement('section');
  panel.className = 'health-layout';
  panel.id = 'financialHealth';
  panel.innerHTML = `<article class="panel health-panel"><div class="health-score-ring"><div><strong id="healthScore">0</strong><span>/ 100</span></div></div><div class="health-copy"><p class="section-kicker">Your financial health</p><h2 id="healthLabel">Calculating...</h2><p id="healthMessage">Reading your latest money patterns.</p></div><button class="health-details" id="healthDetails" type="button" aria-expanded="false">How this is calculated <i class="fa-solid fa-chevron-down"></i></button><div class="health-breakdown" id="healthBreakdown"></div></article><article class="panel metric-panel"><div class="panel-heading"><div><p class="section-kicker">Useful context</p><h2>This month's pulse</h2></div><i class="fa-solid fa-wave-square insight-heading-icon"></i></div><div class="metric-list"><div><span>Savings rate</span><strong id="healthSavingsRate">0%</strong></div><div><span>Average daily spending</span><strong id="healthDailySpend">₹0</strong></div><div><span>This month's spending</span><strong id="healthMonthSpend">₹0</strong></div><div><span>Previous month comparison</span><strong id="healthMonthComparison">No change</strong></div></div></article></section>`;
  summaryGrid.insertAdjacentElement('afterend', panel);
  document.querySelector('#healthDetails').addEventListener('click', () => {
    const details = document.querySelector('#healthBreakdown');
    const expanded = details.classList.toggle('open');
    document.querySelector('#healthDetails').setAttribute('aria-expanded', String(expanded));
  });
  renderFinancialHealth();
  window.addEventListener('fintrack:data-updated', renderFinancialHealth);
}

function calculateFinancialHealth(data) {
  const current = getMonthTransactions(data.transactions);
  const currentTotals = totals(current);
  const savingsRate = currentTotals.income > 0 ? Math.max(0, (currentTotals.income - currentTotals.expense) / currentTotals.income * 100) : 0;
  const categorySpend = getCategoryTotals(current);
  const budgetEntries = data.budgets.filter((budget) => !['Salary', 'Freelance'].includes(budget.category));
  const budgetUsage = budgetEntries.length ? budgetEntries.reduce((sum, budget) => sum + Math.min((categorySpend[budget.category] || 0) / budget.amount, 1.25), 0) / budgetEntries.length : 0;
  const dailyValues = Object.values(current.filter((item) => item.type === 'expense').reduce((days, item) => { days[item.date] = (days[item.date] || 0) + Number(item.amount); return days; }, {}));
  const averageDaily = dailyValues.length ? dailyValues.reduce((sum, amount) => sum + amount, 0) / dailyValues.length : 0;
  const mean = averageDaily || 1;
  const variance = dailyValues.length ? dailyValues.reduce((sum, amount) => sum + ((amount - mean) ** 2), 0) / dailyValues.length : 0;
  const consistency = Math.max(0, 15 - Math.min(Math.sqrt(variance) / mean * 15, 15));
  const overspending = budgetEntries.filter((budget) => (categorySpend[budget.category] || 0) > budget.amount).length;
  const budgetScore = budgetEntries.length ? Math.max(0, 25 - budgetUsage * 25) : 18;
  const goalScore = data.goals.length ? data.goals.reduce((sum, goal) => sum + Math.min(Number(goal.saved) / Number(goal.target), 1), 0) / data.goals.length * 10 : 5;
  const score = Math.round(Math.min(100, savingsRate / 100 * 40 + budgetScore + consistency + Math.max(0, 10 - overspending * 3) + goalScore));
  const previousKey = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7);
  const previousSpend = totals(data.transactions.filter((item) => item.type === 'expense' && getMonthKey(item.date) === previousKey)).expense;
  return { score, savingsRate, averageDaily, spending: currentTotals.expense, previousSpend, overspending, budgetUsage, consistency, goalScore };
}

function renderFinancialHealth() {
  const scoreNode = document.querySelector('#healthScore');
  if (!scoreNode) return;
  const result = calculateFinancialHealth(getData());
  scoreNode.textContent = result.score;
  document.querySelector('.health-score-ring').style.setProperty('--score', result.score);
  document.querySelector('#healthLabel').textContent = result.score >= 75 ? 'Good' : result.score >= 50 ? 'Building momentum' : 'Needs attention';
  document.querySelector('#healthMessage').textContent = result.score >= 75 ? 'Your spending is under control. Keep protecting your savings rate.' : 'A few small adjustments could make your money feel more resilient.';
  document.querySelector('#healthSavingsRate').textContent = `${Math.round(result.savingsRate)}%`;
  document.querySelector('#healthDailySpend').textContent = formatCurrency(result.averageDaily);
  document.querySelector('#healthMonthSpend').textContent = formatCurrency(result.spending);
  const comparison = result.previousSpend ? ((result.spending - result.previousSpend) / result.previousSpend) * 100 : 0;
  document.querySelector('#healthMonthComparison').textContent = result.previousSpend ? `${comparison >= 0 ? '+' : ''}${Math.round(comparison)}% vs last month` : 'No previous data';
  document.querySelector('#healthBreakdown').innerHTML = `<span><i class="fa-solid fa-piggy-bank"></i> Savings rate ${Math.round(result.savingsRate)}%</span><span><i class="fa-solid fa-wallet"></i> Budget control ${Math.round((1 - result.budgetUsage) * 100)}%</span><span><i class="fa-solid fa-chart-line"></i> Spending consistency ${Math.round(result.consistency / 15 * 100)}%</span><span><i class="fa-solid fa-bullseye"></i> Goal progress ${Math.round(result.goalScore * 10)}%</span>`;
}

function setupSmartInsights() {
  if (document.body.dataset.page !== 'dashboard') return;
  const render = () => setTimeout(renderSmartInsights, 80);
  render();
  window.addEventListener('fintrack:data-updated', render);
}

function renderSmartInsights() {
  const list = document.querySelector('#insightsList');
  if (!list) return;
  const data = getData();
  const today = new Date();
  const currentKey = today.toISOString().slice(0, 7);
  const previousKey = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().slice(0, 7);
  const current = data.transactions.filter((item) => getMonthKey(item.date) === currentKey);
  const previous = data.transactions.filter((item) => getMonthKey(item.date) === previousKey);
  const currentExpenses = getCategoryTotals(current);
  const previousExpenses = getCategoryTotals(previous);
  const currentTotals = totals(current);
  const insights = [];

  Object.entries(currentExpenses).forEach(([category, amount]) => {
    const previousAmount = previousExpenses[category] || 0;
    if (previousAmount > 0 && amount > previousAmount * 1.15) {
      insights.push({ type: 'warning', icon: 'fa-triangle-exclamation', title: 'Spending picked up', message: `You spent ${formatCurrency(amount - previousAmount)} more on ${category.toLowerCase()} than last month.`, link: `transactions.html?category=${encodeURIComponent(category)}` });
    }
  });

  data.budgets.forEach((budget) => {
    const used = currentExpenses[budget.category] || 0;
    const usage = used / budget.amount;
    if (usage >= 0.7) {
      insights.push({ type: usage >= 1 ? 'warning' : 'improvement', icon: usage >= 1 ? 'fa-bell' : 'fa-gauge-high', title: `${budget.category} budget`, message: `You have used ${Math.round(usage * 100)}% of your ${budget.category.toLowerCase()} budget.`, link: 'budget.html' });
    }
  });

  const savingsRate = currentTotals.income > 0 ? (currentTotals.income - currentTotals.expense) / currentTotals.income * 100 : 0;
  if (currentTotals.income > 0) {
    insights.push({ type: savingsRate >= 30 ? 'positive' : 'saving', icon: savingsRate >= 30 ? 'fa-piggy-bank' : 'fa-lightbulb', title: savingsRate >= 30 ? 'Strong saving rhythm' : 'Saving opportunity', message: `Your savings rate this month is ${Math.round(savingsRate)}%.`, link: 'analytics.html' });
  }

  data.goals.forEach((goal) => {
    const remaining = Math.max(Number(goal.target) - Number(goal.saved), 0);
    const monthsRemaining = Math.max((new Date(`${goal.targetDate}T00:00:00`) - today) / (1000 * 60 * 60 * 24 * 30.44), 1);
    if (remaining > 0 && monthsRemaining <= 6) {
      insights.push({ type: 'goal', icon: 'fa-bullseye', title: `${goal.name} is within reach`, message: `Set aside about ${formatCurrency(remaining / monthsRemaining)} per month to stay on track.`, link: 'goals.html' });
    }
  });

  if (!insights.length) insights.push({ type: 'positive', icon: 'fa-shield-heart', title: 'You are doing well', message: 'Your current spending pattern is steady. Keep checking in each week.', link: 'analytics.html' });
  list.innerHTML = insights.slice(0, 4).map((insight) => `<div class="smart-insight ${insight.type}"><span class="insight-icon"><i class="fa-solid ${insight.icon}"></i></span><div><strong>${insight.title}</strong><p>${insight.message}</p><a href="${insight.link}">View details <i class="fa-solid fa-arrow-right"></i></a></div></div>`).join('');
}

function setupBudgetRecommendations() {
  if (document.body.dataset.page !== 'budget') return;
  const toolbar = document.querySelector('.page-toolbar');
  const grid = document.querySelector('#budgetGrid');
  if (!toolbar || !grid) return;
  const panel = document.createElement('section');
  panel.className = 'panel recommendation-panel';
  panel.innerHTML = `<div class="panel-heading"><div><p class="section-kicker">Plan with intention</p><h2>Smart budget recommendations</h2></div><i class="fa-solid fa-wand-magic-sparkles insight-heading-icon"></i></div><div class="recommendation-inputs"><label>Monthly income<input id="recommendIncome" type="number" min="0" step="100"></label><label>Fixed expenses<input id="recommendFixed" type="number" min="0" step="100"></label><label>Savings target<input id="recommendSavings" type="number" min="0" step="100"></label></div><div class="recommendation-result"><span>Recommended available spending</span><strong id="recommendedSpending">₹0</strong></div><div><p class="section-kicker recommendation-label">Based on your history</p><div id="categoryRecommendations" class="category-recommendations"></div></div>`;
  toolbar.insertAdjacentElement('afterend', panel);
  const data = getData();
  const savedPlan = data.budgetPlan || {};
  const currentIncome = totals(getMonthTransactions(data.transactions)).income;
  document.querySelector('#recommendIncome').value = savedPlan.income ?? currentIncome;
  document.querySelector('#recommendFixed').value = savedPlan.fixed ?? 0;
  document.querySelector('#recommendSavings').value = savedPlan.savings ?? Math.round(currentIncome * 0.2);
  panel.querySelectorAll('input').forEach((input) => input.addEventListener('input', renderBudgetRecommendations));
  renderBudgetRecommendations();
}

function renderBudgetRecommendations() {
  const income = Number(document.querySelector('#recommendIncome')?.value) || 0;
  const fixed = Number(document.querySelector('#recommendFixed')?.value) || 0;
  const savings = Number(document.querySelector('#recommendSavings')?.value) || 0;
  updateData((data) => { data.budgetPlan = { income, fixed, savings }; });
  document.querySelector('#recommendedSpending').textContent = formatCurrency(Math.max(income - fixed - savings, 0));
  const transactions = getData().transactions.filter((item) => item.type === 'expense');
  const categoryTotals = getCategoryTotals(transactions);
  const months = new Set(transactions.map((item) => getMonthKey(item.date))).size || 1;
  const recommendations = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 4);
  document.querySelector('#categoryRecommendations').innerHTML = recommendations.length ? recommendations.map(([category, total]) => { const average = total / months; const recommended = Math.round(average * 0.9 / 100) * 100; return `<div class="category-recommendation"><span><strong>${category}</strong><small>Current average ${formatCurrency(average)}</small></span><b>${formatCurrency(recommended)}</b><small>Suggested</small></div>`; }).join('') : '<div class="empty-state"><p>Add expenses to see category recommendations.</p></div>';
}

function setupGoalEnhancements() {
  if (document.body.dataset.page !== 'goals') return;
  setTimeout(enhanceGoalCards, 80);
  window.addEventListener('fintrack:data-updated', () => setTimeout(enhanceGoalCards, 50));
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-money]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openGoalMoneyModal(button.dataset.addMoney);
  }, true);
}

function enhanceGoalCards() {
  const goals = getData().goals;
  document.querySelectorAll('.goal-card').forEach((card, index) => {
    const goal = goals[index];
    if (!goal || card.querySelector('.goal-details')) return;
    const remaining = Math.max(Number(goal.target) - Number(goal.saved), 0);
    const targetDate = new Date(`${goal.targetDate}T00:00:00`);
    const daysRemaining = Math.max(Math.ceil((targetDate - new Date()) / 86400000), 0);
    const monthsRemaining = Math.max(daysRemaining / 30.44, 1);
    const requiredMonthly = remaining / monthsRemaining;
    const details = document.createElement('div');
    details.className = 'goal-details';
    details.innerHTML = `<div><span>Remaining</span><strong>${formatCurrency(remaining)}</strong></div><div><span>Days remaining</span><strong>${daysRemaining}</strong></div><div><span>Required monthly</span><strong>${formatCurrency(requiredMonthly)}</strong></div>`;
    card.querySelector('.goal-footer').insertAdjacentElement('beforebegin', details);
    card.querySelector('.progress-fill')?.classList.add('goal-progress-animated');
  });
}

function openGoalMoneyModal(goalId) {
  const goal = getData().goals.find((item) => item.id === goalId);
  if (!goal) return;
  const host = document.querySelector('#featureModal');
  host.innerHTML = `<div class="modal-backdrop open"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="goalMoneyTitle"><div class="modal-heading"><div><p class="section-kicker">Keep the momentum</p><h2 id="goalMoneyTitle">Add money to ${goal.name}</h2></div><button class="icon-button" id="closeGoalMoney" aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button></div><form id="goalMoneyForm"><label class="goal-money-label">Amount<input name="amount" type="number" min="1" step="1" required autofocus></label><p class="form-error" id="goalMoneyError"></p><button class="primary-button full-width" type="submit"><i class="fa-solid fa-plus"></i> Add to goal</button></form></div></div>`;
  const form = document.querySelector('#goalMoneyForm');
  const close = () => { host.innerHTML = ''; };
  document.querySelector('#closeGoalMoney').addEventListener('click', close);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = Number(new FormData(form).get('amount'));
    if (amount <= 0) { document.querySelector('#goalMoneyError').textContent = 'Enter an amount greater than zero.'; return; }
    let completed = false;
    updateData((data) => { const target = data.goals.find((item) => item.id === goalId); target.saved = Math.min(Number(target.saved) + amount, Number(target.target)); completed = target.saved >= target.target; });
    close();
    showToast(completed ? 'Goal unlocked!' : 'Goal updated', completed ? 'You reached this milestone. Great work.' : `${formatCurrency(amount)} added to ${goal.name}.`);
    if (typeof renderGoals === 'function') renderGoals();
    setTimeout(enhanceGoalCards, 50);
  });
  form.amount.focus();
}

function setupSpendingHeatmap() {
  if (document.body.dataset.page !== 'analytics') return;
  const chartGrid = document.querySelector('.analytics-grid');
  if (!chartGrid || document.querySelector('#spendingHeatmap')) return;
  const section = document.createElement('section');
  section.className = 'panel heatmap-panel';
  section.id = 'spendingHeatmap';
  section.innerHTML = `<div class="panel-heading"><div><p class="section-kicker">Daily rhythm</p><h2>Spending heatmap</h2></div><div class="heatmap-legend"><span><i class="heat-low"></i>Low</span><span><i class="heat-medium"></i>Medium</span><span><i class="heat-high"></i>High</span></div></div><div class="heatmap-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div id="heatmapGrid" class="heatmap-grid"></div><div id="heatmapDetail" class="heatmap-detail" aria-live="polite">Select a day to inspect spending.</div>`;
  chartGrid.insertAdjacentElement('beforebegin', section);
  renderSpendingHeatmap();
  document.querySelector('#analyticsMonth')?.addEventListener('change', renderSpendingHeatmap);
  window.addEventListener('fintrack:data-updated', renderSpendingHeatmap);
}

function renderSpendingHeatmap() {
  const grid = document.querySelector('#heatmapGrid');
  if (!grid) return;
  const selectedMonth = document.querySelector('#analyticsMonth')?.value || new Date().toISOString().slice(0, 7);
  const [year, month] = selectedMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const expenses = getData().transactions.filter((item) => item.type === 'expense' && item.date.startsWith(selectedMonth));
  const byDay = expenses.reduce((days, item) => { const day = Number(item.date.slice(-2)); if (!days[day]) days[day] = []; days[day].push(item); return days; }, {});
  const totalsByDay = Object.values(byDay).map((items) => items.reduce((sum, item) => sum + Number(item.amount), 0));
  const maxSpend = Math.max(...totalsByDay, 0);
  const cells = [];
  for (let index = 0; index < firstDay; index += 1) cells.push('<span class="heatmap-cell is-empty" aria-hidden="true"></span>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const items = byDay[day] || [];
    const amount = items.reduce((sum, item) => sum + Number(item.amount), 0);
    const level = amount === 0 ? 'none' : amount >= maxSpend * .66 ? 'high' : amount >= maxSpend * .33 ? 'medium' : 'low';
    cells.push(`<button class="heatmap-cell ${level}" data-heat-day="${day}" aria-label="${day} ${formatCurrency(amount)} spent"><span>${day}</span></button>`);
  }
  grid.innerHTML = cells.join('');
  grid.querySelectorAll('[data-heat-day]').forEach((cell) => cell.addEventListener('click', () => showHeatmapDetail(Number(cell.dataset.heatDay), selectedMonth, byDay)));
}

function showHeatmapDetail(day, monthKey, byDay) {
  const items = byDay[day] || [];
  const amount = items.reduce((sum, item) => sum + Number(item.amount), 0);
  const categories = getCategoryTotals(items);
  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  const date = `${monthKey}-${String(day).padStart(2, '0')}`;
  document.querySelector('#heatmapDetail').innerHTML = `<strong>${formatDate(date)}</strong><span>${formatCurrency(amount)} spent</span><span>${items.length} transaction${items.length === 1 ? '' : 's'}</span><span>Top category: ${topCategory ? topCategory[0] : 'None'}</span>`;
}

function animateSummaryNumbers() {
  document.querySelectorAll('.summary-value').forEach((node) => {
    const target = Number(node.textContent.replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(target) || node.dataset.animated === 'true') return;
    node.dataset.animated = 'true';
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 500, 1);
      node.textContent = formatCurrency(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function setupTransactionModal() {
  const modal = document.querySelector('#transactionModal');
  const form = document.querySelector('#transactionForm');
  if (!modal || !form) return;
  document.querySelector('#categorySelect').innerHTML = CATEGORIES.map((category) => `<option>${category}</option>`).join('');
  document.querySelector('#paymentMethodSelect').innerHTML = PAYMENT_METHODS.map((method) => `<option>${method}</option>`).join('');
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); form.reset(); document.querySelector('#formError').textContent = ''; };
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => {
    form.type.value = button.dataset.action;
    form.date.value = new Date().toISOString().slice(0, 10);
    modal.classList.add('open');
    form.amount.focus();
  }));
  modal.querySelector('.close-modal').addEventListener('click', close);
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const values = Object.fromEntries(new FormData(form));
    if (!values.description.trim() || Number(values.amount) <= 0 || !values.date) {
      document.querySelector('#formError').textContent = 'Add a description, a positive amount, and a date.';
      return;
    }
    updateData((data) => data.transactions.unshift({ ...values, id: createId(), amount: Number(values.amount) }));
    close();
    showToast(values.type === 'income' ? 'Income added' : 'Expense added', `${formatCurrency(values.amount)} ${values.category.toLowerCase()} ${values.type} recorded.`);
    document.querySelectorAll('.summary-value').forEach((node) => { delete node.dataset.animated; });
    if (typeof renderDashboard === 'function') renderDashboard();
    setTimeout(animateSummaryNumbers, 30);
  }, true);
}

function showToast(title, message, type = 'success') {
  let stack = document.querySelector('.toast-stack');
  if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; document.body.appendChild(stack); }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-xmark'}"></i><div class="toast-body"><strong>${title}</strong><span>${message}</span></div><button class="toast-close" aria-label="Dismiss notification"><i class="fa-solid fa-xmark"></i></button>`;
  stack.appendChild(toast);
  const remove = () => { toast.classList.add('is-leaving'); setTimeout(() => toast.remove(), 220); };
  toast.querySelector('.toast-close').addEventListener('click', remove);
  setTimeout(remove, 3600);
}

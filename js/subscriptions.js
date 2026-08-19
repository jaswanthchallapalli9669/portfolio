const BILLING_CYCLES = ['Monthly', 'Quarterly', 'Yearly'];

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'subscriptions') return;
  ensureSubscriptionData();
  document.getElementById('addSubscription').addEventListener('click', () => openSubscriptionForm());
  renderSubscriptions();
});

function ensureSubscriptionData() {
  const data = getData();
  if (!Array.isArray(data.subscriptions)) updateData((nextData) => { nextData.subscriptions = []; });
}

function monthlyCost(subscription) {
  const amount = Number(subscription.amount);
  if (subscription.billingCycle === 'Yearly') return amount / 12;
  if (subscription.billingCycle === 'Quarterly') return amount / 3;
  return amount;
}

function renderSubscriptions() {
  const subscriptions = getData().subscriptions || [];
  const monthly = subscriptions.reduce((sum, item) => sum + monthlyCost(item), 0);
  document.getElementById('subscriptionStats').innerHTML = [['Monthly cost', formatCurrency(monthly), 'fa-calendar-check'], ['Yearly cost', formatCurrency(monthly * 12), 'fa-chart-line'], ['Active subscriptions', subscriptions.length, 'fa-layer-group']].map(([label, value, icon]) => `<article class="summary-card subscription-stat"><span class="card-icon green"><i class="fa-solid ${icon}"></i></span><span class="card-label">${label}</span><strong class="summary-value">${value}</strong></article>`).join('');
  const upcoming = [...subscriptions].sort((a, b) => a.nextPayment.localeCompare(b.nextPayment)).slice(0, 3);
  document.getElementById('upcomingSubscriptions').innerHTML = upcoming.length ? upcoming.map((item) => `<div class="upcoming-item"><span class="subscription-icon"><i class="fa-solid fa-repeat"></i></span><div><strong>${item.serviceName}</strong><span>${formatDate(item.nextPayment)} · ${item.billingCycle}</span></div><b>${formatCurrency(item.amount)}</b></div>`).join('') : '<div class="empty-state"><i class="fa-solid fa-repeat"></i><p>No upcoming payments yet.</p></div>';
  document.getElementById('subscriptionGrid').innerHTML = subscriptions.length ? subscriptions.map((item) => `<article class="panel subscription-card"><div class="subscription-card-top"><span class="subscription-icon"><i class="fa-solid fa-repeat"></i></span><div class="row-actions"><button class="icon-button" data-edit-subscription="${item.id}" aria-label="Edit subscription"><i class="fa-solid fa-pen"></i></button><button class="icon-button" data-delete-subscription="${item.id}" aria-label="Delete subscription"><i class="fa-solid fa-trash"></i></button></div></div><h2>${item.serviceName}</h2><p>${item.category} · ${item.billingCycle}</p><strong class="subscription-amount">${formatCurrency(item.amount)} <small>/ ${item.billingCycle.toLowerCase().replace('ly','')}</small></strong><div class="subscription-footer"><span>Next payment</span><strong>${formatDate(item.nextPayment)}</strong></div></article>`).join('') : '<div class="empty-state page-empty"><i class="fa-solid fa-repeat"></i><h3>No subscriptions yet</h3><p>Track recurring payments before they surprise you.</p></div>';
  document.querySelectorAll('[data-edit-subscription]').forEach((button) => button.addEventListener('click', () => openSubscriptionForm(button.dataset.editSubscription)));
  document.querySelectorAll('[data-delete-subscription]').forEach((button) => button.addEventListener('click', () => { if (confirm('Delete this subscription?')) { updateData((data) => { data.subscriptions = data.subscriptions.filter((item) => item.id !== button.dataset.deleteSubscription); }); renderSubscriptions(); showToast('Subscription deleted', 'The recurring payment was removed.'); } }));
}

function openSubscriptionForm(id) {
  const existing = id ? getData().subscriptions.find((item) => item.id === id) : { serviceName: '', amount: '', billingCycle: 'Monthly', nextPayment: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), category: 'Other' };
  document.getElementById('featureModal').innerHTML = `<div class="modal-backdrop open"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="subscriptionFormTitle"><div class="modal-heading"><div><p class="section-kicker">Recurring payment</p><h2 id="subscriptionFormTitle">${id ? 'Edit' : 'Add'} subscription</h2></div><button class="icon-button" id="closeFeature" aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button></div><form id="subscriptionForm"><div class="form-grid"><label class="wide">Service name<input name="serviceName" maxlength="50" placeholder="Netflix" required></label><label>Amount<input name="amount" type="number" min="1" step="1" required></label><label>Billing cycle<select name="billingCycle">${BILLING_CYCLES.map((cycle) => `<option>${cycle}</option>`).join('')}</select></label><label>Next payment date<input name="nextPayment" type="date" required></label><label>Category<select name="category">${CATEGORIES.filter((category) => !['Salary', 'Freelance'].includes(category)).map((category) => `<option>${category}</option>`).join('')}</select></label></div><p class="form-error" id="subscriptionError"></p><button class="primary-button full-width" type="submit"><i class="fa-solid fa-check"></i> Save subscription</button></form></div></div>`;
  const form = document.getElementById('subscriptionForm');
  Object.entries(existing).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
  const close = () => { document.getElementById('featureModal').innerHTML = ''; };
  document.getElementById('closeFeature').addEventListener('click', close);
  form.addEventListener('submit', (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(form)); if (!values.serviceName.trim() || Number(values.amount) <= 0 || !values.nextPayment) { document.getElementById('subscriptionError').textContent = 'Add a name, positive amount, and next payment date.'; return; } updateData((data) => { if (id) { const index = data.subscriptions.findIndex((item) => item.id === id); data.subscriptions[index] = { ...data.subscriptions[index], ...values, amount: Number(values.amount) }; } else { data.subscriptions.push({ ...values, id: createId(), amount: Number(values.amount) }); } }); close(); renderSubscriptions(); showToast(id ? 'Subscription updated' : 'Subscription added', `${values.serviceName} is now being tracked.`); });
  form.elements.serviceName.focus();
}

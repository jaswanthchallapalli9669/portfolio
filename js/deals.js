document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'deals') return;

  setupPlatformTabs();
  setupDealsFilters();
  setupAffordabilityAdvisor();
  renderDeals();
  renderAdvisorSavings();

  window.addEventListener('fintrack:data-updated', () => {
    renderDeals();
    renderAdvisorSavings();
    updateAdvisorVerdict();
  });
});

let currentPlatform = 'all';

function renderAdvisorSavings() {
  const data = getData();
  const savings = Number(data.futureSavingsBalance) || 0;
  const badge = document.getElementById('advisorSavingsPool');
  if (badge) {
    badge.textContent = formatCurrency(savings);
  }
}

function setupPlatformTabs() {
  const tabs = document.querySelectorAll('.deal-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentPlatform = tab.dataset.platform;
      renderDeals();
    });
  });
}

function setupDealsFilters() {
  const searchInput = document.getElementById('searchDeals');
  const categoryFilter = document.getElementById('dealCategoryFilter');

  if (searchInput) searchInput.addEventListener('input', renderDeals);
  if (categoryFilter) categoryFilter.addEventListener('change', renderDeals);
}

function renderDeals() {
  const grid = document.getElementById('dealsGrid');
  if (!grid) return;

  const data = getData();
  const deals = data.deals || [];
  const searchQuery = (document.getElementById('searchDeals')?.value || '').toLowerCase().trim();
  const selectedCategory = document.getElementById('dealCategoryFilter')?.value || 'all';

  const filtered = deals.filter((deal) => {
    // Platform match
    let matchesPlatform = true;
    if (currentPlatform === 'Groceries') {
      matchesPlatform = ['Blinkit', 'Zepto'].includes(deal.platform);
    } else if (currentPlatform !== 'all') {
      matchesPlatform = deal.platform.toLowerCase() === currentPlatform.toLowerCase();
    }

    // Category match
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;

    // Search match
    const matchesSearch = !searchQuery ||
      deal.title.toLowerCase().includes(searchQuery) ||
      deal.platform.toLowerCase().includes(searchQuery) ||
      deal.description.toLowerCase().includes(searchQuery) ||
      deal.category.toLowerCase().includes(searchQuery) ||
      (deal.code && deal.code.toLowerCase().includes(searchQuery));

    return matchesPlatform && matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state page-empty" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-tags"></i>
        <h3>No matching deals found</h3>
        <p>Try clearing your search or switching stores.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((deal) => {
    const platformClass = deal.platform.toLowerCase();
    return `
      <article class="panel deal-card" data-deal-id="${deal.id}">
        <div class="deal-card-top">
          <span class="store-badge ${platformClass}">${deal.platform}</span>
          <span class="discount-pill">${deal.discount}</span>
        </div>
        <h3 class="deal-title">${deal.title}</h3>
        <p class="deal-description">${deal.description}</p>

        ${deal.bankOffer ? `
          <div class="bank-offer-note">
            <i class="fa-solid fa-credit-card"></i>
            <span>${deal.bankOffer}</span>
          </div>
        ` : ''}

        <div class="deal-price-row">
          <div>
            <span class="deal-label">Estimated Deal Price</span>
            <strong class="deal-effective-price">${formatCurrency(deal.discountedPrice)}</strong>
            <span class="deal-original-price">${formatCurrency(deal.estimatedPrice)}</span>
          </div>
        </div>

        ${deal.code ? `
          <div class="deal-coupon-row">
            <div class="coupon-box" title="Click to copy coupon code">
              <code>${deal.code}</code>
            </div>
            <button type="button" class="copy-coupon-btn" data-code="${deal.code}">
              <i class="fa-regular fa-copy"></i> Copy
            </button>
          </div>
        ` : ''}

        <div class="deal-card-actions">
          <button type="button" class="check-affordability-btn secondary-button" 
                  data-deal-name="${deal.title}"
                  data-deal-platform="${deal.platform}"
                  data-original-price="${deal.estimatedPrice}"
                  data-deal-price="${deal.discountedPrice}">
            <i class="fa-solid fa-calculator"></i> Check from Savings
          </button>
          <a href="${deal.link}" target="_blank" rel="noopener noreferrer" class="primary-button store-link-btn">
            Go to Store <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </article>
    `;
  }).join('');

  // Setup copy code event handlers
  grid.querySelectorAll('.copy-coupon-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const code = button.dataset.code;
      navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        button.classList.add('copied');
        showToast('Coupon Copied!', `Code "${code}" copied to clipboard.`);
        setTimeout(() => {
          button.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
          button.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // Setup 'Check from Savings' event handlers
  grid.querySelectorAll('.check-affordability-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.dealName;
      const platform = button.dataset.dealPlatform;
      const original = button.dataset.originalPrice;
      const price = button.dataset.dealPrice;

      document.getElementById('advisorItemName').value = name;
      document.getElementById('advisorPlatform').value = platform;
      document.getElementById('advisorOriginalPrice').value = original;
      document.getElementById('advisorDealPrice').value = price;

      updateAdvisorVerdict();

      // Smooth scroll to advisor
      document.getElementById('savingsAdvisorSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function setupAffordabilityAdvisor() {
  const form = document.getElementById('advisorForm');
  const priceInput = document.getElementById('advisorDealPrice');
  const nameInput = document.getElementById('advisorItemName');
  const buyBtn = document.getElementById('buyWithSavingsBtn');

  if (priceInput) priceInput.addEventListener('input', updateAdvisorVerdict);
  if (nameInput) nameInput.addEventListener('input', updateAdvisorVerdict);

  // Pre-fill initial state
  if (priceInput && !priceInput.value) {
    nameInput.value = 'Noise-Cancelling Headphones';
    document.getElementById('advisorOriginalPrice').value = '4999';
    priceInput.value = '2749';
    document.getElementById('advisorPlatform').value = 'Amazon';
  }

  updateAdvisorVerdict();

  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      const price = Number(document.getElementById('advisorDealPrice')?.value);
      const name = document.getElementById('advisorItemName')?.value || 'Discounted Item';
      const platform = document.getElementById('advisorPlatform')?.value || 'Shopping';

      if (!price || price <= 0) {
        showToast('Invalid Amount', 'Please enter a valid deal price.', 'warning');
        return;
      }

      const data = getData();
      const currentSavings = Number(data.futureSavingsBalance) || 0;

      if (price > currentSavings) {
        showToast('Insufficient Savings', `You need ${formatCurrency(price - currentSavings)} more in your savings pool.`, 'warning');
        return;
      }

      // Deduct from savings pool & add transaction
      updateData((d) => {
        d.futureSavingsBalance = Math.max(0, currentSavings - price);
        d.transactions.unshift({
          id: createId(),
          type: 'expense',
          amount: price,
          description: `${name} (${platform} Deal)`,
          category: ['Swiggy', 'Zomato'].includes(platform) ? 'Food' : 'Shopping',
          date: new Date().toISOString().slice(0, 10),
          paymentMethod: 'UPI',
          notes: `Purchased with discount from Future Buyings savings. Saved: ${formatCurrency(Number(document.getElementById('advisorOriginalPrice')?.value || price) - price)}`
        });
      });

      showToast('Deal Purchase Logged!', `${formatCurrency(price)} deducted safely from your Future Buyings pool.`);
      renderAdvisorSavings();
      updateAdvisorVerdict();
    });
  }
}

function updateAdvisorVerdict() {
  const price = Number(document.getElementById('advisorDealPrice')?.value) || 0;
  const data = getData();
  const evaluation = evaluateAffordability(price, data);

  const verdictBox = document.getElementById('advisorVerdictBox');
  const verdictTag = document.getElementById('verdictTag');
  const verdictTitle = document.getElementById('verdictTitle');
  const verdictMessage = document.getElementById('verdictMessage');
  const verdictPrice = document.getElementById('verdictPrice');
  const verdictPercent = document.getElementById('verdictPercent');
  const verdictRemaining = document.getElementById('verdictRemaining');
  const buyBtn = document.getElementById('buyWithSavingsBtn');

  if (!verdictBox) return;

  // Reset classes
  verdictBox.className = `verdict-container status-${evaluation.status}`;
  verdictTag.className = `verdict-tag ${evaluation.badgeClass || ''}`;
  verdictTag.textContent = evaluation.verdict;

  verdictPrice.textContent = formatCurrency(price);
  verdictPercent.textContent = `${evaluation.percentUsed || 0}%`;
  verdictRemaining.textContent = formatCurrency(evaluation.remainingSavings);
  verdictMessage.textContent = evaluation.message;

  if (evaluation.canBuy) {
    verdictTitle.textContent = `Safe to spend from your savings pool!`;
    buyBtn.style.display = 'inline-flex';
    buyBtn.disabled = false;
  } else {
    verdictTitle.textContent = price > 0 ? `Hold on — Savings shortfall!` : `Enter deal amount`;
    buyBtn.style.display = price > 0 ? 'none' : 'none';
  }
}

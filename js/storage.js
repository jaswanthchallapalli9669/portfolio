const STORAGE_KEY = 'fintrack-data-v1';

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Education',
  'Entertainment',
  'Bills',
  'Health',
  'Travel',
  'Salary',
  'Freelance',
  'Other'
];

const PAYMENT_METHODS = [
  'UPI',
  'Debit Card',
  'Credit Card',
  'Cash',
  'Bank Transfer',
  'Other'
];

const PLATFORMS = [
  'Amazon',
  'Flipkart',
  'Swiggy',
  'Zomato',
  'Myntra',
  'Blinkit',
  'Zepto',
  'Other'
];

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

function getSampleDeals() {
  return [
    {
      id: 'deal-1',
      platform: 'Swiggy',
      title: 'Flat 50% OFF on Gourmet & Quick Meals',
      discount: '50% OFF',
      code: 'SWIGGY50',
      category: 'Food & Dining',
      bankOffer: 'Extra ₹50 off on HDFC & ICICI Cards',
      description: 'Applicable on orders above ₹199 from top-rated restaurants.',
      link: 'https://www.swiggy.com',
      estimatedPrice: 350,
      discountedPrice: 175
    },
    {
      id: 'deal-2',
      platform: 'Zomato',
      title: '60% OFF + Flat Cashback on Everyday Dining',
      discount: '60% OFF',
      code: 'TASTY',
      category: 'Food & Dining',
      bankOffer: '15% instant discount via Axis Bank Credit Cards',
      description: 'Valid on select multi-cuisine and local favorites.',
      link: 'https://www.zomato.com',
      estimatedPrice: 400,
      discountedPrice: 160
    },
    {
      id: 'deal-3',
      platform: 'Amazon',
      title: 'Great Electronics Sale: Noise-Cancelling Headphones & Audio',
      discount: '45% OFF',
      code: 'AMZNAUDIO',
      category: 'Electronics',
      bankOffer: '10% instant discount up to ₹1,500 on SBI Cards',
      description: 'Top brands including boAt, Sony, JBL, and Sennheiser.',
      link: 'https://www.amazon.in',
      estimatedPrice: 4999,
      discountedPrice: 2749
    },
    {
      id: 'deal-4',
      platform: 'Flipkart',
      title: 'Big Savings Day: Smart Watches & Fitness Bands',
      discount: '55% OFF',
      code: 'FLIPKARTFIT',
      category: 'Electronics',
      bankOffer: '5% unlimited cashback with Flipkart Axis Card',
      description: 'AMOLED displays, heart rate sensors, water resistant.',
      link: 'https://www.flipkart.com',
      estimatedPrice: 3999,
      discountedPrice: 1799
    },
    {
      id: 'deal-5',
      platform: 'Myntra',
      title: 'End of Reason Fashion Sale: Premium Casual & Footwear',
      discount: '60% OFF + 15%',
      code: 'MYNTRA15',
      category: 'Fashion',
      bankOffer: '10% instant discount with Kotak & ICICI Cards',
      description: 'Extra 15% off on orders above ₹1,999 on top global brands.',
      link: 'https://www.myntra.com',
      estimatedPrice: 2499,
      discountedPrice: 850
    },
    {
      id: 'deal-6',
      platform: 'Amazon',
      title: 'Smart Home & Echo Essentials Festival',
      discount: '35% OFF',
      code: 'SMART35',
      category: 'Electronics',
      bankOffer: 'No-cost EMI available on all major credit cards',
      description: 'Echo smart speakers, Fire TV sticks, and Kindle Paperwhite.',
      link: 'https://www.amazon.in',
      estimatedPrice: 4499,
      discountedPrice: 2924
    },
    {
      id: 'deal-7',
      platform: 'Blinkit',
      title: 'Super Saver 10-Minute Grocery Fest',
      discount: '25% OFF',
      code: 'BLINKIT25',
      category: 'Groceries',
      bankOffer: 'Flat ₹50 cashback on UPI payments',
      description: 'Fresh farm fruits, dairy essentials, and kitchen staples.',
      link: 'https://blinkit.com',
      estimatedPrice: 800,
      discountedPrice: 600
    },
    {
      id: 'deal-8',
      platform: 'Zepto',
      title: 'Flat ₹100 OFF on Monthly Pantry Restock',
      discount: '₹100 OFF',
      code: 'ZEPTO100',
      category: 'Groceries',
      bankOffer: 'Extra ₹30 cashback on CRED Pay',
      description: 'Orders above ₹499 delivered in 10 minutes.',
      link: 'https://www.zeptonow.com',
      estimatedPrice: 650,
      discountedPrice: 550
    }
  ];
}

function getSampleData() {
  return {
    profile: {
      name: 'Jaswanth',
      email: 'jaswanth@example.com'
    },
    settings: {
      theme: 'light',
      currency: 'INR'
    },
    salaryProfile: {
      monthlySalary: 52000,
      payDay: 1,
      allocations: {
        needs: 50,
        wants: 30,
        savings: 20
      }
    },
    futureSavingsBalance: 18500,
    transactions: [
      {
        id: createId(),
        type: 'income',
        amount: 52000,
        description: 'Monthly salary credited',
        category: 'Salary',
        date: daysAgo(2),
        paymentMethod: 'Bank Transfer',
        notes: 'Credited to primary account'
      },
      {
        id: createId(),
        type: 'expense',
        amount: 850,
        description: 'Weekly groceries',
        category: 'Food',
        date: daysAgo(3),
        paymentMethod: 'UPI',
        notes: ''
      },
      {
        id: createId(),
        type: 'expense',
        amount: 320,
        description: 'Metro recharge',
        category: 'Transport',
        date: daysAgo(5),
        paymentMethod: 'UPI',
        notes: ''
      },
      {
        id: createId(),
        type: 'expense',
        amount: 1800,
        description: 'Online course & books',
        category: 'Education',
        date: daysAgo(8),
        paymentMethod: 'Debit Card',
        notes: ''
      },
      {
        id: createId(),
        type: 'expense',
        amount: 640,
        description: 'Dinner with friends on Swiggy',
        category: 'Food',
        date: daysAgo(11),
        paymentMethod: 'UPI',
        notes: 'Swiggy discount applied'
      },
      {
        id: createId(),
        type: 'income',
        amount: 7500,
        description: 'Freelance UI design',
        category: 'Freelance',
        date: daysAgo(14),
        paymentMethod: 'Bank Transfer',
        notes: ''
      },
      {
        id: createId(),
        type: 'expense',
        amount: 1250,
        description: 'Electricity & Wifi bill',
        category: 'Bills',
        date: daysAgo(17),
        paymentMethod: 'UPI',
        notes: ''
      },
      {
        id: createId(),
        type: 'expense',
        amount: 2200,
        description: 'Running shoes from Flipkart Deal',
        category: 'Shopping',
        date: daysAgo(21),
        paymentMethod: 'Debit Card',
        notes: 'Bought with savings discount'
      }
    ],
    budgets: [
      { id: createId(), category: 'Food', amount: 8000 },
      { id: createId(), category: 'Transport', amount: 3000 },
      { id: createId(), category: 'Bills', amount: 5000 },
      { id: createId(), category: 'Shopping', amount: 6000 },
      { id: createId(), category: 'Entertainment', amount: 3000 }
    ],
    goals: [
      {
        id: createId(),
        name: 'New Noise-Cancelling Headphones',
        target: 4000,
        saved: 2750,
        targetDate: daysAgo(-30),
        description: 'Waiting for the Amazon/Flipkart sale discount.'
      },
      {
        id: createId(),
        name: 'Emergency Fund',
        target: 50000,
        saved: 18500,
        targetDate: daysAgo(-180),
        description: '3 months of essential buffer.'
      }
    ],
    subscriptions: [
      {
        id: createId(),
        serviceName: 'Swiggy One',
        amount: 299,
        billingCycle: 'Quarterly',
        nextPayment: daysAgo(-20),
        category: 'Food'
      },
      {
        id: createId(),
        serviceName: 'Amazon Prime',
        amount: 1499,
        billingCycle: 'Yearly',
        nextPayment: daysAgo(-110),
        category: 'Shopping'
      }
    ],
    deals: getSampleDeals()
  };
}

function getData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const sample = getSampleData();
    saveData(sample);
    return sample;
  }
  try {
    const parsed = JSON.parse(saved);
    let modified = false;

    if (!parsed.salaryProfile) {
      parsed.salaryProfile = {
        monthlySalary: 52000,
        payDay: 1,
        allocations: { needs: 50, wants: 30, savings: 20 }
      };
      modified = true;
    }
    if (parsed.futureSavingsBalance === undefined) {
      parsed.futureSavingsBalance = 18500;
      modified = true;
    }
    if (!Array.isArray(parsed.deals) || parsed.deals.length === 0) {
      parsed.deals = getSampleDeals();
      modified = true;
    }
    if (!Array.isArray(parsed.subscriptions)) {
      parsed.subscriptions = [];
      modified = true;
    }

    if (modified) {
      saveData(parsed);
    }
    return parsed;
  } catch {
    const sample = getSampleData();
    saveData(sample);
    return sample;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('fintrack:data-updated'));
}

function updateData(updater) {
  const data = getData();
  updater(data);
  saveData(data);
  return data;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${date}T00:00:00`));
}

function getMonthKey(date) {
  return date.slice(0, 7);
}

function getMonthTransactions(transactions, monthKey = getMonthKey(new Date().toISOString().slice(0, 10))) {
  return transactions.filter((transaction) => getMonthKey(transaction.date) === monthKey);
}

function totals(transactions) {
  return transactions.reduce(
    (result, transaction) => {
      result[transaction.type] += Number(transaction.amount);
      return result;
    },
    { income: 0, expense: 0 }
  );
}

function getCategoryTotals(transactions) {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((result, transaction) => {
      result[transaction.category] = (result[transaction.category] || 0) + Number(transaction.amount);
      return result;
    }, {});
}

// Salary & Savings Helper Breakdown
function getSalarySummary(data = getData()) {
  const salary = Number(data.salaryProfile?.monthlySalary) || 0;
  const allocations = data.salaryProfile?.allocations || { needs: 50, wants: 30, savings: 20 };
  
  const currentMonthTransactions = getMonthTransactions(data.transactions);
  const currentMonthExpense = totals(currentMonthTransactions).expense;

  const needsBudget = Math.round(salary * (allocations.needs / 100));
  const wantsBudget = Math.round(salary * (allocations.wants / 100));
  const monthlySavingsTarget = Math.round(salary * (allocations.savings / 100));

  const safeToSpend = Math.max(0, salary - currentMonthExpense - monthlySavingsTarget);
  const futureSavings = Number(data.futureSavingsBalance) || 0;

  return {
    salary,
    spentThisMonth: currentMonthExpense,
    needsBudget,
    wantsBudget,
    monthlySavingsTarget,
    safeToSpend,
    futureSavings,
    allocations
  };
}

// Evaluates whether a purchase is safe from current savings
function evaluateAffordability(price, data = getData()) {
  const savings = Number(data.futureSavingsBalance) || 0;
  const numPrice = Number(price) || 0;

  if (numPrice <= 0) {
    return {
      status: 'idle',
      verdict: 'Enter item price',
      message: 'Enter the deal price to see if it fits safely in your future buyings savings.',
      remainingSavings: savings,
      percentUsed: 0
    };
  }

  const percentUsed = Math.round((numPrice / (savings || 1)) * 100);
  const remaining = savings - numPrice;

  if (numPrice <= savings) {
    if (percentUsed <= 25) {
      return {
        status: 'safe',
        verdict: 'Safe to Buy! 🟢',
        badgeClass: 'safe',
        message: `Great deal! This takes only ${percentUsed}% of your future savings pool. You'll still have ${formatCurrency(remaining)} left safely in your savings.`,
        remainingSavings: remaining,
        percentUsed,
        canBuy: true
      };
    } else if (percentUsed <= 60) {
      return {
        status: 'moderate',
        verdict: 'Moderate Impact 🟡',
        badgeClass: 'moderate',
        message: `You can comfortably afford this, but it takes ${percentUsed}% of your future savings. Remaining savings: ${formatCurrency(remaining)}.`,
        remainingSavings: remaining,
        percentUsed,
        canBuy: true
      };
    } else {
      return {
        status: 'stretch',
        verdict: 'Big Stretch 🟠',
        badgeClass: 'stretch',
        message: `Caution: This consumes ${percentUsed}% of your entire savings. It will leave you with only ${formatCurrency(remaining)}. Only proceed if it is a top priority item!`,
        remainingSavings: remaining,
        percentUsed,
        canBuy: true
      };
    }
  } else {
    const shortfall = numPrice - savings;
    const monthlyTarget = Math.round((data.salaryProfile?.monthlySalary || 50000) * ((data.salaryProfile?.allocations?.savings || 20) / 100)) || 5000;
    const monthsToSave = Math.ceil(shortfall / (monthlyTarget || 1));

    return {
      status: 'shortfall',
      verdict: 'Need More Savings 🔴',
      badgeClass: 'danger',
      message: `You are short by ${formatCurrency(shortfall)} from your savings pool. At your current savings rate (${formatCurrency(monthlyTarget)}/mo), you can buy this in ${monthsToSave} month${monthsToSave > 1 ? 's' : ''}!`,
      remainingSavings: 0,
      shortfall,
      monthsToSave,
      percentUsed,
      canBuy: false
    };
  }
}

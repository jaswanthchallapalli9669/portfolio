document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'settings') return;

  const data = getData();
  const form = document.getElementById('profileForm');
  const salaryForm = document.getElementById('salaryForm');

  // Profile Form
  if (form) {
    form.name.value = data.profile.name;
    form.email.value = data.profile.email;
    form.onsubmit = (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      updateData((next) => { next.profile = values; });
      showMessage('Profile saved successfully.');
      document.getElementById('profileName').textContent = values.name;
      if (typeof showToast === 'function') showToast('Profile Updated', 'Personal details saved.');
    };
  }

  // Salary & Savings Form
  if (salaryForm) {
    const salaryProfile = data.salaryProfile || { monthlySalary: 52000, payDay: 1, allocations: { needs: 50, wants: 30, savings: 20 } };
    salaryForm.monthlySalary.value = salaryProfile.monthlySalary || 52000;
    salaryForm.futureSavingsBalance.value = data.futureSavingsBalance !== undefined ? data.futureSavingsBalance : 18500;
    salaryForm.savingsPercent.value = salaryProfile.allocations?.savings || 20;
    salaryForm.payDay.value = salaryProfile.payDay || 1;

    salaryForm.onsubmit = (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(salaryForm));
      const monthlySalary = Number(values.monthlySalary);
      const futureSavingsBalance = Number(values.futureSavingsBalance);
      const savings = Math.min(Math.max(Number(values.savingsPercent), 5), 80);
      const needs = Math.round((100 - savings) * 0.6);
      const wants = 100 - savings - needs;

      updateData((next) => {
        next.salaryProfile = {
          monthlySalary,
          payDay: Number(values.payDay),
          allocations: { needs, wants, savings }
        };
        next.futureSavingsBalance = futureSavingsBalance;
      });

      showMessage('Salary and Future Savings preferences updated!');
      if (typeof showToast === 'function') {
        showToast('Salary & Savings Updated', `Monthly salary set to ${formatCurrency(monthlySalary)}.`);
      }
    };
  }

  document.getElementById('settingsTheme').onclick = () => {
    updateData((next) => { next.settings.theme = document.body.classList.contains('dark') ? 'light' : 'dark'; });
    document.body.classList.toggle('dark');
  };

  document.getElementById('exportCsv').onclick = exportCsv;
  document.getElementById('exportJson').onclick = exportJson;
  document.getElementById('importJson').onchange = importJson;
  document.getElementById('clearData').onclick = () => {
    if (confirm('Clear all transactions, budgets, goals, and savings? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      location.href = 'index.html';
    }
  };
});

function download(content, name, type) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([content], { type }));
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportCsv() {
  const rows = getData().transactions;
  const header = 'Type,Amount,Description,Category,Date,Payment method,Notes';
  const csv = [
    header,
    ...rows.map((item) =>
      [item.type, item.amount, item.description, item.category, item.date, item.paymentMethod, item.notes]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(',')
    )
  ].join('\n');
  download(csv, 'fintrack-transactions.csv', 'text/csv');
}

function exportJson() {
  download(JSON.stringify(getData(), null, 2), 'fintrack-backup.json', 'application/json');
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const backup = JSON.parse(reader.result);
      if (!backup.transactions || !backup.budgets || !backup.goals) throw new Error();
      saveData(backup);
      showMessage('Backup imported. Refreshing...');
      setTimeout(() => location.reload(), 600);
    } catch {
      showMessage('That file is not a valid FinTrack backup.');
    }
  };
  reader.readAsText(file);
}

function showMessage(message) {
  document.getElementById('settingsMessage').textContent = message;
}

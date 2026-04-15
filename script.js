// ================= GLOBAL =================
let userId = localStorage.getItem("userId"); // ✅ persist login

// ================= NAVIGATION ===========
const navBtns = document.querySelectorAll('.nav-btn[data-section]');
const sections = document.querySelectorAll('.section');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.section;

    navBtns.forEach(b => b.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(target).classList.add('active');

if (target === 'history' && userId) fetchTransactions();
if (target === 'debts') {
  setTimeout(() => {
    setDefaultDates();
    loadDebts();
  }, 100);
}

if (target === 'subscriptions') {
  setTimeout(() => {
    setDefaultDates();
    loadSubs();
  }, 100);
}
  });
});

// ================= HELPERS =================
function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN');
}

// ================= DEFAULT DATE =================
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];

  const tDate = document.getElementById('t-date');
  const iDate = document.getElementById('i-date');

  if (tDate) tDate.value = today;
  if (iDate) iDate.value = today;
}
setTodayDate();

// ================= TOTAL COST =================
const priceInput = document.getElementById('i-price');
const qtyInput = document.getElementById('i-qty');
const totalInput = document.getElementById('i-total');

function updateTotal() {
  const price = Number(priceInput.value) || 0;
  const qty = Number(qtyInput.value) || 0;
  totalInput.value = "₹" + (price * qty).toFixed(2);
}

if (priceInput && qtyInput) {
  priceInput.addEventListener('input', updateTotal);
  qtyInput.addEventListener('input', updateTotal);
}

// ================= FETCH TRANSACTIONS =================
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
  refreshBtn.addEventListener('click', fetchTransactions);
}

async function fetchTransactions() {
  if (!userId) return;

  const container = document.getElementById('tableContainer');
  container.innerHTML = "Loading...";

  try {
    const res = await fetch(`/transactions/${userId}`);
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = "No transactions";
      return;
    }

    let income = 0, expense = 0;

    let html = `
      <table>
        <tr>
          <th>Date</th><th>Type</th><th>Category</th>
          <th>Amount</th><th>Note</th>
        </tr>
    `;

    data.forEach(row => {
      const amt = Number(row.amount);

      if (row.type === 'income') income += amt;
      else expense += amt;

      html += `
        <tr>
          <td>${formatDate(row.date)}</td>
          <td>${row.type}</td>
          <td>${row.category}</td>
          <td>${fmt(amt)}</td>
          <td>${row.note || '-'}</td>
        </tr>
      `;
    });

    html += "</table>";
    container.innerHTML = html;
    // ================= UPDATE STATS =================
document.getElementById('statIncome').textContent = fmt(income);
document.getElementById('statExpense').textContent = fmt(expense);
document.getElementById('statNet').textContent = fmt(income - expense);

    // ================= GRAPH =================
    if (window.Plotly) {
      Plotly.newPlot('chart', [{
        values: [income, expense],
        labels: ['Income', 'Expense'],
        type: 'pie',
        hole: 0.6
      }]);
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = "Error loading data";
  }
}

// ================= ADD TRANSACTION =================
document.getElementById('transactionForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  await fetch('/add-transaction', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      user_id: userId,
      type: document.getElementById('t-type').value,
      amount: document.getElementById('t-amount').value,
      category: document.getElementById('t-category').value,
      date: document.getElementById('t-date').value,
      note: document.getElementById('t-note').value
    })
  });

  alert("Saved ✅");
});

// ================= LOGIN =================
const loginForm = document.getElementById('loginForm');
const mainNav = document.getElementById('mainNav');
const logoutBtn = document.getElementById('logoutBtn');
const transactionsBtn = document.getElementById('nav-transactions');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  let email = document.getElementById('l-email').value.trim();
  let password = document.getElementById('l-password').value.trim();

  const res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    userId = data.userId;

    localStorage.setItem("userId", userId); // ✅ persist

    document.getElementById('login').classList.remove('active');
    mainNav.style.display = 'flex';

    transactionsBtn.click();

    alert("Login successful ✅");
  } else {
    alert("Invalid credentials ❌");
  }
});

// ================= LOGOUT =================
logoutBtn.addEventListener('click', () => {
  userId = null;
  localStorage.removeItem("userId");

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  mainNav.style.display = 'none';
  document.getElementById('login').classList.add('active');
});

// ================= REGISTER =================
document.getElementById('registerBtn').addEventListener('click', async () => {

  let email = prompt("Enter Email:");
  let password = prompt("Enter Password:");

  if (!email || !password) return alert("Invalid input ❌");

  email = email.trim();
  password = password.trim();

  const res = await fetch('/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);
});

// ================= INVESTMENTS =================
const invForm = document.getElementById('investmentForm');

if (invForm) {
  invForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      await fetch('/add-investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          stock_name: document.getElementById('i-stock').value,
          exchange: document.getElementById('i-exchange').value,
          buy_price: document.getElementById('i-price').value,
          quantity: document.getElementById('i-qty').value,
          date: document.getElementById('i-date').value
        })
      });

      // ✅ NOW alert is correct
      alert("Investment Added ✅");

    } catch (err) {
      console.error(err);
      alert("Error adding investment ❌");
    }
  });
}
document.getElementById('viewPortfolioBtn').addEventListener('click', async () => {
  const container = document.getElementById('portfolioContainer');

  const res = await fetch(`/investments/${userId}`);
  const data = await res.json();

  let html = `
    <table>
      <tr>
        <th>Stock</th><th>Total</th>
      </tr>
  `;

  data.forEach(row => {
    html += `
      <tr>
        <td>${row.stock_name}</td>
        <td>${fmt(row.buy_price * row.quantity)}</td>
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;
});
// ================= COMMON DATE FORMAT =================
function formatDateOnly(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}
async function addDebt() {
  const name = document.getElementById('name').value;
  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value;
  const note = document.getElementById('note').value;

  if (!name || !amount) return alert("Fill all fields");

  await fetch('/add-debt', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      user_id:userId,
      person_name:name,
      amount,
      type,
      due_date:date,
      note
    })
  });

  loadDebts();
}

async function loadDebts() {
  const creditDiv = document.getElementById('creditList');
  const debitDiv = document.getElementById('debitList');

  if (!creditDiv || !debitDiv) return;

  const res = await fetch(`/debts/${userId}`);
  const data = await res.json();

  let credit="", debit="";

  data.forEach(d => {
    const date = formatDateOnly(d.due_date);

    const isPaid = d.status === "Settled";

    const card = `
      <div class="card ${isPaid ? 'paid' : ''}">
        <b>${d.person_name}</b><br>
        <span style="color:${d.type==="owed"?"lightgreen":"red"}">
          ${d.type==="owed"?"+":"-"} ₹${d.amount}
        </span><br>
        ${date}<br>
        <small>Status: ${d.status}</small><br>

        <button onclick="markPaid(${d.id})">✔ Paid</button>
        <button onclick="deleteDebt(${d.id})">🗑 Delete</button>
      </div>
    `;

    if (d.type === "owed") credit += card;
    else debit += card;
  });

  creditDiv.innerHTML = credit;
  debitDiv.innerHTML = debit;
}

// ✅ MARK PAID
async function markPaid(id) {
  await fetch(`/update-debt/${id}`, { method:'PUT' });
  loadDebts();
}

function getStatus(date) {
  const today = new Date();
  const due = new Date(date);

  const diff = (due - today) / (1000*60*60*24);

  if (diff < 0) return "Expired";
  if (diff <= 2) return "Pay Now";
  return "Active";
}

async function loadSubs() {
  const monthlyDiv = document.getElementById('monthlySubs');
  const yearlyDiv = document.getElementById('yearlySubs');

  if (!monthlyDiv || !yearlyDiv) return;

  const res = await fetch(`/subscriptions/${userId}`);
  const data = await res.json();

  let monthly="", yearly="";

  data.forEach(s => {
    const date = formatDateOnly(s.next_payment);
    const status = getStatus(date);

    let color = "lightgreen";
    if (status === "Pay Now") color = "orange";
    if (status === "Expired") color = "red";

    const card = `
      <div class="card">
        <b>${s.name}</b><br>
        ₹${s.amount}<br>
        Next: ${date}<br>
        <span style="color:${color}">Status: ${status}</span><br>

        <button onclick="payAgain(${s.id}, '${s.billing_cycle}')">💳 Pay</button>
        <button onclick="deleteSub(${s.id})">🗑 Delete</button>
      </div>
    `;

    if (s.billing_cycle === "Monthly") monthly += card;
    else yearly += card;
  });

  monthlyDiv.innerHTML = monthly;
  yearlyDiv.innerHTML = yearly;
}
async function payAgain(id, cycle) {

  let nextDate = new Date();

  if (cycle === "Monthly") {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  }

  const formatted = nextDate.toISOString().split('T')[0];

  await fetch(`/update-subscription/${id}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      next_payment: formatted
    })
  });

  loadSubs();
}
async function addSub() {
  const name = document.getElementById('s-name').value;
  const amount = document.getElementById('s-amount').value;
  const cycle = document.getElementById('s-cycle').value;
  const date = document.getElementById('s-date').value;

  if (!name || !amount) return alert("Fill all fields");

  await fetch('/add-subscription', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      user_id:userId,
      name,
      amount,
      billing_cycle:cycle,
      next_payment:date
    })
  });

  loadSubs();
}
async function deleteDebt(id) {
  await fetch(`/delete-debt/${id}`, { method:'DELETE' });
  loadDebts();
}
async function deleteSub(id) {
  await fetch(`/delete-subscription/${id}`, { method:'DELETE' });
  loadSubs();
}
// ================= DEFAULT DATES =================
function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];

  const debtDate = document.getElementById('date');
  const subDate = document.getElementById('s-date');

  if (debtDate) debtDate.value = today;
  if (subDate) subDate.value = today;
}

// run on page load
setDefaultDates();
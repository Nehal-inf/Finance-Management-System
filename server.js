const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ================= DATABASE =================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rohith@500', // 🔴 CHANGE THIS
    database: 'FinanceTracker'
});

db.connect(err => {
    if (err) console.error(err);
    else console.log("✅ MySQL Connected");
});

// ================= REGISTER =================
app.post('/register', (req, res) => {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, password],
        err => {
            if (err) return res.json({ message: "User already exists ❌" });
            res.json({ message: "Registered successfully ✅" });
        }
    );
});

// ================= LOGIN (FIXED) =================
app.post('/login', (req, res) => {
    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.json({ success: false });
            }

            // 🔥 manual comparison (fix)
            if (result[0].password === password) {
                res.json({ success: true, userId: result[0].id });
            } else {
                res.json({ success: false });
            }
        }
    );
});

// ================= TRANSACTIONS =================
app.post('/add-transaction', (req, res) => {
    const { user_id, type, amount, category, date, note } = req.body;

    db.query(
        "INSERT INTO transactions (user_id,type,amount,category,date,note) VALUES (?,?,?,?,?,?)",
        [user_id, type, amount, category, date, note],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Transaction Added ✅" });
        }
    );
});

app.get('/transactions/:user_id', (req, res) => {
    db.query(
        "SELECT * FROM transactions WHERE user_id=? ORDER BY date DESC",
        [req.params.user_id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.delete('/delete-transaction/:id', (req, res) => {
    db.query("DELETE FROM transactions WHERE id=?", [req.params.id], err => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted ✅" });
    });
});

app.put('/update-transaction/:id', (req, res) => {
    const { type, amount, category, date, note } = req.body;

    db.query(
        "UPDATE transactions SET type=?,amount=?,category=?,date=?,note=? WHERE id=?",
        [type, amount, category, date, note, req.params.id],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Updated ✅" });
        }
    );
});

// ================= INVESTMENTS =================
app.post('/add-investment', (req, res) => {
    const { user_id, stock_name, exchange, buy_price, quantity, date } = req.body;

    db.query(
        "INSERT INTO investments (user_id,stock_name,exchange,buy_price,quantity,date) VALUES (?,?,?,?,?,?)",
        [user_id, stock_name, exchange, buy_price, quantity, date],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Investment Added ✅" });
        }
    );
});

app.get('/investments/:user_id', (req, res) => {
    db.query(
        "SELECT * FROM investments WHERE user_id=? ORDER BY date DESC",
        [req.params.user_id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});
// ================= DEBTS =================

// ADD DEBT
app.post('/add-debt', (req, res) => {
    const { user_id, person_name, amount, type, due_date, note } = req.body;

    db.query(
        "INSERT INTO debts (user_id, person_name, amount, type, due_date, note) VALUES (?,?,?,?,?,?)",
        [user_id, person_name, amount, type, due_date, note],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Debt Added ✅" });
        }
    );
});

// GET DEBTS
app.get('/debts/:user_id', (req, res) => {
    db.query(
        "SELECT * FROM debts WHERE user_id=? ORDER BY due_date DESC",
        [req.params.user_id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

// MARK AS PAID
app.put('/update-debt/:id', (req, res) => {
    db.query(
        "UPDATE debts SET status='Settled' WHERE id=?",
        [req.params.id],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Updated ✅" });
        }
    );
});

// DELETE DEBT
app.delete('/delete-debt/:id', (req, res) => {
    db.query(
        "DELETE FROM debts WHERE id=?",
        [req.params.id],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Deleted ✅" });
        }
    );
});
// ================= SUBSCRIPTIONS =================

// ADD
app.post('/add-subscription', (req, res) => {
    const { user_id, name, amount, billing_cycle, next_payment } = req.body;

    db.query(
        "INSERT INTO subscriptions (user_id,name,amount,billing_cycle,next_payment) VALUES (?,?,?,?,?)",
        [user_id, name, amount, billing_cycle, next_payment],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Added ✅" });
        }
    );
});

// GET
app.get('/subscriptions/:user_id', (req, res) => {
    db.query(
        "SELECT * FROM subscriptions WHERE user_id=? ORDER BY next_payment",
        [req.params.user_id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

// DELETE
app.delete('/delete-subscription/:id', (req, res) => {
    db.query(
        "DELETE FROM subscriptions WHERE id=?",
        [req.params.id],
        err => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Deleted" });
        }
    );
});

// ================= SERVER =================
app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
app.put('/update-subscription/:id', (req, res) => {
  const { next_payment } = req.body;

  db.query(
    "UPDATE subscriptions SET next_payment=? WHERE id=?",
    [next_payment, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated ✅" });
    }
  );
});
# 💰 Finance Tracker System

## 📌 Overview

This project implements a **Finance Tracker Database System** designed to manage user accounts, transactions, debts, and subscription payments. The system follows **relational database principles** to ensure **data consistency, integrity, and scalability**.

---

## 🛠️ Tech Stack

### 🌐 Frontend

* HTML
* CSS
* JavaScript

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* MySQL

### 🔧 Tools & Environment

* VS Code
* Git & GitHub
* MySQL Workbench

---

## 🗂️ Database Name

**finance_tracker**

---

## 📊 Tables in the Database

The system consists of the following tables:

* **Users**
* **Transactions**
* **Debts**
* **Subscriptions**
* **Payments**

---

# 👤 Users Table

## 📌 Description

The **Users** table stores login credentials and user details. It acts as the **primary entity** for the system.

---

## 📋 Columns

| Column Name  | Data Type                | Description        |
| ------------ | ------------------------ | ------------------ |
| **ID**       | INT (PK, AUTO_INCREMENT) | Unique user ID     |
| **NAME**     | VARCHAR(100)             | User full name     |
| **EMAIL**    | VARCHAR(100)             | User email         |
| **PASSWORD** | VARCHAR(255)             | Encrypted password |

---

## ⚙️ Key Points

* **ID** is the **Primary Key**
* Stores authentication details
* Used for linking all user-related data

---

## 🎯 Purpose

* Manage user login system
* Maintain identity of users
* Connect all financial data

---

# 💸 Transactions Table

## 📌 Description

The **Transactions** table records all income and expense activities.

---

## 📋 Columns

| Column Name  | Data Type                | Description        |
| ------------ | ------------------------ | ------------------ |
| **ID**       | INT (PK, AUTO_INCREMENT) | Transaction ID     |
| **USER_ID**  | INT (FK)                 | References user    |
| **TYPE**     | VARCHAR(20)              | Income / Expense   |
| **CATEGORY** | VARCHAR(50)              | Expense category   |
| **AMOUNT**   | DECIMAL(10,2)            | Transaction amount |
| **DATE**     | DATE                     | Transaction date   |

---

## ⚙️ Key Points

* Linked with **Users table**
* Stores dynamic financial data
* Used for analytics and history

---

## 🎯 Purpose

* Track income & expenses
* Maintain financial history
* Analyze spending patterns

---

# 💸 Debts Table

## 📌 Description

The **Debts** table manages borrowing and lending between users and others.

---

## 📋 Columns

| Column Name     | Data Type                | Description        |
| --------------- | ------------------------ | ------------------ |
| **ID**          | INT (PK, AUTO_INCREMENT) | Debt ID            |
| **USER_ID**     | INT (FK)                 | References user    |
| **PERSON_NAME** | VARCHAR(100)             | Person involved    |
| **AMOUNT**      | DECIMAL(10,2)            | Debt amount        |
| **TYPE**        | VARCHAR(20)              | **Credit / Debit** |
| **DUE_DATE**    | DATE                     | Due date           |
| **STATUS**      | VARCHAR(20)              | Pending / Settled  |
| **NOTE**        | TEXT                     | Optional note      |

---

## ⚙️ Key Points

* Divided into:

  * **Credit → They owe you**
  * **Debit → You owe them**
* Supports status tracking

---

## 🎯 Purpose

* Track borrowed money
* Manage repayments
* Maintain financial clarity

---

# 💳 Subscriptions Table

## 📌 Description

The **Subscriptions** table stores recurring payments like Netflix, Spotify, etc.

---

## 📋 Columns

| Column Name       | Data Type                | Description       |
| ----------------- | ------------------------ | ----------------- |
| **ID**            | INT (PK, AUTO_INCREMENT) | Subscription ID   |
| **USER_ID**       | INT (FK)                 | References user   |
| **NAME**          | VARCHAR(100)             | Service name      |
| **AMOUNT**        | DECIMAL(10,2)            | Subscription cost |
| **BILLING_CYCLE** | VARCHAR(20)              | Monthly / Yearly  |
| **NEXT_PAYMENT**  | DATE                     | Next payment date |

---

## ⚙️ Key Points

* Divided into:

  * Monthly subscriptions
  * Yearly subscriptions
* Helps track recurring expenses

---

## 🎯 Purpose

* Monitor recurring payments
* Avoid missed payments
* Plan monthly budgets

---

# 💵 Payments Table

## 📌 Description

The **Payments** table records subscription payment history.

---

## 📋 Columns

| Column Name         | Data Type                | Description             |
| ------------------- | ------------------------ | ----------------------- |
| **ID**              | INT (PK, AUTO_INCREMENT) | Payment ID              |
| **SUBSCRIPTION_ID** | INT (FK)                 | References subscription |
| **AMOUNT**          | DECIMAL(10,2)            | Paid amount             |
| **PAYMENT_DATE**    | DATE                     | Payment date            |

---

## ⚙️ Key Points

* Linked with **Subscriptions table**
* Maintains payment logs

---

## 🎯 Purpose

* Track subscription payments
* Maintain financial history

---

# 🔗 Relationships Between Tables

## 📌 Type: One-to-Many

### Explanation:

* One user → many transactions
* One user → many debts
* One user → many subscriptions
* One subscription → many payments

---

## 📌 Relationship Mapping

| Table         | Key             | Reference          |
| ------------- | --------------- | ------------------ |
| Users         | ID              | Primary Key        |
| Transactions  | USER_ID         | FK → Users         |
| Debts         | USER_ID         | FK → Users         |
| Subscriptions | USER_ID         | FK → Users         |
| Payments      | SUBSCRIPTION_ID | FK → Subscriptions |

---

# 🚀 Conclusion

This Finance Tracker system provides a structured way to:

* Manage personal finances
* Track spending and income
* Monitor debts and repayments
* Handle subscription payments efficiently

---

const express = require("express");
const router = express.Router();
const auth = require("../auth");
const Expense = require("../models/expense");

router.get("/", auth, async (req, res) => {
  const Expenses = await Expense.find({ username: req.session.username });
  const categoryFilter = req.query.category;
  const dateFilter = req.query.filterDate;

  let filteredExpenses = Expenses;

  if (categoryFilter) {
    filteredExpenses = filteredExpenses.filter(
      (expense) => expense.category === categoryFilter
    );
  }

  if (dateFilter) {
    filteredExpenses = filteredExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const filterDate = new Date(dateFilter);
      return (
        expenseDate.getFullYear() === filterDate.getFullYear() &&
        expenseDate.getMonth() === filterDate.getMonth()
      );
    });
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const totalAmount = filteredExpenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() + 1 === currentMonth;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  res.render("index", {
    Expenses,
    user: req.session.username,
    filteredExpenses,
    totalAmount,
  });
});

router.post("/", auth, async (req, res) => {
  const Expenses = new Expense({
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    username: req.session.username,
  });
  await Expenses.save();
  res.redirect("/");
});

router.delete("/:id", auth, async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
module.exports = router;

const Expense = require('../models/expensesModel')

exports.index = async (req,res) =>{
    const expenses = await Expense.expenseSearch()
    res.render('index.ejs', {expenses})
}

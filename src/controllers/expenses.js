const Expenses = require('../models/expensesModel')

exports.index = (req, res) => {
    res.render('expenses', { expenses: {} })
}

exports.record = async (req, res) => {
    try {
        const expense = new Expenses(req.body)
        await expense.register()

        if (expense.errors.length > 0) {
            req.flash('errors', expense.errors)
            req.session.save(() => res.redirect('/expenses'))
            return
        }
        req.flash('success', 'Expense record successfully!')
        req.session.save(() => res.redirect(`/expenses/${expense.expenses._id}`))
            return
            
    } catch (error) {
        console.log(error)
    }

}

exports.editIndex = async (req, res) => {

    if (!req.params.id) return res.render('404')

    const expenses = await Expenses.idSearch(req.params.id)

    if (!expenses) return res.render('404')

    res.render('expenses', { expenses })
}

exports.edit = async (req, res) => {

    try {
        if (!req.params.id) return res.render('404')

        const expense = new Expenses(req.body)
    
        await expense.edit(req.params.id)
        if (expense.errors.length > 0) {
            req.flash('errors', expense.errors)
            req.session.save(() => res.redirect('/expenses'))
            return
        }
        req.flash('success', 'Expense edited successfully!')
        req.session.save(() => res.redirect(`/expenses/${expense.expenses._id}`))
        return
    } catch (error) {
        console.log(error)
        res.render('404')
    }


}

exports.delete = async (req,res) =>{
    if (!req.params.id) return res.render('404')

    const expenses = await Expenses.delete(req.params.id)
    if (!expenses) return res.render('404')

    req.flash('success', 'Expense delete successfully!')
    req.session.save(() => res.redirect(`/`))
    return

}
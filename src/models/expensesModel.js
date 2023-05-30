const mongoose = require('mongoose')

const ExpensesSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    dateCreateSystem: { type: Date, default: Date.now },
})

const ExpensesModel = mongoose.model('Expenses', ExpensesSchema)

class Expenses {
    constructor(body) {
        this.body = body
        this.errors = []
        this.expenses = null
    }

    static async idSearch(id) {
        if (typeof id !== 'string') {
            return
        }
        const expense = await ExpensesModel.findById(id)
        return expense
    }

    static async expenseSearch() {
        const expenses = await ExpensesModel.find()
            .sort({ dateCreateSystem: -1 })
        return expenses
    }

    static async delete(id) {
        if (typeof id !== 'string') {
            return
        }
        const expense = await ExpensesModel.findByIdAndDelete(id) 
        return expense
    }

    async register() {
        this.valid()
        if (this.errors.length > 0) {
            return
        }

        this.expenses = await ExpensesModel.create(this.body)

    }

    valid() {
        this.cleanUp()

        if (!this.body.price) {
            this.errors.push('Price of spent is a required field')
        }

        if (!this.body.name) {
            this.errors.push('Name of spent is a required field')
        }

        if (!this.body.date) {
            this.errors.push('Date is a required field')
        }

    }

    cleanUp() {

        this.body = {
            price: this.body.price,
            name: this.body.name,
            date: this.formataData(this.body.date)
        }


    }

  formataData(date){

        const data = new Date(date);

        let dia = data.getDate()
        let mes = data.getMonth() + 1
        let ano = data.getFullYear()

        dia = dia < 10 ? '0' + dia : dia;
        mes = mes < 10 ? '0' + mes : mes;

        const dataFormatada = dia + "/" + mes + "/" + ano
        return dataFormatada
        
    }

    async edit(id) {
        if (typeof id !== 'string') return

        this.valid()
        if (this.errors.length > 0) return

        this.expenses = await ExpensesModel.findByIdAndUpdate(id, this.body, { new: true })
    }

}




module.exports = Expenses
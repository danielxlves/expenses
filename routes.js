const express = require('express')
const route = express.Router()
const home = require('./src/controllers/home')
const login = require('./src/controllers/login')
const expenses = require('./src/controllers/expenses')
const {loginRequired} = require('./src/middlewares/middleware')

//Home routes
route.get('/', home.index)

//Login routes
route.get('/login', login.index)
route.post('/login/register', login.register)
route.post('/login/in', login.in)
route.get('/login/out', login.out)

//Expenses routes
route.get('/expenses', loginRequired, expenses.index)
route.post('/expenses/record', loginRequired, expenses.record)
route.get('/expenses/:id', loginRequired, expenses.editIndex)
route.post('/expenses/edit/:id', loginRequired, expenses.edit)
route.get('/expenses/delete/:id', loginRequired, expenses.delete)



module.exports = route
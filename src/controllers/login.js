const Register = require('../models/registerModel ')

exports.index = (req,res) =>{
    if(req.session.user){
        return res.render('login-in')
    }
    return res.render('login.ejs')
}

exports.register = async (req,res) =>{
    try {
    
        const register = new Register(req.body)
        await register.register()

    if(register.errors.length > 0){
        req.flash('errors', register.errors)
        req.session.save(function (){
           return res.redirect('/login')
        })
        return
    }

    req.flash('success', 'Your user has been created.')
    req.session.user = register.user;
    req.session.save(function() {
      return res.redirect('/login');
    })

    } catch (error) {
        console.log(error)
        res.render('404')
    }
}

exports.in = async (req,res) =>{
    try {
        const login = new Register(req.body)
        await login.signIn()

        if(login.errors.length > 0){
        req.flash('errors', login.errors)
        req.session.save(function (){
           return res.redirect('/login')
        })
        return
    }

    req.flash('success', 'You entered the system')
    req.session.user = login.user;
    req.session.save(function() {
      return res.redirect('/login');
    })

    } catch (error) {
        console.log(error)
        res.render('404')
    }

}

exports.out = async (req,res) =>{
    req.session.destroy()
    res.redirect('/')
}

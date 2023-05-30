const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const RegisterSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const RegisterModel = mongoose.model('Register', RegisterSchema)


class Register {
    constructor(body){
        this.body = body
        this.errors = []
        this.user = null
    }

    async signIn(){
        this.valid()
        if(this.errors.length > 0){
            return 
        }

        this.user = await RegisterModel.findOne({email: this.body.email})

        if(!this.user){
            this.errors.push('User does not exists')
            return
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Password invalid')
            this.user = null
        }
    }

    async register(){

        this.valid()
        if(this.errors.length > 0){
            return 
        }

        await this.userExists()

        if(this.errors.length > 0){
            return 
        }

        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        this.user = await RegisterModel.create(this.body)
        
    }

    async userExists(){
       this.user = await RegisterModel.findOne({email: this.body.email})

        if(this.user){
            this.errors.push('User already exist!')
        }

    }

    valid(){
        this.cleanUp()

        if(!validator.isEmail(this.body.email)){
            this.errors.push('Invalid E-mail')
        }

        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push('The password need to have between 3 and 50 caracters')
        }

    }

    cleanUp(){
        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = ''
            }
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}


module.exports = Register

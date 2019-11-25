const express =  require('express')
const bodyParser =  require('body-Parser')
const mongoose = require('mongoose')
const app = express();

const mongoyow = 'mongodb://127.0.0.1:27017/Try'

mongoose.connect(mongoyow,{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=> console.log("Connected to database"))
.catch(error => console.log(error));
app.use(bodyParser.json());

const { User } = require('./schema.js')


app.post('/signup',(req,res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password
    }).save((err,response)=> {
        if(err){
            res.send(err)
        }res.status(200).send(response)
        console.log(response)
    })
})


app.post('/signin',(req,res)=>{
    User.findOne({'email':req.body.email},(err,user)=>{
        if(!user) res.json({message:"Login failed, user not found"})

        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(err) throw err;
            if(isMatch) return res.status(200).json({
                message: "Succesfully log"
            });
            res.status(400).send("Email not found")
        })
    })
})


const port = process.env.PORT || 4000;

app.listen(port,() =>{
    console.log(`server running on  ${port}`);
})
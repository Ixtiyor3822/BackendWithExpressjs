const express = require('express');
const morgan = require('morgan');
const config = require('./config/config')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
app.use(morgan('dev'));
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Orign", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method==='OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, PATCH,DELETE , POST,  GET")
        return res.status(200).json({});
    }
    next();
})

const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/orders');
const userRouter = require('./api/routes/User');

mongoose.connect('mongodb://localhost/qatiy', {useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex:true})
.then(()=>{
    console.log('Bazaga muvaffaqqiyatli ulandingiz');
})
.catch((err) =>{
    console.error(err);
});


app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/user', userRouter);

app.use((req,res,next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req,res,next) =>{
    res.status(error.status||500).json({
        error:{
            message: error.message
        }
    })
});

module.exports =  app;

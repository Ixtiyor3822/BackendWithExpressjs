const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Order = require('./models/Order');
const Product = require('./models/Product');

router.get('/', (req,res) =>{
    Order.find()
    .exec()
    .then(order =>{
        res.status(200).json({
            count: order.length,
            orders: order.map(doc =>{
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/orders'+doc._id
                    }
                }
            })
            
        });
    })
    .catch(err =>{
        res.status(500).json({
            message: 'Order not found',
            error: err
        })
    })
});

router.post('/', (req,res) =>{

    Product.findById({_id: req.body.productId})
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
    
        return order.save()
        .then(order =>{
            console.log(order);
            res.status(201).json({
                message: 'Order stored',
                createdOrder:{
                    _id: order._id,
                    quantity: order.quantity,
                    product: order.product
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/orders' + order._id
                }
            })
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            })
        })
    
    })
   
});

router.get('/:orderId', (req,res)=>{
    const id = req.params.orderId;
    Order.findById(id)
    .exec()
    .then(order =>{
        res.status(200).json({
            order: order,
            request:{
                type: 'GET',
                url: 'http://localhost:5000/orders'
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    })
});

router.delete('/:orderId', (req,res)=>{
    const id = req.params.orderId;
    Order.findByIdAndDelete(id)
    .exec()
    .then(order =>{
        res.status(200).json({
            message: 'Order deleted',
            request:{
                type: 'GET',
                url: 'http://localhost:5000/orders' + id
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
        error: err
        })
    })
});

module.exports = router;
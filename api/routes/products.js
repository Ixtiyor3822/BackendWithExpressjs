const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();
const checkauth = require('./middleware/check-auth');
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads/');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})


const upload = multer({storage: storage});
const Product = require('../routes/models/Product');

router.get('/', (req, res) => {
    const porduct = Product.find()
        .exec()
        .then((docs) => {
            res.status(200).json({
                message: 'Barcha productalar',
                products: docs.map(doc =>{
                    return{
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:5000/products/'+doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.post('/',checkauth,upload.single('productImage'), (req, res) => {

    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
        .then(data => {
            console.log(data);
            res.status(201).json({
                message: 'Yangi producta qo`shildi',
                createdProduct: {
                    name: data.name,
                    price: data.price,
                    _id: data._id,
                    productImage: data.productImage,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:5000/products'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
});

router.get('/:productId', (req, res) => {
    const id = req.params.productId;

    const product = Product.findById({ _id: id })
        .exec()
        .then(doc => {
            res.status(200).json({
                message: 'Product id bo`yicha so`ralgan producta',
                product: {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request:{
                        type: 'GET',
                        url: 'http:localhost:5000/products/'+id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })


});

router.patch('/:productId', (req, res) => {
    const id = req.params.productId;

    const product = Product.findByIdAndUpdate({ _id: id }, {
        name: req.body.newName,
        price: req.body.newPrice
    })
        .exec()
        .then(doc => {
            res.status(200).json({
                message: 'Yangilangan producta',
                newProduct: {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/products/' + id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })

});

router.delete('/:productId', (req, res) => {
    const id = req.params.productId;
    const product = Product.findByIdAndDelete({ _id: id })
        .exec()
        .then(doc => {
            res.status(200).json({
                message: 'O`chirilgan product',
                deleted: doc
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

module.exports = router;
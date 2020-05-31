const express = require('express');
const mongoose = require('mongoose');
const Order = require('../../models/sales/orders');
const Product = require('../../models/sales/products');
const router = express.Router();

router.get('/', (req,res,next) => {
  Order.find().populate('productID', 'name price')
    .select('_id productID qty')
      .exec()
        .then((result) => {
          const results = {
            count: result.length,
            orders: result.map((resultt) => {
              return {
                productID: resultt.productID,
                id: resultt._id,
                qty: resultt.qty,
                request: {
                  type: 'GET',
                  url: `localhost:3000/orders/${resultt._id}`
                }
              }
            })
          }
          res.status(200).send(results);
        }).catch((err) => {
          res.status(500).json({err});
        });
});

router.post('/', (req,res,next) => {
  const order = new Order({
    _id : mongoose.Types.ObjectId(),
    productID: req.body.productID,
    qty: req.body.qty
  });
  Product.findById(req.body.productID)
    .then((product) => {
    return order.save()
    .then((result) => {
      res.status(201).send({
        orderID: result._id,
        productID: result.productID,
        qty: result.qty,
        request: {
          type: 'POST',
          url: `localhost:3000/orders/${result._id}`
        }
      });
    })
    .catch((err) => {
      res.json({error: err});
    });
    })
      .catch((err) => {
        res.status(500).json({error: `there is no such product in the db ${err}`})
      });
});

router.get('/:id', (req,res,next) => {
  const id = req.params.id;
  if(mongoose.Types.ObjectId.isValid(id)){
    Order.findById({_id:id})
      .populate()
        .select('_id productID qty')
          .exec()
            .then((result) => {
              res.status(200).send({
                orders: result,
                request: {
                  type: 'GET',
                  url: `localhost:3000/orders`
                }
              });
            })
              .catch((err) => {
                res.status(500).json({err});
              });
  }else{
    res.send(401).json({
      error: 'Please input a valid order ID'
    });
  }
});

router.patch('/:id', (req,res,next) => {
  const id = req.params.id;
  const order = new Order({
    _id: id,
    productID: req.body.productID,
    qty: req.body.qty
  });
  Order.update({_id: id}, order)
    .exec()
      .then((result) => {
        res.status(201).send({
          order: result,
          request: {
            type: 'GET',
            url: `localhost:3000/orders/${id}`
          }
        });
      })
        .catch(err => res.send(err));
});

router.delete('/:id', (req,res,next) => {
  const id = req.params.id;
  Order.remove({_id: id})
    .exec()
      .then((result) => {
        res.send(result);
      })
        .catch(err => res.send(err));
});

module.exports = router;
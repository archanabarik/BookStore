var http = require('http')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID
var url = require('url')
var query = require('querystring')
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
// Server Config

const PORT = 8000
var mongoDBUrl = 'mongodb://book:cart@ds251217.mlab.com:51217/bookcart'

function initialize (res, callback) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(200, {'Content-Type': 'application/json'})

  MongoClient.connect(mongoDBUrl, function (err, database) {
    const db = database.db('bookcart')
    assert.equal(null, err)
    if (db !== null) { callback(db) }
  })
}

// // Static Config

app.listen(PORT)
console.log('listenning')

//  Get all items
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/items', function (req, res) {
  initialize(res, function (db) {
    db.collection('items').find().toArray(function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify(result))
        db.close()
      }
    })
  })
})

// Get cart items by user identifier

app.get('/cart', function (req, res) {
  initialize(res, function (db) {
    db.collection('cart').find().toArray(function (err, result) {
    // db.collection('cart').find({ 'userId': url.parse(req.url, true).query.userId }).toArray(function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify(result))
       // db.close()
      }
    })
  })
})

// Set cart

app.post('/add', function (req, res) {
  console.log('-------', req.body)
  initialize(res, function (db) {
    db.collection('cart').insertOne(req.body, function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify({ msg: '' }))
        db.close()
      }
    })
  })
})

// Set review

app.post('/addreview', function (req, res) {
  console.log(req.body)
  initialize(res, function (db) {
    db.collection('review').insertOne(req.body, function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify({ msg: '' }))
       // db.close()
      }
    })
  })
})

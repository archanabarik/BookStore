var http = require('http')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID
var url = require('url')
var query = require('querystring')
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const config = require('./config.js')
// Server Config

const PORT = 8080
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
console.log('listenning to the port', PORT)

//  Get all items
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// -- JWT check

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.CLIENT_DOMAIN}/.well-known/jwks.json`
  }),
  audience: config.AUTH0_AUDIENCE,
  issuer: `https://${config.CLIENT_DOMAIN}/`,
  algorithm: 'RS256'
})

const adminCheck = (req, res, next) => {
  const roles = req.user[config.NAMESPACE] || []
  if (roles.indexOf('admin') > -1) {
    next()
  } else {
    res.status(401).send({message: 'Not authorized for admin access'})
  }
}

app.get('/items', function (req, res) {
  initialize(res, function (db) {
    db.collection('items').find().toArray(function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify(result))
        // db.close()
      }
    })
  })
})

// Get item by identifier

app.get('/item', function (req, res) {
  initialize(res, function (db) {
    db.collection('items').find({ 'id': url.parse(req.url, true).query.id }).each(function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        console.log(JSON.stringify(result))
        res.end(JSON.stringify(result))
        // db.close()
      }
    })
  })
})

// Set item

app.post('/insert', function (req, res) {
  console.log('-------', req.body.insert)
  initialize(res, function (db) {
    db.collection('items').insertOne(JSON.parse(req.body.insert), function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify({ msg: '' }))
       // db.close()
      }
    })
  })
})

// Update item

app.post('/update', function (req, res) {
  var update = JSON.parse(req.body.update)
  console.log('----', update.id)
  initialize(res, function (db) {
    db.collection('items').find({ 'id': update.id }).each(function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        // console.log('----', result)
        db.collection('items').updateOne(result, {$set: update}, function (err, updateresult) {
          assert.equal(err, null)
          // console.log(updateresult)
          if (updateresult !== null) {
            res.end(JSON.stringify({ msg: '' }))
            // db.close()
          }
        })
      }
    })
  })
})

// Get cart items by user identifier

app.get('/cart', function (req, res) {
  console.log(req.url)
  initialize(res, function (db) {
    // db.collection('cart').find().toArray(function (err, result) {
    db.collection('cart').find({ 'userId': url.parse(req.url, true).query.userId }).toArray(function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify(result))
        // db.close()
      }
    })
  })
})

function removeUnwantedKeys (body) {
  delete body['paid']
  delete body['name']
  delete body['code']
  delete body['unitPrice']
  return body
}

app.post('/revise', function (req, res) {
  var revise = JSON.parse(req.body.revise)
  revise = removeUnwantedKeys(revise)
  revise._id = new ObjectId(revise._id)
  console.log('/////', revise.itemId)
  initialize(res, function (db) {
    db.collection('cart').find({ '_id': revise._id }).each(function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        console.log(revise)
        db.collection('cart').updateOne(result, {$set: {'quantity': revise.quantity}}, function (err, updateresult) {
          assert.equal(err, null)
          if (updateresult !== null) {
            res.end(JSON.stringify({ msg: '' }))
            // db.close()
          }
        })
      }
    })
  })
})

app.post('/remove', function (req, res) {
  var remove = JSON.parse(req.body.remove)
  remove = removeUnwantedKeys(remove)
  remove._id = new ObjectId(remove._id)
  console.log('----', remove)
  initialize(res, function (db) {
    db.collection('cart').deleteOne(remove, function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify({ msg: '' }))
        // db.close()
      }
    })
  })
})

//  Get reviews by item

app.get('/review', function (req, res) {
  initialize(res, function (db) {
    db.collection('review').find({ 'itemId': url.parse(req.url, true).query.itemId }).toArray(function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify(result))
        // db.close()
      }
    })
  })
})

// Get review count for given item

app.get('/reviewcount', function (req, res) {
  initialize(res, function (db) {
    db.collection('review').find({ 'itemId': url.parse(req.url, true).query.itemId }).count(function (err, count) {
      res.end(JSON.stringify(count))
      // db.close()
    })
  })
})

//  Get ratings for shop items

app.get('/ratings', function (req, res) {
  initialize(res, function (db) {
    db.collection('review').aggregate([{$group: {_id: '$itemId', rating: {$avg: '$rating'}}}]).toArray(function (err, result) {
      var ratings = {}
      for (item of result) {
        ratings[item['_id']] = item['rating']
      }

      res.end(JSON.stringify(ratings))
      // db.close()
    })
  })
})

// Set cart

app.post('/add', function (req, res) {
  console.log('-------', req.body)
  initialize(res, function (db) {
    db.collection('cart').insertOne(JSON.parse(req.body.add), function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify({ msg: '' }))
       // db.close()
      }
    })
  })
})

// Set review

app.post('/addreview', function (req, res) {
  console.log(req.body)
  initialize(res, function (db) {
    db.collection('review').insertOne(JSON.parse(req.body.review), function (err, result) {
      assert.equal(err, null)
      if (result !== null) {
        res.end(JSON.stringify({ msg: '' }))
       // db.close()
      }
    })
  })
})
